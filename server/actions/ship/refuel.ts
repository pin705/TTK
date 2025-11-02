import type { ActionHandler } from '../types'

export const refuel: ActionHandler = async ({ character, payload }) => {
  if (!character.currentShipId) {
    throw new Error('Bạn không có phi thuyền')
  }
  
  const ship = await Ship.findById(character.currentShipId)
  if (!ship) {
    throw new Error('Phi thuyền không tồn tại')
  }
  
  // Check if has fuel cells
  const fuelCell = character.inventory.find(i => i.itemId === 'fuel_cell')
  if (!fuelCell || fuelCell.quantity < 1) {
    throw new Error('Cần có [Tế Bào Năng Lượng] để nạp nhiên liệu')
  }
  
  // Use fuel cell
  fuelCell.quantity -= 1
  if (fuelCell.quantity === 0) {
    character.inventory = character.inventory.filter(i => i.itemId !== 'fuel_cell')
  }
  
  // Restore 50 fuel
  ship.stats.fuel = Math.min(ship.stats.fuelMax, ship.stats.fuel + 50)
  await ship.save()
  
  return {
    log: [
      { type: 'system', message: `[PHI THUYỀN]: Đã nạp nhiên liệu!` },
      { type: 'system', message: `[PHI THUYỀN]: Nhiên liệu hiện tại: ${ship.stats.fuel}/${ship.stats.fuelMax}` }
    ],
    updates: {
      inventory: character.inventory
    }
  }
}
