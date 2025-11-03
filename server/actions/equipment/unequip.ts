import type { ActionContext } from '../types'
import { items } from '~~/shared/config'
import { recalculateStats } from '~~/server/utils/levelManager'

interface UnequipPayload {
  slot: 'weapon' | 'armor' | 'accessory' | 'moduleSlot1' | 'moduleSlot2' | 'moduleSlot3'
}

export async function unequipItem(context: ActionContext, payload: UnequipPayload) {
  const { character } = context
  const { slot } = payload

  const itemId = character.equipment[slot]
  if (!itemId) {
    throw new Error('Không có trang bị trong vị trí này.')
  }

  const itemConfig = items[itemId as keyof typeof items]
  if (!itemConfig) {
    throw new Error('Trang bị không hợp lệ.')
  }

  // Remove equipment
  character.equipment[slot] = null

  // Return to inventory
  const existingSlot = character.inventory.find(s => s.itemId === itemId)
  if (existingSlot) {
    existingSlot.quantity += 1
  } else {
    character.inventory.push({ itemId, quantity: 1 })
  }

  // Recalculate stats
  recalculateStats(character)

  character.markModified('equipment')
  character.markModified('inventory')

  return {
    log: [
      { message: `[TRANG BỊ]: Đã gỡ ${itemConfig.name}.`, type: 'info' }
    ],
    updates: { character: character.toObject() }
  }
}
