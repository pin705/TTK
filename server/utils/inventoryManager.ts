import type { Document } from 'mongoose'
import type { ICharacter } from '~~/server/models/character.model'

export function addItemToInventory(character: Document & ICharacter, itemId: string, quantity: number) {
  const existingItem = character.inventory.find(item => item.itemId === itemId)

  if (existingItem) {
    existingItem.quantity += quantity
  }
  else {
    character.inventory.push({ itemId, quantity })
  }
  // Đánh dấu mảng đã bị thay đổi để Mongoose lưu lại
  character.markModified('inventory')
}
