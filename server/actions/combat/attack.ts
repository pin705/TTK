import type { ActionHandler } from '../types'

// Xử lý khi người chơi chiến thắng
async function handleVictory(character: any, monsterData: any, monsterTemplate: any, monsterKey) {
  character.inCombat = false
  character.cultivation.exp += monsterTemplate.expReward

  const logs: any[] = [{ message: `Bạn đã tiêu diệt [${monsterData.name}]! Nhận được ${monsterTemplate.expReward} EXP.`, type: 'victory' }]

  const questCompleted = QuestManager.updateProgress(character, 'kill', monsterData.templateId, 1)
  if (questCompleted) {
    logs.push({ message: 'Một nhiệm vụ đã hoàn thành mục tiêu!', type: 'info' })
  }

  // 2. ✨ KIỂM TRA TĂNG LEVEL ✨
  const levelUpLogs = checkAndApplyLevelUp(character)
  logs.push(...levelUpLogs) // Thêm log lên cấp (nếu có)

  // Initialize resources if not exists
  if (!character.resources) {
    character.resources = { energyCrystals: 0 }
  }

  monsterTemplate.drops.forEach((drop: any) => {
    if (Math.random() < drop.chance) {
      const quantity = Math.floor(Math.random() * (drop.quantity[1] - drop.quantity[0] + 1)) + drop.quantity[0]
      
      // Special handling for energy crystals
      if (drop.itemId === 'energy_crystal') {
        character.resources.energyCrystals += quantity
        logs.push({ message: `Bạn nhận được ${quantity} Tinh Thể Năng Lượng.`, type: 'reward' })
      } else {
        addItemToInventory(character, drop.itemId, quantity)
        logs.push({ message: `Bạn nhận được [${drop.itemId}] x${quantity}.`, type: 'reward' })
      }
    }
  })

  await redis.del(monsterKey)
  return logs
}

// Xử lý khi người chơi bị đánh bại
function handleDefeat(character: ICharacter, monsterData: unknown) {
  character.inCombat = false
  character.combat = null
  character.hp = Math.max(1, Math.floor(character.hpMax * 0.05)) // Hồi sinh với 5% HP (tối thiểu 1)
  character.cultivation.stateOfMind = Math.max(0.1, character.cultivation.stateOfMind - 0.3) // Giảm mạnh tâm cảnh

  // Get death penalty from current zone
  const currentZone = ZoneManager.getZone(character.currentZoneId as any)
  let crystalLossMessage = ''
  if (currentZone && (currentZone as any).deathPenalty?.energyCrystalLoss) {
    const lossPercent = (currentZone as any).deathPenalty.energyCrystalLoss
    if (character.resources?.energyCrystals) {
      const crystalsLost = Math.floor(character.resources.energyCrystals * lossPercent)
      if (crystalsLost > 0) {
        character.resources.energyCrystals -= crystalsLost
        crystalLossMessage = ` Bạn đã mất ${crystalsLost} Tinh Thể Năng Lượng (${Math.floor(lossPercent * 100)}%).`
      }
    }
  }

  // Đưa về khu vực hồi sinh
  const respawnZoneId = (currentZone as any)?.respawnLocation || 'giang_nam_khu_dan_cu_01'
  character.currentZoneId = respawnZoneId

  // Áp dụng Debuff "Trọng Thương"
  const woundDurationSeconds = 60 // 60 giây
  character.effects.push({
    effectId: 'heavy_wound',
    name: 'Trọng Thương',
    expiresAt: new Date(Date.now() + woundDurationSeconds * 1000), // 60 giây
    preventsCombat: true,
    hpRegenModifier: -1 // Ngăn chặn hồi phục tự nhiên
  })
  // Xóa các buff có lợi khác nếu cần

  return { message: `Bạn đã bị [${monsterData.name}] đánh bại! Bị đưa về ${ZoneManager.getZone(respawnZoneId)?.name}.${crystalLossMessage} Trạng thái Trọng Thương trong ${woundDurationSeconds} giây.`, type: 'defeat' }
}

