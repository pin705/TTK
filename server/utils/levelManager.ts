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

  // Logic tính chỉ số từ trang bị (equipment) - cần lấy data item từ config
  const equipmentAttack = 0
  const equipmentDefense = 0
  // ...

  // Tính tổng
  character.stats.attack = baseAttack + character.allocatedStats.attack + equipmentAttack
  character.stats.defense = baseDefense + character.allocatedStats.defense + equipmentDefense
  character.stats.speed = baseSpeed
  character.stats.spirit = baseSpirit
  // Tương tự cho các chỉ số khác...

  // Apply racial bonuses
  if (character.race) {
    character.stats = applyRacialBonuses(character.stats, character.race as RaceId)
  }

  // Cập nhật lại HP/Energy Max từ điểm cộng
  character.hpMax = (100 + (character.level - 1) * raceGains.hpMax) + character.allocatedStats.hpMax // Giả sử base HP là 100
  character.energyMax = (500 + (character.level - 1) * raceGains.energyMax) + character.allocatedStats.energyMax // Giả sử base Energy là 500

  // Đảm bảo HP/Energy hiện tại không vượt quá max mới
  character.hp = Math.min(character.hp, character.hpMax)
  character.energy = Math.min(character.energy, character.energyMax)

  character.markModified('stats')
  character.markModified('hpMax')
  character.markModified('energyMax')
}
