// Pet Breeding System (Feature 7)
import type { ActionHandler } from '../types'
import { Pet } from '~/server/models/pet.model'
import { gameSettings } from '~/shared/config/gameSettings'
import { removeItemFromInventory } from '~/server/utils/inventoryManager'

export const breed: ActionHandler = async (character, payload, log) => {
  const { petId1, petId2 } = payload as { petId1: string; petId2: string }

  // Get both pets
  const pet1 = await Pet.findById(petId1)
  const pet2 = await Pet.findById(petId2)

  if (!pet1 || !pet2) {
    log('SYSTEM', 'Không tìm thấy pet.')
    return { success: false }
  }

  // Check ownership
  if (pet1.owner.toString() !== character._id.toString() || 
      pet2.owner.toString() !== character._id.toString()) {
    log('SYSTEM', 'Bạn không sở hữu những pet này.')
    return { success: false }
  }

  // Check if same pet
  if (petId1 === petId2) {
    log('SYSTEM', 'Không thể lai giống cùng một pet.')
    return { success: false }
  }

  // Check breeding cooldown
  if (pet1.lastBreedTime) {
    const timeSinceBreed = Date.now() - pet1.lastBreedTime.getTime()
    if (timeSinceBreed < gameSettings.pet.breedingCooldown * 1000) {
      log('SYSTEM', 'Pet 1 chưa sẵn sàng lai giống.')
      return { success: false }
    }
  }

  if (pet2.lastBreedTime) {
    const timeSinceBreed = Date.now() - pet2.lastBreedTime.getTime()
    if (timeSinceBreed < gameSettings.pet.breedingCooldown * 1000) {
      log('SYSTEM', 'Pet 2 chưa sẵn sàng lai giống.')
      return { success: false }
    }
  }

  // Check for breeding stone
  if (!removeItemFromInventory(character, 'pet_breeding_stone', 1)) {
    log('SYSTEM', 'Cần Đá Lai Giống để thực hiện.')
    return { success: false }
  }

  // Breeding success check
  const success = Math.random() < gameSettings.pet.breedingSuccessRate

  if (!success) {
    log('PET', 'Lai giống thất bại!')
    log('SYSTEM', 'Hãy thử lại.')
    
    // Update cooldowns even on failure
    pet1.lastBreedTime = new Date()
    pet2.lastBreedTime = new Date()
    await pet1.save()
    await pet2.save()
    
    return { success: false }
  }

  // Create offspring with combined stats
  const offspring = new Pet({
    owner: character._id,
    monsterId: pet1.monsterId, // Use parent 1's type
    level: 1,
    exp: 0,
    stats: {
      hp: Math.floor((pet1.stats.hp + pet2.stats.hp) / 2),
      attack: Math.floor((pet1.stats.attack + pet2.stats.attack) / 2),
      defense: Math.floor((pet1.stats.defense + pet2.stats.defense) / 2),
      speed: Math.floor((pet1.stats.speed + pet2.stats.speed) / 2)
    },
    mode: 'Combat',
    generation: Math.max(pet1.generation || 1, pet2.generation || 1) + 1
  })

  await offspring.save()

  // Update parent cooldowns
  pet1.lastBreedTime = new Date()
  pet2.lastBreedTime = new Date()
  await pet1.save()
  await pet2.save()

  log('PET', 'Lai giống thành công!')
  log('PET', `Chào mừng pet mới [${offspring.monsterId}] thế hệ ${offspring.generation}!`)
  log('SYSTEM', `HP: ${offspring.stats.hp}, ATK: ${offspring.stats.attack}, DEF: ${offspring.stats.defense}`)

  return { success: true, offspringId: offspring._id }
}
