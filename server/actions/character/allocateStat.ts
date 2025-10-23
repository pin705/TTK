import { z } from 'zod'
import type { ActionHandler } from '../types'
import { ALLOCATABLE_STATS, type AllocatableStat } from '~~/shared/config' // Import config

const allocateStatPayloadSchema = z.object({
  stat: z.enum(ALLOCATABLE_STATS), // Chỉ cho phép tăng các chỉ số trong danh sách
  amount: z.number().int().positive('Số điểm phải là số nguyên dương') // Số điểm muốn cộng
})

export const allocateStat: ActionHandler = async ({ character, payload }) => {
  const { stat, amount } = allocateStatPayloadSchema.parse(payload)

  // 1. Kiểm tra điểm tiềm năng
  if (character.statPoints < amount) {
    throw new Error(`Không đủ điểm tiềm năng (hiện có: ${character.statPoints}).`)
  }

  // 2. Trừ điểm tiềm năng và cộng vào chỉ số tương ứng
  character.statPoints -= amount
  character.allocatedStats[stat] += amount

  // 3. Cập nhật lại chỉ số tổng (ví dụ)
  // Lưu ý: Cần có hàm tính toán chỉ số tổng hợp ở một nơi khác
  // Ví dụ: calculateTotalStats(character)
  // Ở đây chúng ta chỉ cập nhật phần allocated cho đơn giản
  if (stat === 'hpMax') character.hpMax += amount // Cần cập nhật cả max value
  if (stat === 'energyMax') character.energyMax += amount // Cần cập nhật cả max value

  // Tạm thời cộng trực tiếp vào stats để thấy thay đổi,
  // nhưng lý tưởng là nên có hàm tính lại toàn bộ stats
  character.stats[stat] += amount

  return {
    log: [{
      message: `Đã cộng ${amount} điểm vào ${stat}. Bạn còn lại ${character.statPoints} điểm tiềm năng.`,
      type: 'success'
    }],
    updates: {
      character: { // Chỉ gửi các trường đã thay đổi
        statPoints: character.statPoints,
        allocatedStats: character.allocatedStats,
        stats: character.stats, // Gửi lại stats tổng nếu đã tính lại
        hpMax: character.hpMax,
        energyMax: character.energyMax
      }
    }
  }
}
