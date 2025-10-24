import type { ActionHandler } from '../types'

export const meditate: ActionHandler = async ({ character }) => {
  const zone = ZoneManager.getZone(character.currentZoneId as any)
  if (!zone || !zone.allowCultivation) {
    throw new Error('Chỉ có thể đả tọa ở nơi linh khí ổn định.')
  }
  if (character.inCombat) {
    throw new Error('Không thể đả tọa khi đang chiến đấu.')
  }
  if (character.effects.some(e => e.effectId === 'heavy_wound')) {
    throw new Error('Đang trong trạng thái Trọng Thương, không thể tập trung đả tọa.')
  }
  // ✨ TỰ ĐỘNG DỪNG KHI ĐẦY HP/ENERGY ✨
  if (character.hp >= character.hpMax && character.energy >= character.energyMax) {
    return {
      log: [{ message: 'Sinh lực và Năng lượng đã đầy, không cần đả tọa.', type: 'info' }],
      updates: {}
    }
  }

  // Tính toán lượng hồi phục
  const hpRegenAmount = Math.floor(character.hpMax * 0.15) // Hồi 15% HP
  const energyRegenAmount = Math.floor(character.energyMax * 0.20) // Hồi 20% Energy

  const oldHp = character.hp
  const oldEnergy = character.energy

  character.hp = Math.min(character.hpMax, character.hp + hpRegenAmount)
  character.energy = Math.min(character.energyMax, character.energy + energyRegenAmount)

  const hpGained = character.hp - oldHp
  const energyGained = character.energy - oldEnergy

  return {
    log: [{ message: `Bạn tiến vào trạng thái đả tọa, hồi phục ${hpGained} HP và ${energyGained} Năng Lượng.`, type: 'success' }],
    updates: {
      character: {
        hp: character.hp,
        energy: character.energy
      }
    }
  }
}
