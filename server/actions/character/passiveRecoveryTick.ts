import type { ActionHandler } from '../types'

export const passiveRecoveryTick: ActionHandler = async ({ character }) => {
  const now = Date.now()
  let hasExpiredEffects = false

  // 1. Xóa các hiệu ứng hết hạn
  character.effects = character.effects.filter((effect) => {
    if (!effect.expiresAt) {
      hasExpiredEffects = true
      return false
    }
    if (effect.expiresAt && effect.expiresAt.getTime() <= now) {
      hasExpiredEffects = true
      return false // Xóa hiệu ứng
    }
    return true // Giữ lại hiệu ứng
  })

  // 2. Kiểm tra có đang bị ngăn chặn hồi phục không
  const canRegen = !character.effects.some(e => e.hpRegenModifier === -1)
  if (!canRegen || character.hp >= character.hpMax || character.inCombat) {
    // Nếu có hiệu ứng hết hạn bị xóa, vẫn trả về update
    if (hasExpiredEffects) {
      return { log: [], updates: { character: { effects: character.effects } } }
    }
    return { log: [], updates: {} } // Không có gì để hồi phục hoặc bị chặn
  }

  // 3. Tính toán lượng HP hồi phục
  const baseRegenPercent = 0.01 // 1% HP max mỗi 10 giây (giả sử tick là 10s)
  const currentRealm = CultivationManager.getRealm(character.cultivation.stageId as any)
  const realmMultiplier = 1 + (currentRealm?.level || 1) * 0.1 // Cảnh giới cao hồi nhanh hơn

  const zone = ZoneManager.getZone(character.currentZoneId as any)
  const zoneMultiplier = (zone?.allowCultivation ? 1.2 : 1.0) // Khu an toàn hồi nhanh hơn

  const mindMultiplier = character.cultivation.stateOfMind // Tâm cảnh tốt hồi nhanh hơn

  // Tính tổng buff/debuff hồi phục
  let effectMultiplier = 1.0
  character.effects.forEach((e) => {
    if (e.hpRegenModifier > 0) {
      effectMultiplier += e.hpRegenModifier
    } else if (e.hpRegenModifier < 0 && e.hpRegenModifier !== -1) { // Bỏ qua -1 (ngăn chặn hoàn toàn)
      effectMultiplier *= (1 + e.hpRegenModifier) // Ví dụ: -0.2 -> multiplier * 0.8
    }
  })

  const hpToRegen = Math.floor(
    character.hpMax * baseRegenPercent * realmMultiplier * zoneMultiplier * mindMultiplier * effectMultiplier
  )

  if (hpToRegen > 0) {
    character.hp = Math.min(character.hpMax, character.hp + hpToRegen)
  }

  // Luôn trả về updates nếu có hiệu ứng hết hạn hoặc HP thay đổi
  if (hasExpiredEffects || hpToRegen > 0) {
    return {
      log: [], // Log hồi phục có thể không cần thiết, trừ khi lượng hồi lớn
      updates: {
        character: {
          hp: character.hp,
          effects: character.effects
        }
      }
    }
  }

  return { log: [], updates: {} }
}
