import { z } from 'zod'
import type { ActionHandler } from '../types'

// Định nghĩa payload cho hành động này
const movePayloadSchema = z.object({
  direction: z.string()
})

// Logic xử lý hành động
export const move: ActionHandler = async ({ character, payload }) => {
  const { direction } = movePayloadSchema.parse(payload)
  const currentZoneData = ZoneManager.getZone(character.currentZoneId as ZoneId)

  if (!currentZoneData)
    throw new Error('Không tìm thấy khu vực hiện tại của nhân vật.')

  const exit = currentZoneData.connectedZones?.find(z => z.direction === direction)
  if (!exit)
    throw new Error('Không thể đi theo hướng này.')

  // TODO: Kiểm tra năng lượng, các điều kiện khác...
  // if (character.energy < 5) {
  //   throw new Error('Không đủ năng lượng để di chuyển.');
  // }
  // character.energy -= 5;

  // LỖI NẰM Ở ĐÂY - SỬA LẠI HOÀN TOÀN
  // 1. Lấy dữ liệu zone mới từ config
  const newZoneData = ZoneManager.getZone(exit.zoneId as ZoneId)
  if (!newZoneData)
    throw new Error(`Khu vực đích '${exit.zoneId}' không tồn tại.`)

  // 2. "Populate" (làm đầy) thông tin quái vật thủ công
  const populatedMonsters = (newZoneData.monsters || []).map((monsterEntry) => {
    return {
      ...monsterEntry,
      // Lấy thông tin chi tiết của quái vật từ MonsterManager
      monsterData: MonsterManager.getMonsterTemplate(monsterEntry.monsterId)
    }
  })

  // 3. Tạo object zone hoàn chỉnh để gửi về cho client
  const newZone = {
    ...newZoneData,
    monsters: populatedMonsters
  }

  // 4. Cập nhật vị trí mới cho nhân vật
  character.currentZoneId = exit.zoneId

  // Trả về kết quả để client cập nhật
  return {
    log: `Bạn đã di chuyển đến ${newZone.name}.`,
    updates: {
      zone: newZone,
      character: { // Chỉ gửi những trường thay đổi
        energy: character.energy,
        currentZoneId: character.currentZoneId
      }
    }
  }
}
