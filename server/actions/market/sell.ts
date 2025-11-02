import type { ActionHandler } from '../types'

export const sell: ActionHandler = async ({ character, payload }) => {
  const { itemId, quantity, pricePerUnit } = payload as { 
    itemId: string
    quantity: number
    pricePerUnit: number
  }
  
  if (!itemId || quantity < 1 || pricePerUnit < 1) {
    throw new Error('Thông tin không hợp lệ')
  }
  
  // Check if character has the item
  const inventoryItem = character.inventory.find(i => i.itemId === itemId)
  if (!inventoryItem || inventoryItem.quantity < quantity) {
    throw new Error('Không đủ vật phẩm để bán')
  }
  
  // Remove items from inventory
  inventoryItem.quantity -= quantity
  if (inventoryItem.quantity === 0) {
    character.inventory = character.inventory.filter(i => i.itemId !== itemId)
  }
  
  // Create market listing
  const listing = await MarketListing.create({
    sellerId: character._id,
    itemId,
    quantity,
    pricePerUnit,
    currency: 'energyCrystals',
    status: 'active'
  })
  
  return {
    log: [
      { type: 'market', message: `[CHỢ]: Đã đăng bán ${quantity}x [${itemId}] với giá ${pricePerUnit} Tinh Thể/cái.` },
      { type: 'market', message: `[CHỢ]: Mã tin rao: #${listing._id.toString().slice(-6)}` }
    ],
    updates: {
      inventory: character.inventory
    }
  }
}
