import { z } from 'zod'
import type { ActionHandler } from '../types'

const gatherPayloadSchema = z.object({
  itemId: z.string()
})

export const gather: ActionHandler = async ({ character, payload }) => {
  const { itemId } = gatherPayloadSchema.parse(payload)

  const zone = await ZoneManager.getZone(character.currentZoneId)
  if (!zone)
    throw new Error('Không tìm thấy khu vực.')

  const resourceNode = zone.resources.find(r => r.itemId === itemId)
  if (!resourceNode || resourceNode.spawnChance < Math.random())
    throw new Error('Không tìm thấy tài nguyên này.')

  // Thêm vật phẩm vào túi đồ
  const quantity = Math.floor(Math.random() * (resourceNode.quantity[1] - resourceNode.quantity[0] + 1)) + resourceNode.quantity[0]
  addItemToInventory(character, itemId, quantity)

  // ✨ CẬP NHẬT TIẾN TRÌNH QUEST 'GATHER' ✨
  const questCompleted = QuestManager.updateProgress(character, 'gather', itemId, quantity)
  const logMessage = `Bạn đã thu thập được ${quantity} x [${itemId}].`
  const logs: LogPayload[] = [{ message: logMessage, type: 'reward' }]

  if (questCompleted) {
    logs.push({ message: 'Một nhiệm vụ đã hoàn thành mục tiêu!', type: 'info' })
  }

  return {
    log: logs,
    updates: {
      character: { inventory: character.inventory },
      zone // Cập nhật lại zone để tài nguyên biến mất
    }
  }
}
