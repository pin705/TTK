import type { ActionContext } from '../types'
import { evolutionRanks } from '~~/shared/config/cultivation'
import { zones } from '~~/shared/config/zones'

/**
 * Attempt gene breakthrough to advance to the next major rank
 * Requires: Gene Evolution Solution item, safe zone, sufficient gene energy
 */
export async function geneBreakthrough({ character }: ActionContext) {
  // Initialize evolution if not exists
  if (!character.evolution) {
    return {
      log: { message: 'Hệ thống tiến hóa chưa được kích hoạt.', type: 'error' }
    }
  }

  const currentRankId = character.evolution.rank as keyof typeof evolutionRanks
  const currentRank = evolutionRanks[currentRankId]

  // Check if breakthrough is available for this rank
  if (!(currentRank as any).breakthrough) {
    return {
      log: { message: 'Cấp bậc hiện tại không cần đột phá. Hãy tiếp tục hấp thụ Tinh Thể Năng Lượng.', type: 'error' }
    }
  }

  // Check if in safe zone
  const currentZone = zones[character.currentZoneId as keyof typeof zones]
  if (!currentZone || currentZone.zoneType !== 'base') {
    return {
      log: { message: 'Đột phá Gien chỉ có thể thực hiện ở Căn Cứ (khu vực an toàn).', type: 'error' }
    }
  }

  // Check if player has enough gene energy
  if (character.evolution.geneEnergy < currentRank.geneEnergyRequired) {
    return {
      log: {
        message: `Chưa đủ Năng Lượng Gien để đột phá. Cần ${currentRank.geneEnergyRequired}, hiện có ${character.evolution.geneEnergy}.`,
        type: 'error'
      }
    }
  }

  // Check if player has required breakthrough item
  const requiredItem = (currentRank as any).breakthrough.requiresItem
  const hasItem = character.inventory.find(item => item.itemId === requiredItem && item.quantity > 0)

  if (!hasItem) {
    return {
      log: {
        message: `Cần vật phẩm: ${requiredItem} để thực hiện đột phá.`,
        type: 'error'
      }
    }
  }

  // Calculate success chance
  const baseChance = (currentRank as any).breakthrough.baseSuccessChance
  const geneIntegrityBonus = (character.evolution.geneIntegrity - 100) * 0.002 // +/-0.2% per point
  const successChance = Math.max(0.1, Math.min(1.0, baseChance + geneIntegrityBonus))

  // Attempt breakthrough
  const success = Math.random() < successChance

  // Consume the breakthrough item
  hasItem.quantity -= 1
  if (hasItem.quantity <= 0) {
    character.inventory = character.inventory.filter(item => item.itemId !== requiredItem || item.quantity > 0)
  }

  if (success) {
    // Success: Advance to next rank
    const nextRankId = getNextRank(currentRankId)
    if (nextRankId) {
      character.evolution.rank = nextRankId
      character.evolution.geneEnergy -= currentRank.geneEnergyRequired

      // Apply stat gains
      if (currentRank.statGains) {
        character.hpMax += currentRank.statGains.hpMax || 0
        character.energyMax += currentRank.statGains.energyMax || 0
        character.stats.attack += currentRank.statGains.attack || 0
        character.stats.defense += currentRank.statGains.defense || 0
        character.hp = character.hpMax // Full heal on breakthrough
        character.energy = character.energyMax // Full energy restore
      }

      await character.save()

      const nextRank = evolutionRanks[nextRankId as keyof typeof evolutionRanks]
      return {
        log: {
          message: `✨ Đột phá thành công! Bạn đã tiến hóa lên ${nextRank.name}!\n` +
                   `HP: ${character.hpMax}, Năng Lượng: ${character.energyMax}, Công Kích: ${character.stats.attack}, Phòng Thủ: ${character.stats.defense}`,
          type: 'success'
        },
        updates: { character }
      }
    }
  } else {
    // Failure: Apply penalty
    const penalty = (currentRank as any).breakthrough.failurePenalty
    if (penalty?.geneIntegrityLoss) {
      character.evolution.geneIntegrity = Math.max(0, character.evolution.geneIntegrity - penalty.geneIntegrityLoss)

      // Add temporary debuff if gene integrity is low
      if (character.evolution.geneIntegrity < 50) {
        character.effects.push({
          effectId: 'gene_damage',
          name: 'Tổn Thương Gien',
          durationTurns: 10,
          power: 0,
          preventsCombat: false,
          hpRegenModifier: -0.3,
          energyRegenModifier: -0.3,
          expiresAt: new Date(Date.now() + 3600000) // 1 hour
        })
      }
    }

    await character.save()

    return {
      log: {
        message: `❌ Đột phá thất bại! Toàn Vẹn Gien giảm ${penalty?.geneIntegrityLoss || 0} điểm (còn ${character.evolution.geneIntegrity}/100).\n` +
                 `Vật phẩm đã bị tiêu hao. Hãy nghỉ ngơi và thử lại sau.`,
        type: 'error'
      },
      updates: { character }
    }
  }

  return {
    log: { message: 'Đã xảy ra lỗi trong quá trình đột phá.', type: 'error' }
  }
}

function getNextRank(currentRank: string): string | null | undefined {
  const ranks = Object.keys(evolutionRanks)
  const currentIndex = ranks.indexOf(currentRank)
  return currentIndex < ranks.length - 1 ? ranks[currentIndex + 1] : null
}
