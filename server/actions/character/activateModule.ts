import type { ActionHandler } from '../types'
import { items } from '../../../shared/config/items'
import { gameSettings } from '../../../shared/config/gameSettings'

export const activateModule: ActionHandler = async ({ character, payload }) => {
  const { slot } = payload as { slot: 'moduleSlot1' | 'moduleSlot2' | 'moduleSlot3' }
  
  if (!slot) {
    throw new Error('Cần chỉ định slot module')
  }
  
  const moduleId = character.equipment[slot]
  if (!moduleId) {
    throw new Error('Slot này không có module')
  }
  
  const module = items[moduleId as keyof typeof items]
  if (!module || module.type !== 'module_active') {
    throw new Error('Module này không thể kích hoạt')
  }
  
  const stats = (module as any).stats
  const energyCost = stats?.energyCost || gameSettings.module.energyShieldCost
  
  if (character.energy < energyCost) {
    throw new Error(`Không đủ năng lượng (cần ${energyCost})`)
  }
  
  character.energy -= energyCost
  
  // Apply module effect
  if (stats?.shieldPower) {
    // Add temporary shield effect
    if (!character.effects) character.effects = []
    character.effects.push({
      effectId: 'energy_shield',
      name: 'Lá Chắn Năng Lượng',
      power: stats.shieldPower || gameSettings.module.energyShieldPower,
      durationTurns: 3,
      expiresAt: new Date(Date.now() + 60000) // 1 minute
    })
    
    return {
      log: [
        { type: 'system', message: `[HỆ THỐNG]: Đã dùng ${energyCost} Năng Lượng.` },
        { type: 'system', message: `[HỆ THỐNG]: Bạn nhận được [Lá Chắn] (${stats.shieldPower} HP).` }
      ],
      updates: {
        energy: character.energy,
        effects: character.effects
      }
    }
  }
  
  return {
    log: [
      { type: 'system', message: `[HỆ THỐNG]: Kích hoạt module [${module.name}]!` }
    ],
    updates: {
      energy: character.energy
    }
  }
}
