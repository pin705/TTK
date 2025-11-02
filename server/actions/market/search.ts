import type { ActionHandler } from '../types'

export const search: ActionHandler = async ({ character, payload }) => {
  const { itemId } = payload as { itemId: string }
  
  if (!itemId) {
    throw new Error('Cần chỉ định vật phẩm cần tìm')
  }
  
  // Find active listings for this item
  const listings = await MarketListing.find({
    itemId,
    status: 'active'
  }).limit(10).sort({ pricePerUnit: 1 })
  
  if (listings.length === 0) {
    return {
      log: [
        { type: 'market', message: `[CHỢ]: Không tìm thấy tin rao nào cho [${itemId}].` }
      ],
      updates: {}
    }
  }
  
  const logMessages = [
    { type: 'market', message: `[CHỢ]: Tìm thấy ${listings.length} tin rao:` }
  ]
  
  for (let i = 0; i < listings.length; i++) {
    const listing = listings[i]
    const seller = await Character.findById(listing.sellerId)
    const listingId = listing._id.toString().slice(-6)
    logMessages.push({
      type: 'market',
      message: `${i + 1}. [${seller?.name || 'Unknown'}] - Giá: ${listing.pricePerUnit} Tinh Thể - SL: ${listing.quantity} (ID: #${listingId})`
    })
  }
  
  return {
    log: logMessages,
    updates: {},
    listings // Return listings for client use
  }
}
