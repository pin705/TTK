import type { ActionHandler } from '../types'
import { items } from '../../../shared/config/items'
import { gameSettings } from '../../../shared/config/gameSettings'

export const research: ActionHandler = async ({ character, payload }) => {
  // Check if character has ruin fragments
  const ruinFragment = character.inventory.find(i => i.itemId === 'ruin_fragment')
  if (!ruinFragment || ruinFragment.quantity < 1) {
    throw new Error('Cần có [Mảnh Tàn Tích] để nghiên cứu')
  }
  
  // Get all blueprint items
  const blueprints = Object.keys(items).filter(itemId => {
    const item = items[itemId as keyof typeof items]
    return item.type === 'blueprint'
  })
  
  // Get unknown blueprints
  const unknownBlueprints = blueprints.filter(bp => {
    return !character.knownBlueprints || !character.knownBlueprints.includes(bp)
  })
  
  if (unknownBlueprints.length === 0) {
    return {
      log: [
        { type: 'system', message: `[NGHIÊN CỨU]: Bạn đã học tất cả công thức!` }
      ],
      updates: {}
    }
  }
  
  // Random success
  const success = Math.random() < gameSettings.crafting.researchSuccessRate
  
  // Consume ruin fragment
  ruinFragment.quantity -= 1
  if (ruinFragment.quantity === 0) {
    character.inventory = character.inventory.filter(i => i.itemId !== 'ruin_fragment')
  }
  
  if (success) {
    // Learn random unknown blueprint
    const learnedBlueprint = unknownBlueprints[Math.floor(Math.random() * unknownBlueprints.length)]
    if (!character.knownBlueprints) {
      character.knownBlueprints = []
    }
    character.knownBlueprints.push(learnedBlueprint)
    
    const blueprintItem = learnedBlueprint ? items[learnedBlueprint as keyof typeof items] : null
    
    return {
      log: [
        { type: 'system', message: `[NGHIÊN CỨU]: Nghiên cứu thành công!` },
        { type: 'system', message: `[NGHIÊN CỨU]: Đã học công thức: [${blueprintItem?.name || 'Unknown'}]` }
      ],
      updates: {
        inventory: character.inventory,
        knownBlueprints: character.knownBlueprints
      }
    }
  } else {
    return {
      log: [
        { type: 'system', message: `[NGHIÊN CỨU]: Nghiên cứu thất bại!` },
        { type: 'system', message: `[NGHIÊN CỨU]: Mảnh tàn tích bị hủy hoại.` }
      ],
      updates: {
        inventory: character.inventory
      }
    }
  }
}
