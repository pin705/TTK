// Player Housing System (Feature 8)
import type { ActionHandler } from '../types'
import { gameSettings } from '~/shared/config/gameSettings'
import { removeItemFromInventory, addItemToInventory } from '~/server/utils/inventoryManager'

export const build: ActionHandler = async (character, payload, log) => {
  const { blueprintId } = payload as { blueprintId: string }

  // Check if character has housing unlocked
  if (!character.housingUnlocked) {
    log('SYSTEM', `Cần ${gameSettings.housing.baseBuildingCost} Tinh Thể Năng Lượng để mở khóa hệ thống nhà.`)
    return { success: false }
  }

  // Check if has blueprint
  if (!removeItemFromInventory(character, blueprintId, 1)) {
    log('SYSTEM', 'Bạn không có bản vẽ này.')
    return { success: false }
  }

  // Check building materials
  const materialsNeeded = blueprintId === 'basic_house_blueprint' ? 50 : 100
  if (!removeItemFromInventory(character, 'building_materials', materialsNeeded)) {
    log('SYSTEM', `Cần ${materialsNeeded} Vật Liệu Xây Dựng.`)
    // Return blueprint
    addItemToInventory(character, blueprintId, 1)
    return { success: false }
  }

  // Initialize housing if not exists
  if (!character.housing) {
    character.housing = {
      level: 0,
      rooms: [],
      furniture: [],
      storage: []
    }
  }

  // Build structure
  if (blueprintId === 'basic_house_blueprint') {
    character.housing.level = 1
    character.housing.rooms = ['main_room', 'bedroom']
    log('HOUSING', 'Đã xây dựng Nhà Cơ Bản!')
    log('HOUSING', 'Bạn có: Phòng Chính, Phòng Ngủ')
  } else if (blueprintId === 'advanced_house_blueprint') {
    character.housing.level = 2
    character.housing.rooms = ['main_room', 'bedroom', 'kitchen', 'workshop', 'storage_room']
    log('HOUSING', 'Đã xây dựng Nhà Cao Cấp!')
    log('HOUSING', 'Bạn có: Phòng Chính, Phòng Ngủ, Bếp, Xưởng, Kho')
  }

  // Move character to their base
  character.currentZone = 'personal_base'

  await character.save()

  log('SYSTEM', 'Xây dựng hoàn tất!')
  log('SYSTEM', 'Bạn có thể trang trí nhà bằng nội thất.')

  return { success: true }
}
