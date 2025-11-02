import type { ActionHandler } from '../types'
import { Ship } from '../../models/ship.model'

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
  const fuelCosts: Record<string, number> = {
    Moon: 20,
    Mars: 50,
    AsteroidBelt: 40,
    Earth: 30
  }
  
  const fuelCost = fuelCosts[target] || 30
  
  if (ship.stats.fuel < fuelCost) {
    throw new Error(`Không đủ nhiên liệu (cần ${fuelCost}, có ${ship.stats.fuel})`)
  }
  
  // Random events (20% chance)
  const randomEvent = Math.random()
  const logs: any[] = [
    { type: 'system', message: `[DU HÀNH]: Khởi hành đến ${target}...` }
  ]
  
  ship.stats.fuel -= fuelCost
  
  if (randomEvent < 0.1) {
    // Energy storm
    const fuelLoss = Math.floor(ship.stats.fuel * 0.3)
    ship.stats.fuel = Math.max(0, ship.stats.fuel - fuelLoss)
    logs.push({ type: 'event', message: `[SỰ KIỆN]: Gặp Bão Năng Lượng! Mất ${fuelLoss} nhiên liệu.` })
  } else if (randomEvent < 0.2) {
    // Space pirates
    const hpLoss = Math.floor(ship.stats.hpMax * 0.2)
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
