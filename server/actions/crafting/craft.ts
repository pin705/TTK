import type { ActionHandler } from '../types'
import { items } from '../../../shared/config/items'

export const craft: ActionHandler = async ({ character, payload }) => {
  const { blueprintId } = payload as { blueprintId: string }
  
  if (!blueprintId) {
    throw new Error('Cần chỉ định công thức')
  }
  
  // Check if character knows this blueprint
  if (!character.knownBlueprints || !character.knownBlueprints.includes(blueprintId)) {
    throw new Error('Bạn chưa học công thức này')
  }
  
  // Get blueprint data
  const blueprint = items[blueprintId as keyof typeof items]
  if (!blueprint || blueprint.type !== 'blueprint') {
    throw new Error('Công thức không hợp lệ')
  }
  
  const recipe = (blueprint as any).recipe
  if (!recipe) {
    throw new Error('Công thức không có recipe')
  }
  
  // Check if character has all required materials
  for (const req of recipe.required) {
    const inventoryItem = character.inventory.find(i => i.itemId === req.itemId)
    if (!inventoryItem || inventoryItem.quantity < req.qty) {
      throw new Error(`Thiếu nguyên liệu: ${req.itemId} (cần ${req.qty})`)
    }
  }
  
  // Consume materials
  for (const req of recipe.required) {
    const inventoryItem = character.inventory.find(i => i.itemId === req.itemId)
    if (!inventoryItem) {
      throw new Error(`Lỗi hệ thống: không tìm thấy vật phẩm ${req.itemId}`)
    }
    inventoryItem.quantity -= req.qty
    if (inventoryItem.quantity === 0) {
      character.inventory = character.inventory.filter(i => i.itemId !== req.itemId)
    }
  }
  
  // Add result item
  const existingItem = character.inventory.find(i => i.itemId === recipe.result.itemId)
  if (existingItem) {
    existingItem.quantity += recipe.result.qty
  } else {
    character.inventory.push({ 
      itemId: recipe.result.itemId, 
      quantity: recipe.result.qty 
    })
  }
  
  return {
    log: [
      { type: 'system', message: `[CHẾ TẠO]: Bắt đầu chế tạo...` },
      { type: 'system', message: `[CHẾ TẠO]: Thành công! Nhận được ${recipe.result.qty}x [${recipe.result.itemId}]` }
    ],
    updates: {
      inventory: character.inventory
    }
  }
}
