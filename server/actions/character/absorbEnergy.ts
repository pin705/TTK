import type { ActionContext } from '../types'
import { evolutionRanks } from '~~/shared/config/cultivation'

/**
 * Absorb Energy Crystals to gain geneEnergy for evolution progression
 */
export async function absorbEnergy({ character, payload }: ActionContext) {
  const amount = (payload as any)?.amount as number || 1

  // Initialize evolution if not exists
  if (!character.evolution) {
    character.evolution = {
      geneEnergy: 0,
      rank: 'apprentice_1',
      rankLevel: 1,
      modules: {
        cultivation: null,
        combat: null,
        survival: null
      },
      geneIntegrity: 100
    }
  }

  if (!character.resources) {
    character.resources = { energyCrystals: 0 }
  }

  // Check if player has enough energy crystals
  if (character.resources.energyCrystals < amount) {
    return {
      log: { message: `Không đủ Tinh Thể Năng Lượng. Bạn có ${character.resources.energyCrystals}, cần ${amount}.`, type: 'error' }
    }
  }

  // Calculate absorption rate based on cultivation module
  let absorptionRate = 1.0
  if (character.evolution.modules?.cultivation) {
    // TODO: Get module stats from items config
    // For now, assume basic = 1.2x, advanced = 1.5x
    absorptionRate = 1.2
  }

  const geneEnergyGained = Math.floor(amount * 10 * absorptionRate)
  
  // Deduct energy crystals
  character.resources.energyCrystals -= amount
  
  // Add gene energy
  character.evolution.geneEnergy += geneEnergyGained

  // Check for automatic rank up
  const currentRankId = character.evolution.rank as keyof typeof evolutionRanks
  const currentRank = evolutionRanks[currentRankId]
  
  let rankUpMessage = ''
  if (character.evolution.geneEnergy >= currentRank.geneEnergyRequired) {
    // Auto rank up if no breakthrough required
    if (!currentRank.breakthrough) {
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
          character.hp = character.hpMax // Full heal on rank up
        }
        
        rankUpMessage = ` 🎉 Bạn đã đạt đến ${evolutionRanks[nextRankId as keyof typeof evolutionRanks].name}!`
      }
    } else {
      rankUpMessage = ` ⚠️ Bạn đã đạt đủ năng lượng để đột phá. Hãy sử dụng ${currentRank.breakthrough.requiresItem} và thực hiện đột phá!`
    }
  }

  await character.save()

  return {
    log: { 
      message: `Bạn đã hấp thụ ${amount} Tinh Thể Năng Lượng, nhận được ${geneEnergyGained} Năng Lượng Gien.${rankUpMessage}`, 
      type: 'success' 
    },
    updates: { character }
  }
}

function getNextRank(currentRank: string): string | null {
  const ranks = Object.keys(evolutionRanks)
  const currentIndex = ranks.indexOf(currentRank)
  return currentIndex < ranks.length - 1 ? ranks[currentIndex + 1] : null
}
