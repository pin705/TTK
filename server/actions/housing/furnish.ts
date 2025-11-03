// Place Furniture in House (Feature 8)
import type { ActionHandler } from '../types'
import { removeItemFromInventory } from '~/server/utils/inventoryManager'

export const furnish: ActionHandler = async (character, payload, log) => {
  const { furnitureId, room } = payload as { furnitureId: string; room: string }

  // Check if housing exists
  if (!character.housing || character.housing.level === 0) {
    log('SYSTEM', 'Bạn chưa có nhà.')
    return { success: false }
  }

  // Check if room exists
  if (!character.housing.rooms.includes(room)) {
    log('SYSTEM', 'Phòng này không tồn tại trong nhà bạn.')
    return { success: false }
  }

  // Check if has furniture item
  if (!removeItemFromInventory(character, furnitureId, 1)) {
    log('SYSTEM', 'Bạn không có đồ nội thất này.')
    return { success: false }
  }

  // Add furniture to house
  character.housing.furniture = character.housing.furniture || []
  character.housing.furniture.push({
    furnitureId,
    room,
    placedAt: new Date()
  })

  await character.save()

  log('HOUSING', `Đã đặt [${furnitureId}] vào ${room}.`)
  log('SYSTEM', 'Nội thất có thể mang lại buff khi nghỉ ngơi tại nhà.')

  return { success: true }
}
