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

  // Tính toán lượng hồi phục lớn hơn nhiều so với passive
  const hpRegenAmount = Math.floor(character.hpMax * 0.15) // Hồi 15% HP
  const energyRegenAmount = Math.floor(character.energyMax * 0.20) // Hồi 20% Energy

  character.hp = Math.min(character.hpMax, character.hp + hpRegenAmount)
  character.energy = Math.min(character.energyMax, character.energy + energyRegenAmount)

  return {
    log: [{ message: `Bạn tiến vào trạng thái đả tọa, hấp thụ linh khí, hồi phục ${hpRegenAmount} HP và ${energyRegenAmount} Năng Lượng.`, type: 'success' }],
    updates: {
      character: {
        hp: character.hp,
        energy: character.energy
      }
    }
  }
}
