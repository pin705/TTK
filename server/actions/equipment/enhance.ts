// Equipment Enhancement System
import type { ActionContext } from '../types'
import { items } from '~/shared/config/items'

interface EnhancePayload {
  itemId: string // Item in inventory to enhance
}

export async function enhanceEquipment(context: ActionContext, payload: EnhancePayload) {
  const { character } = context
  const logs: string[] = []

  // Find the item in inventory
  const itemSlot = character.inventory.find(slot => slot.itemId === payload.itemId)
  if (!itemSlot || itemSlot.quantity < 1) {
    logs.push('[ERROR]: Không tìm thấy trang bị trong túi đồ.')
    return
  }

  const itemConfig = items[payload.itemId as keyof typeof items]
  if (!itemConfig) {
    logs.push('[ERROR]: Trang bị không hợp lệ.')
    return
  }

  // Check if item is equipment
  if (!['weapon', 'armor', 'accessory'].includes(itemConfig.type)) {
    logs.push('[ERROR]: Chỉ có thể nâng cấp vũ khí, giáp hoặc phụ kiện.')
    return
  }

  // Determine enhancement stone needed based on rarity
  let requiredStone: string
  let successRate: number
  let stoneCost: number

  switch (itemConfig.rarity) {
    case 'common':
      requiredStone = 'enhancement_stone_basic'
      successRate = 0.95
      stoneCost = 1
      break
    case 'uncommon':
      requiredStone = 'enhancement_stone_basic'
      successRate = 0.85
      stoneCost = 2
      break
    case 'rare':
      requiredStone = 'enhancement_stone_advanced'
      successRate = 0.75
      stoneCost = 1
      break
    case 'epic':
      requiredStone = 'enhancement_stone_elite'
      successRate = 0.60
      stoneCost = 1
      break
    case 'legendary':
      requiredStone = 'enhancement_stone_legendary'
      successRate = 0.40
      stoneCost = 1
      break
    default:
      requiredStone = 'enhancement_stone_basic'
      successRate = 0.90
      stoneCost = 1
  }

  // Check if player has enhancement stone
  const stoneSlot = character.inventory.find(slot => slot.itemId === requiredStone)
  if (!stoneSlot || stoneSlot.quantity < stoneCost) {
    logs.push(`[ERROR]: Cần ${stoneCost}x ${items[requiredStone as keyof typeof items]?.name} để nâng cấp.`)
    return
  }

  // Consume enhancement stone
  stoneSlot.quantity -= stoneCost
  if (stoneSlot.quantity <= 0) {
    character.inventory = character.inventory.filter(slot => slot.itemId !== requiredStone)
  }

  // Check success
  const roll = Math.random()
  if (roll <= successRate) {
    // Success - create enhanced version
    logs.push(`[ENHANCEMENT]: Nâng cấp thành công!`)
    logs.push(`[ENHANCEMENT]: ${itemConfig.name} đã được cường hóa!`)
    
    // For simplicity, we'll add a +1 suffix and increase stats
    // In a real system, you'd track enhancement level separately
    const enhancedItemId = `${payload.itemId}_enhanced`
    
    // Remove original item
    itemSlot.quantity -= 1
    if (itemSlot.quantity <= 0) {
      character.inventory = character.inventory.filter(slot => slot.itemId !== payload.itemId)
    }

    // Add enhanced item (note: this is simplified, you'd need to create enhanced item configs)
    const existingEnhanced = character.inventory.find(slot => slot.itemId === enhancedItemId)
    if (existingEnhanced) {
      existingEnhanced.quantity += 1
    } else {
      character.inventory.push({ itemId: enhancedItemId, quantity: 1 })
    }

    logs.push(`[SYSTEM]: Nhận được ${itemConfig.name} +1`)
  } else {
    // Failure
    logs.push(`[ENHANCEMENT]: Nâng cấp thất bại!`)
    logs.push(`[SYSTEM]: ${itemConfig.name} đã bị phá hủy.`)
    
    // Remove the item
    itemSlot.quantity -= 1
    if (itemSlot.quantity <= 0) {
      character.inventory = character.inventory.filter(slot => slot.itemId !== payload.itemId)
    }
  }

  logs.push(`[INFO]: Tỷ lệ thành công: ${(successRate * 100).toFixed(0)}%`)
  
  return { logs }
}
