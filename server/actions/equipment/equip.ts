import type { ActionContext } from '../types'
import { items } from '~~/shared/config'
import { recalculateStats } from '~~/server/utils/levelManager'

interface EquipPayload {
  itemId: string
}

export async function equipItem(context: ActionContext, payload: EquipPayload) {
  const { character } = context
  const { itemId } = payload

  // Find item in inventory
  const itemSlot = character.inventory.find(slot => slot.itemId === itemId)
  if (!itemSlot || itemSlot.quantity < 1) {
    throw new Error('Bạn không có vật phẩm này trong túi đồ.')
  }

  const itemConfig = items[itemId as keyof typeof items]
  if (!itemConfig) {
    throw new Error('Vật phẩm không hợp lệ.')
  }

  // Determine equipment slot
  let equipmentSlot: keyof typeof character.equipment | null = null
  
  if (itemConfig.type === 'weapon' || itemConfig.type === 'spirit_weapon') {
    equipmentSlot = 'weapon'
  } else if (itemConfig.type === 'armor') {
    equipmentSlot = 'armor'
  } else if (itemConfig.type === 'accessory') {
    equipmentSlot = 'accessory'
  } else if (itemConfig.type === 'module_cultivation') {
    equipmentSlot = 'moduleSlot1'
  } else if (itemConfig.type === 'module_combat') {
    equipmentSlot = 'moduleSlot2'
  } else if (itemConfig.type === 'module_survival') {
    equipmentSlot = 'moduleSlot3'
  } else {
    throw new Error('Vật phẩm này không thể trang bị.')
  }

  // Check level requirement
  if (itemConfig.requirements?.level && character.level < itemConfig.requirements.level) {
    throw new Error(`Cần level ${itemConfig.requirements.level} để trang bị.`)
  }

  // Check race requirement
  if (itemConfig.requirements?.race && character.race !== itemConfig.requirements.race) {
    throw new Error(`Chỉ chủng tộc ${itemConfig.requirements.race} mới có thể trang bị.`)
  }

  // Unequip current item in that slot
  const currentItemId = character.equipment[equipmentSlot]
  if (currentItemId) {
    // Return old item to inventory
    const existingSlot = character.inventory.find(slot => slot.itemId === currentItemId)
    if (existingSlot) {
      existingSlot.quantity += 1
    } else {
      character.inventory.push({ itemId: currentItemId, quantity: 1 })
    }
  }

  // Equip new item
  character.equipment[equipmentSlot] = itemId

  // Remove from inventory
  itemSlot.quantity -= 1
  if (itemSlot.quantity <= 0) {
    character.inventory = character.inventory.filter(slot => slot.itemId !== itemId)
  }

  // Recalculate stats with new equipment
  recalculateStats(character)

  character.markModified('equipment')
  character.markModified('inventory')

  return {
    log: [
      { message: `[TRANG BỊ]: Đã trang bị ${itemConfig.name}.`, type: 'success' }
    ],
    updates: { character: character.toObject() }
  }
}
