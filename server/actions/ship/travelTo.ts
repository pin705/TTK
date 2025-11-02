import type { ActionHandler } from '../types'
import { Ship } from '../../models/ship.model'
import { gameSettings } from '../../../shared/config/gameSettings'

export const travelTo: ActionHandler = async ({ character, payload }) => {
  const { target } = payload as { target: 'Moon' | 'Mars' | 'AsteroidBelt' | 'Earth' }
  
  if (!character.currentShipId) {
    throw new Error('Bạn cần có phi thuyền để du hành vũ trụ')
  }
  
  const ship = await Ship.findById(character.currentShipId)
  if (!ship) {
    throw new Error('Phi thuyền không tồn tại')
  }
  
  // Calculate fuel cost based on destination
  const fuelCost = gameSettings.ship.fuelCosts[target] || 30
  
  if (ship.stats.fuel < fuelCost) {
    throw new Error(`Không đủ nhiên liệu (cần ${fuelCost}, có ${ship.stats.fuel})`)
  }
  
  // Random events (20% chance)
  const randomEvent = Math.random()
  const logs: { type: string; message: string }[] = [
    { type: 'system', message: `[DU HÀNH]: Khởi hành đến ${target}...` }
  ]
  
  ship.stats.fuel -= fuelCost
  
  if (randomEvent < gameSettings.ship.energyStormChance) {
    // Energy storm
    const fuelLoss = Math.floor(ship.stats.fuel * gameSettings.ship.energyStormFuelLoss)
    ship.stats.fuel = Math.max(0, ship.stats.fuel - fuelLoss)
    logs.push({ type: 'event', message: `[SỰ KIỆN]: Gặp Bão Năng Lượng! Mất ${fuelLoss} nhiên liệu.` })
  } else if (randomEvent < gameSettings.ship.randomEventChance) {
    // Space pirates
    const hpLoss = Math.floor(ship.stats.hpMax * gameSettings.ship.pirateHpDamage)
    ship.stats.hp = Math.max(0, ship.stats.hp - hpLoss)
    logs.push({ type: 'event', message: `[SỰ KIỆN]: Gặp Cướp Bóc Vũ Trụ! Phi thuyền mất ${hpLoss} HP.` })
  }
  
  await ship.save()
  
  // Update character location
  const zoneMap: Record<string, string> = {
    Moon: 'moon_base',
    Mars: 'mars_mining',
    AsteroidBelt: 'asteroid_belt',
    Earth: 'earth_base'
  }
  
  character.currentZoneId = zoneMap[target] || 'earth_base'
  character.locationType = target === 'Earth' ? 'Planet' : 'Space'
  
  logs.push({ type: 'system', message: `[DU HÀNH]: Đã đến ${target}!` })
  
  return {
    log: logs,
    updates: {
      currentZoneId: character.currentZoneId,
      locationType: character.locationType
    }
  }
}
