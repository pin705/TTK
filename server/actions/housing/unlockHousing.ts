// Unlock Housing System (Feature 8)
import type { ActionHandler } from '../types'
import { gameSettings } from '~/shared/config/gameSettings'

export const unlockHousing: ActionHandler = async (character, payload, log) => {
  // Check if already unlocked
  if (character.housingUnlocked) {
    log('SYSTEM', 'Bạn đã mở khóa hệ thống nhà.')
    return { success: false }
  }

  // Check energy crystals
  const cost = gameSettings.housing.baseBuildingCost
  const crystalItem = character.inventory.find(item => item.itemId === 'energy_crystal')
  
  if (!crystalItem || crystalItem.quantity < cost) {
    log('SYSTEM', `Cần ${cost} Tinh Thể Năng Lượng để mở khóa.`)
    return { success: false }
  }

  // Deduct crystals
  crystalItem.quantity -= cost
  if (crystalItem.quantity === 0) {
    character.inventory = character.inventory.filter(item => item.itemId !== 'energy_crystal')
  }

  // Unlock housing
  character.housingUnlocked = true
  character.housing = {
    level: 0,
    rooms: [],
    furniture: [],
    storage: []
  }

  await character.save()

  log('HOUSING', 'Đã mở khóa Hệ Thống Căn Cứ Cá Nhân!')
  log('HOUSING', 'Bạn có thể xây dựng nhà riêng và trang trí.')
  log('SYSTEM', `Đã tiêu hao ${cost} Tinh Thể Năng Lượng.`)

  return { success: true }
}
