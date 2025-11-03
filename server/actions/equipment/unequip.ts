import type { ActionHandler } from '../types'
import type { ItemId } from '~~/shared/config'
import { items } from '~~/shared/config'

export const unequipItem: ActionHandler = async ({ character, payload }) => {
  const { slot } = payload as { slot: 'weapon' | 'armor' | 'accessory' }
  
  const equippedItemId = character.equipment[slot]
  if (!equippedItemId) {
    throw new Error('Không có trang bị nào ở vị trí này.')
  }

  const itemData = items[equippedItemId as ItemId]
  
  // Thêm lại vào túi đồ
  const existingInInventory = character.inventory.find(item => item.itemId === equippedItemId)
  if (existingInInventory) {
    existingInInventory.quantity += 1
  } else {
    character.inventory.push({ itemId: equippedItemId, quantity: 1 })
  }

  // Tháo trang bị
  character.equipment[slot] = null

  character.markModified('equipment')
  character.markModified('inventory')

  return {
    log: [{ message: `Đã tháo ${itemData?.name || equippedItemId} khỏi ${slot}.`, type: 'info' }],
    updates: {
      character: {
        equipment: character.equipment,
        inventory: character.inventory
      }
    }
  }
}