// --- Action Attack chính ---

export const attack: ActionHandler = async ({ character }) => {
  if (!character.inCombat || !character.combat?.monsterId) throw new Error('Bạn không ở trong trận chiến.')

  const monsterKey = MonsterEngine.getMonsterKey(character.currentZoneId, character.combat.monsterId)
  const monsterData = await MonsterEngine.getMonsterInZone(character.currentZoneId, character.combat.monsterId)

  // 1. KIỂM TRA QUÁI VẬT TỒN TẠI
  if (!monsterData.id) {
    character.inCombat = false
    return {
      log: [{ message: `Mục tiêu [${character.combat.monsterName}] đã biến mất hoặc bị người khác tiêu diệt.`, type: 'warning' }],
      updates: { character: { inCombat: false, combat: null } }
    }
  }

  const monsterTemplate = MonsterManager.getMonsterTemplate(monsterData.templateId as any)
  if (!monsterTemplate) {
    character.inCombat = false
    await redis.del(monsterKey)
    throw new Error('Lỗi dữ liệu: Không tìm thấy thông tin gốc của quái vật.')
  }

  const turnLogs: any[] = []
  const currentHp = parseInt(monsterData.hp, 10) || 0

  // Kiểm tra nếu HP đã là NaN hoặc <= 0 từ trước (có thể do lỗi khác hoặc người chơi khác vừa giết)
  if (isNaN(currentHp) || currentHp <= 0) {
    character.inCombat = false
    await redis.del(monsterKey)
    // Không cần xóa khỏi Redis vì có thể người khác đã xóa rồi
    return {
      log: [{ message: `Mục tiêu [${monsterData.name}] đã bị tiêu diệt.`, type: 'warning' }],
      updates: {
        character: { inCombat: false, combat: null },
        // Nên cập nhật lại zone monsters ở đây
        zone: { monsters: await MonsterEngine.getMonstersInZone(character.currentZoneId) }
      }
    }
  }

  const currentMonsterState = {
    stats: monsterTemplate.stats, hp: currentHp, effects: []
  }

  // 2. LƯỢT CỦA NGƯỜI CHƠI
  const playerAttack = calculateDamage(character, currentMonsterState)
  const newHp = currentMonsterState.hp - playerAttack.damage
  turnLogs.push({ message: `Bạn tấn công [${monsterData.name}], ${playerAttack.isCrit ? 'CHÍ MẠNG!' : ''} gây ${playerAttack.damage} sát thương.`, type: 'attack' })

  // 3. KIỂM TRA KẾT QUẢ
  if (newHp <= 0) {
    // Người chơi thắng
    const victoryLogs = await handleVictory(character, monsterData, monsterTemplate, monsterKey)
    turnLogs.push(...victoryLogs)
  } else {
    // Quái vật còn sống, cập nhật HP và phản công
    await redis.hset(monsterKey, 'hp', newHp)
    currentMonsterState.hp = newHp

    const monsterAttack = calculateDamage(currentMonsterState, character)
    character.hp -= monsterAttack.damage
    turnLogs.push({ message: `[${monsterData.name}] phản công, bạn mất ${monsterAttack.damage} HP.`, type: 'attack' })

    if (character.hp <= 0) {
      // Người chơi thua
      const defeatLog = handleDefeat(character, monsterData)
      turnLogs.push(defeatLog)
    }
  }

  // 4. LUÔN LUÔN CẬP NHẬT TRẠNG THÁI MỚI NHẤT
  const activeMonsters = await MonsterEngine.getMonstersInZone(character.currentZoneId)

  return {
    log: turnLogs,
    updates: {
      character: { ...character.toObject() }, // Gửi lại toàn bộ object character đã được cập nhật
      zone: { monsters: activeMonsters }
    }
  }
}
