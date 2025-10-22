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

  // Xóa tài nguyên khỏi khu vực sau khi thu thập
  zone.resources = zone.resources.filter(r => r.itemId !== itemId)
  await zone.save()

  // Thêm vật phẩm vào túi đồ
  const quantity = Math.floor(Math.random() * (resourceNode.quantity[1] - resourceNode.quantity[0] + 1)) + resourceNode.quantity[0]
  addItemToInventory(character, itemId, quantity)

  return {
    log: {
      message: `Bạn đã thu thập được ${quantity} x [${itemId}].`,
      type: 'reward'
    },
    updates: {
      character: { inventory: character.inventory },
      zone // Cập nhật lại zone để tài nguyên biến mất
    }
  }
}
