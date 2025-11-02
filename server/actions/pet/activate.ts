import type { ActionHandler } from '../types'
import { Pet } from '../../models/pet.model'

export const activate: ActionHandler = async ({ character, payload }) => {
  const { petId } = payload as { petId: string }
  
  if (!petId) {
    throw new Error('Cần chỉ định pet ID')
  }
  
  const pet = await Pet.findById(petId)
  if (!pet) {
    throw new Error('Pet không tồn tại')
  }
  
  if (pet.ownerId.toString() !== character._id.toString()) {
    throw new Error('Đây không phải pet của bạn')
  }
  
  // Deactivate current pet if any
  if (character.activePetId) {
    return {
      log: [
        { type: 'system', message: `[HỆ THỐNG]: Đã thu hồi pet hiện tại.` },
        { type: 'system', message: `[HỆ THỐNG]: Kích hoạt [${pet.name}]!` }
      ],
      updates: {
        activePetId: pet._id
      }
    }
  }
  
  character.activePetId = pet._id as any
  
  return {
    log: [
      { type: 'system', message: `[HỆ THỐNG]: Kích hoạt [${pet.name}]!` },
      { type: 'system', message: `[HỆ THỐNG]: Chế độ: ${pet.mode === 'Combat' ? 'Chiến Đấu' : 'Thu Thập'}` }
    ],
    updates: {
      activePetId: pet._id
    }
  }
}
