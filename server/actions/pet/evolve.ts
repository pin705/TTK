// Pet Evolution System (Feature 7)
import type { ActionHandler } from '../types'
import { Pet } from '~/server/models/pet.model'
import { gameSettings } from '~/shared/config/gameSettings'
import { removeItemFromInventory } from '~/server/utils/inventoryManager'

export const evolve: ActionHandler = async (character, payload, log) => {
  const { petId, evolutionTier } = payload as { petId: string; evolutionTier: number }

  // Get pet
  const pet = await Pet.findById(petId)
  if (!pet) {
    log('SYSTEM', 'Không tìm thấy pet.')
    return { success: false }
  }

  // Check ownership
  if (pet.owner.toString() !== character._id.toString()) {
    log('SYSTEM', 'Bạn không sở hữu pet này.')
    return { success: false }
  }

  // Check if already at max evolution
  if (pet.evolutionTier && pet.evolutionTier >= 3) {
    log('SYSTEM', 'Pet đã đạt tiến hóa tối đa.')
    return { success: false }
  }

  // Determine required evolution stone
  let requiredStone: string
  if (evolutionTier === 1) {
    requiredStone = 'evolution_stone_basic'
  } else if (evolutionTier === 2) {
    requiredStone = 'evolution_stone_advanced'
  } else if (evolutionTier === 3) {
    requiredStone = 'evolution_stone_elite'
  } else {
    log('SYSTEM', 'Cấp độ tiến hóa không hợp lệ.')
    return { success: false }
  }

  // Check for evolution stone
  if (!removeItemFromInventory(character, requiredStone, 1)) {
    log('SYSTEM', `Cần ${requiredStone} để tiến hóa.`)
    return { success: false }
  }

  // Evolution success check
  const success = Math.random() < gameSettings.pet.evolutionSuccessRate

  if (!success) {
    log('PET', 'Tiến hóa thất bại!')
    log('SYSTEM', 'Đá tiến hóa đã bị tiêu hao.')
    return { success: false }
  }

  // Apply evolution
  const oldTier = pet.evolutionTier || 0
  pet.evolutionTier = evolutionTier

  // Boost stats based on evolution tier
  const statMultiplier = 1 + (evolutionTier * 0.3) // 30% per tier
  pet.stats.hp = Math.floor(pet.stats.hp * statMultiplier)
  pet.stats.attack = Math.floor(pet.stats.attack * statMultiplier)
  pet.stats.defense = Math.floor(pet.stats.defense * statMultiplier)
  pet.stats.speed = Math.floor(pet.stats.speed * statMultiplier)

  await pet.save()

  log('PET', `Tiến hóa thành công từ cấp ${oldTier} lên cấp ${evolutionTier}!`)
  log('PET', `[${pet.monsterId}] đã mạnh hơn rất nhiều!`)
  log('SYSTEM', `HP: ${pet.stats.hp}, ATK: ${pet.stats.attack}, DEF: ${pet.stats.defense}, SPD: ${pet.stats.speed}`)

  return { success: true }
}
