import { z } from 'zod'
import { ActionHandler } from '../types'

// Định nghĩa payload cho hành động này
const movePayloadSchema = z.object({
  direction: z.string(),
})

// Logic xử lý hành động
export const move: ActionHandler = async ({ character, payload }) => {
  const { direction } = movePayloadSchema.parse(payload)

  const currentZone = await Zone.findById(character.currentZoneId)
  if (!currentZone)
    throw new Error('Không tìm thấy khu vực hiện tại của nhân vật.')

  const exit = currentZone.connectedZones.find(z => z.direction === direction)
  if (!exit)
    throw new Error('Không thể đi theo hướng này.')

  // TODO: Kiểm tra năng lượng, các điều kiện khác...
  // Ví dụ:
  // if (character.energy < 5) {
  //   throw new Error('Không đủ năng lượng để di chuyển.');
  // }
  // character.energy -= 5;

  character.currentZoneId = exit.zoneId

  const newZone = await Zone.findById(character.currentZoneId)
    .populate('monsters.monsterId')
    .lean()

  if (!newZone)
    throw new Error('Khu vực đích không tồn tại.')

  // Trả về kết quả để client cập nhật
  return {
    log: `Bạn đã di chuyển đến ${newZone.name}.`,
    updates: {
      zone: newZone,
      character: { // Chỉ gửi những trường thay đổi
        energy: character.energy,
        currentZoneId: character.currentZoneId,
      },
    },
  }
}
