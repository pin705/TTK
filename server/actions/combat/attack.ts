import type { ActionHandler } from '../types'

// Xử lý khi người chơi chiến thắng
function handleVictory(character: any, monsterData: any, monsterTemplate: any) {
  character.inCombat = false
  character.cultivation.exp += monsterTemplate.expReward

  const logs: any[] = [{ message: `Bạn đã tiêu diệt [${monsterData.name}]! Nhận được ${monsterTemplate.expReward} EXP.`, type: 'victory' }]

  monsterTemplate.drops.forEach((drop: any) => {
    if (Math.random() < drop.chance) {
      const quantity = Math.floor(Math.random() * (drop.quantity[1] - drop.quantity[0] + 1)) + drop.quantity[0]
      addItemToInventory(character, drop.itemId, quantity)
      logs.push({ message: `Bạn nhận được [${drop.itemId}] x${quantity}.`, type: 'reward' })
    }
  })

  return logs
}

// Xử lý khi người chơi bị đánh bại
function handleDefeat(character: any, monsterData: any) {
  character.inCombat = false
  character.hp = Math.floor(character.hpMax * 0.1)
  character.cultivation.stateOfMind = Math.max(0.1, character.cultivation.stateOfMind - 0.2)

  return { message: `Bạn đã bị [${monsterData.name}] đánh bại! Hồi sinh với 10% HP và tâm cảnh giảm.`, type: 'defeat' }
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
    const victoryLogs = handleVictory(character, monsterData, monsterTemplate)
    turnLogs.push(...victoryLogs)
    await redis.del(monsterKey)
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
