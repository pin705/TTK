import type { ActionHandler } from '../types'
import type { ItemId } from '~~/shared/config'
import { items } from '~~/shared/config'

export const equipItem: ActionHandler = async ({ character, payload }) => {
  const { itemId } = payload as { itemId: ItemId }
  
  // Kiểm tra xem vật phẩm có trong túi đồ không
  const inventoryItem = character.inventory.find(item => item.itemId === itemId)
  if (!inventoryItem || inventoryItem.quantity < 1) {
    throw new Error('Bạn không có vật phẩm này trong túi đồ.')
  }

  // Lấy thông tin vật phẩm
  const itemData = items[itemId]
  if (!itemData) {
    throw new Error('Vật phẩm không tồn tại.')
  }

  // Kiểm tra loại trang bị
  let equipSlot: 'weapon' | 'armor' | 'accessory' | null = null
  if (itemData.type === 'weapon' || itemData.type === 'spirit_weapon') {
    equipSlot = 'weapon'
  } else if (itemData.type === 'armor') {
    equipSlot = 'armor'
  } else if (itemData.type === 'accessory') {
    equipSlot = 'accessory'
  } else {
    throw new Error('Vật phẩm này không thể trang bị.')
  }

  // Kiểm tra yêu cầu (level, race nếu có)
  if (itemData.requirements) {
    if (itemData.requirements.level && character.level < itemData.requirements.level) {
      throw new Error(`Yêu cầu Level ${itemData.requirements.level} để trang bị vật phẩm này.`)
    }
    if (itemData.requirements.race && character.race !== itemData.requirements.race) {
      throw new Error(`Chỉ chủng tộc ${itemData.requirements.race} mới có thể trang bị vật phẩm này.`)
    }
  }

  const logs: LogPayload[] = []

  // Nếu đã có trang bị ở slot này, tháo ra trước
  const currentEquippedId = character.equipment[equipSlot]
  if (currentEquippedId) {
    const currentItem = items[currentEquippedId as ItemId]
    // Thêm lại vào túi đồ
    const existingInInventory = character.inventory.find(item => item.itemId === currentEquippedId)
    if (existingInInventory) {
      existingInInventory.quantity += 1
    } else {
      character.inventory.push({ itemId: currentEquippedId, quantity: 1 })
    }
    logs.push({ message: `Đã tháo ${currentItem?.name || currentEquippedId} ra khỏi ${equipSlot}.`, type: 'info' })
  }

  // Trang bị vật phẩm mới
  character.equipment[equipSlot] = itemId
  
  // Giảm số lượng trong túi đồ (vì đã trang bị)
  inventoryItem.quantity -= 1
  if (inventoryItem.quantity === 0) {
    character.inventory = character.inventory.filter(item => item.itemId !== itemId)
  }

  character.markModified('equipment')
  character.markModified('inventory')

  logs.push({ message: `Đã trang bị ${itemData.name}.`, type: 'success' })

  // Cập nhật stats từ trang bị (sẽ được xử lý trong stat calculation)
  return {
    log: logs,
    updates: {
      character: {
        equipment: character.equipment,
        inventory: character.inventory
      }
    }
  }
}
