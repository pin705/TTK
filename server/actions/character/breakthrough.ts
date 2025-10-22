import type { ActionHandler } from '../types'

export const breakthrough: ActionHandler = async ({ character }) => {
  const currentRealm = CultivationManager.getRealm(character.cultivation.stageId)
  if (!currentRealm)
    throw new Error('Không tìm thấy thông tin cảnh giới hiện tại.')

  // 1. Kiểm tra điều kiện
  if (character.cultivation.exp < currentRealm.expRequired)
    throw new Error('Tu vi chưa đủ, không thể đột phá.')

  const nextRealm = CultivationManager.getNextRealm(currentRealm.level)
  if (!nextRealm)
    throw new Error('Bạn đã đạt tới cảnh giới cao nhất hiện tại.')

  // 2. Tính toán tỷ lệ thành công
  // Tâm cảnh ảnh hưởng lớn đến tỷ lệ thành công
  // stateOfMind = 1.0 -> không đổi. > 1.0 -> tăng. < 1.0 -> giảm.
  const successChance = nextRealm.breakthrough.baseSuccessChance * character.cultivation.stateOfMind
  const isSuccess = Math.random() < successChance

  // 3. Xử lý kết quả
  if (isSuccess) {
    // THÀNH CÔNG
    character.cultivation.stage = nextRealm.name
    character.cultivation.stageId = nextRealm.stageId
    character.cultivation.exp = 0 // Reset EXP
    character.cultivation.stateOfMind = Math.min(2.0, character.cultivation.stateOfMind + 0.1) // Tâm cảnh tăng nhẹ

    // Cộng chỉ số
    character.stats.attack += nextRealm.statGains.attack
    character.stats.defense += nextRealm.statGains.defense
    character.hpMax += nextRealm.statGains.hpMax
    character.energyMax += nextRealm.statGains.energyMax
    character.hp = character.hpMax // Hồi đầy HP và Năng lượng
    character.energy = character.energyMax

    return {
      log: `⚡ ĐỘT PHÁ THÀNH CÔNG! ⚡ Bạn đã bước vào cảnh giới [${nextRealm.name}]. Sức mạnh tăng vọt!`,
      updates: { character }
    }
  } else {
    // THẤT BẠI
    const expLoss = Math.floor(character.cultivation.exp * nextRealm.breakthrough.failurePenalty.expLossPercent)
    character.cultivation.exp -= expLoss
    character.cultivation.stateOfMind = Math.max(0.1, character.cultivation.stateOfMind - 0.3) // Tâm cảnh giảm mạnh

    return {
      log: `Đột phá thất bại! Linh khí phản phệ, bạn mất ${expLoss} tu vi, tâm cảnh bất ổn.`,
      updates: {
        character: { cultivation: character.cultivation }
      }
    }
  }
}
