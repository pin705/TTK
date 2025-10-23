import type { ICharacter } from '~~/server/models/character.model'
import { getExpRequiredForLevel, STAT_GAINS_PER_LEVEL } from '~~/shared/config' // Import config mới
import type { LogPayload } from './logger' // Import LogPayload

/**
 * Kiểm tra và xử lý việc tăng level cho nhân vật sau khi nhận EXP.
 * Hàm này sẽ được gọi sau khi character.cultivation.exp đã được cộng.
 * @returns Mảng LogPayload thông báo lên cấp (nếu có).
 */
export function checkAndApplyLevelUp(character: ICharacter): LogPayload[] {
  const levelUpLogs: LogPayload[] = []
  let currentLevel = character.level
  let expRequired = getExpRequiredForLevel(currentLevel + 1)

  // Vòng lặp để xử lý trường hợp lên nhiều cấp cùng lúc
  while (character.cultivation.exp >= expRequired && expRequired > 0) { // expRequired > 0 để tránh vòng lặp vô hạn nếu công thức lỗi
    // 1. Tăng Level
    currentLevel += 1
    character.level = currentLevel

    // 2. Trừ EXP đã dùng để lên cấp (không reset về 0)
    character.cultivation.exp -= expRequired

    // 3. Cộng chỉ số cơ bản
    character.hpMax += STAT_GAINS_PER_LEVEL.hpMax
    character.energyMax += STAT_GAINS_PER_LEVEL.energyMax
    character.stats.attack += STAT_GAINS_PER_LEVEL.attack
    character.stats.defense += STAT_GAINS_PER_LEVEL.defense
    // Hồi đầy HP/Energy khi lên cấp
    character.hp = character.hpMax
    character.energy = character.energyMax

    // ✨ 4. CỘNG ĐIỂM TIỀM NĂNG ✨
    character.statPoints += STAT_GAINS_PER_LEVEL.statPoints

    // 5. Tạo Log thông báo
    // 5. Tạo Log thông báo (Thêm thông tin điểm tiềm năng)
    levelUpLogs.push({
      message: `✨ Chúc mừng! Đạt Level ${currentLevel}! Nhận được ${STAT_GAINS_PER_LEVEL.statPoints} điểm tiềm năng! ✨`,
      type: 'success'
    })

    // 5. Tính EXP cho level tiếp theo
    expRequired = getExpRequiredForLevel(currentLevel + 1)
    // Dừng nếu đạt max level (ví dụ expRequired trả về 0 hoặc âm)
    if (expRequired <= 0) break
  }

  return levelUpLogs
}
