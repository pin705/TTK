import type { ICharacter } from '~~/server/models/character.model'
import { getExpRequiredForLevel, STAT_GAINS_PER_LEVEL, getRaceStatGains, applyRacialBonuses } from '~~/shared/config' // Import config mới
import type { LogPayload } from './logger' // Import LogPayload
import type { RaceId } from '~~/shared/config/races'

/**
 * Kiểm tra và xử lý việc tăng level cho nhân vật sau khi nhận EXP.
 * Hàm này sẽ được gọi sau khi character.cultivation.exp đã được cộng.
 * @returns Mảng LogPayload thông báo lên cấp (nếu có).
 */
export function checkAndApplyLevelUp(character: ICharacter): LogPayload[] {
  const levelUpLogs: LogPayload[] = []
  let currentLevel = character.level
  let expRequired = getExpRequiredForLevel(currentLevel + 1)

  // Get race-specific stat gains
  const raceGains = character.race ? getRaceStatGains(character.race as RaceId) : STAT_GAINS_PER_LEVEL

  // Vòng lặp để xử lý trường hợp lên nhiều cấp cùng lúc
  while (character.cultivation.exp >= expRequired && expRequired > 0) { // expRequired > 0 để tránh vòng lặp vô hạn nếu công thức lỗi
    // 1. Tăng Level
    currentLevel += 1
    character.level = currentLevel

    // 2. Trừ EXP đã dùng để lên cấp (không reset về 0)
    character.cultivation.exp -= expRequired

    // 3. Cộng chỉ số cơ bản dựa theo chủng tộc
    character.hpMax += raceGains.hpMax
    character.energyMax += raceGains.energyMax
    character.stats.attack += raceGains.attack
    character.stats.defense += raceGains.defense
    character.stats.speed += raceGains.speed
    character.stats.spirit += raceGains.spirit
    
    // Hồi đầy HP/Energy khi lên cấp
    character.hp = character.hpMax
    character.energy = character.energyMax

    // ✨ 4. CỘNG ĐIỂM TIỀM NĂNG ✨
    character.statPoints += raceGains.statPoints

    // Apply racial bonuses
    if (character.race) {
      character.stats = applyRacialBonuses(character.stats, character.race as RaceId)
    }

    // 5. Tạo Log thông báo
    // 5. Tạo Log thông báo (Thêm thông tin điểm tiềm năng)
    levelUpLogs.push({
      message: `✨ Chúc mừng! Đạt Level ${currentLevel}! Nhận được ${raceGains.statPoints} điểm tiềm năng! ✨`,
      type: 'success'
    })

    // 5. Tính EXP cho level tiếp theo
    expRequired = getExpRequiredForLevel(currentLevel + 1)
    // Dừng nếu đạt max level (ví dụ expRequired trả về 0 hoặc âm)
    if (expRequired <= 0) break
  }

  return levelUpLogs
}

/**
 * Tính toán lại chỉ số tổng hợp của nhân vật.
 * Nên được gọi sau khi lên cấp, cộng điểm tiềm năng, hoặc thay đổi trang bị.
 */
export function recalculateStats(character: ICharacter) {
  // Get race-specific stat gains for base calculation
  const raceGains = character.race ? getRaceStatGains(character.race as RaceId) : STAT_GAINS_PER_LEVEL
  
  // Logic tính toán base stats từ level (nếu cần) - use race gains
  const baseAttack = 10 + (character.level - 1) * raceGains.attack
  const baseDefense = 5 + (character.level - 1) * raceGains.defense
  const baseSpeed = 10 + (character.level - 1) * raceGains.speed
  const baseSpirit = 10 + (character.level - 1) * raceGains.spirit

  // Tính chỉ số từ trang bị (equipment) - lấy data item từ config
  const equipmentStats = calculateEquipmentStats(character)

  // Tính tổng
  character.stats.attack = baseAttack + character.allocatedStats.attack + equipmentStats.attack
  character.stats.defense = baseDefense + character.allocatedStats.defense + equipmentStats.defense
  character.stats.speed = baseSpeed + character.allocatedStats.speed + equipmentStats.speed
  character.stats.spirit = baseSpirit + equipmentStats.spirit
  character.stats.critChance = 0.05 + equipmentStats.critChance // Base 5% crit
  character.stats.critDamage = 1.5 + equipmentStats.critDamage // Base 150% crit damage
  character.stats.dodgeChance = 0.05 + equipmentStats.dodgeChance // Base 5% dodge
  character.stats.resistance = 0 + equipmentStats.resistance

  // Apply racial bonuses
  if (character.race) {
    character.stats = applyRacialBonuses(character.stats, character.race as RaceId)
  }

  // Cập nhật lại HP/Energy Max từ điểm cộng + equipment
  character.hpMax = (100 + (character.level - 1) * raceGains.hpMax) + character.allocatedStats.hpMax + equipmentStats.hpMax
  character.energyMax = (500 + (character.level - 1) * raceGains.energyMax) + character.allocatedStats.energyMax + equipmentStats.energyMax

  // Đảm bảo HP/Energy hiện tại không vượt quá max mới
  character.hp = Math.min(character.hp, character.hpMax)
  character.energy = Math.min(character.energy, character.energyMax)

  character.markModified('stats')
  character.markModified('hpMax')
  character.markModified('energyMax')
}

/**
 * Tính toán tổng chỉ số từ trang bị hiện tại
 */
function calculateEquipmentStats(character: ICharacter) {
  const stats = {
    attack: 0,
    defense: 0,
    speed: 0,
    spirit: 0,
    critChance: 0,
    critDamage: 0,
    dodgeChance: 0,
    resistance: 0,
    hpMax: 0,
    energyMax: 0
  }

  // Import items config
  const { items } = await import('~~/shared/config')
  
  // Check weapon
  if (character.equipment.weapon) {
    const weaponData = items[character.equipment.weapon as keyof typeof items]
    if (weaponData?.stats) {
      Object.keys(weaponData.stats).forEach(key => {
        if (key in stats) {
          stats[key as keyof typeof stats] += weaponData.stats[key] || 0
        }
      })
    }
  }

  // Check armor
  if (character.equipment.armor) {
    const armorData = items[character.equipment.armor as keyof typeof items]
    if (armorData?.stats) {
      Object.keys(armorData.stats).forEach(key => {
        if (key in stats) {
          stats[key as keyof typeof stats] += armorData.stats[key] || 0
        }
      })
    }
  }

  // Check accessory
  if (character.equipment.accessory) {
    const accessoryData = items[character.equipment.accessory as keyof typeof items]
    if (accessoryData?.stats) {
      Object.keys(accessoryData.stats).forEach(key => {
        if (key in stats) {
          stats[key as keyof typeof stats] += accessoryData.stats[key] || 0
        }
      })
    }
  }

  return stats
}
