import type { ActionHandler } from '../types'

export const buy: ActionHandler = async ({ character, payload }) => {
  const { listingId } = payload as { listingId: string }
  
  if (!listingId) {
    throw new Error('Cần chỉ định mã tin rao')
  }
  
  const listing = await MarketListing.findById(listingId)
  if (!listing || listing.status !== 'active') {
    throw new Error('Tin rao không tồn tại hoặc đã bán')
  }
  
  const totalCost = listing.pricePerUnit * listing.quantity
  const tax = Math.ceil(totalCost * 0.05) // 5% tax
  const totalWithTax = totalCost + tax
  
  // Check if buyer has enough currency
  if (!character.resources?.energyCrystals || character.resources.energyCrystals < totalWithTax) {
    throw new Error(`Không đủ Tinh Thể Năng Lượng (cần ${totalWithTax}, có ${character.resources?.energyCrystals || 0})`)
  }
  
  // Get seller
  const seller = await Character.findById(listing.sellerId)
  if (!seller) {
    throw new Error('Người bán không tồn tại')
  }
  
  // Transfer currency
  character.resources.energyCrystals -= totalWithTax
  if (!seller.resources) seller.resources = { energyCrystals: 0 }
  seller.resources.energyCrystals = (seller.resources.energyCrystals || 0) + totalCost
  await seller.save()
  
  // Add item to buyer's inventory
  const existingItem = character.inventory.find(i => i.itemId === listing.itemId)
  if (existingItem) {
    existingItem.quantity += listing.quantity
  } else {
    character.inventory.push({ itemId: listing.itemId, quantity: listing.quantity })
  }
  
  // Mark listing as sold
  listing.status = 'sold'
  await listing.save()
  
  return {
    log: [
      { type: 'market', message: `[CHỢ]: Đã mua ${listing.quantity}x [${listing.itemId}] với giá ${totalCost} Tinh Thể.` },
      { type: 'system', message: `[HỆ THỐNG]: Thuế giao dịch: ${tax} Tinh Thể.` }
    ],
    updates: {
      'resources.energyCrystals': character.resources.energyCrystals,
      inventory: character.inventory
    }
  }
}
