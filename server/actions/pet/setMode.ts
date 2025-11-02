import type { ActionHandler } from '../types'
import { Pet } from '../../models/pet.model'

export const setMode: ActionHandler = async ({ character, payload }) => {
  const { mode } = payload as { mode: 'Combat' | 'Collect' }
  
  if (!character.activePetId) {
    throw new Error('Không có pet đang kích hoạt')
  }
  
  const pet = await Pet.findById(character.activePetId)
  if (!pet) {
    throw new Error('Pet không tồn tại')
  }
  
  pet.mode = mode
  await pet.save()
  
  return {
    log: [
      { type: 'system', message: `[HỆ THỐNG]: Đã chuyển chế độ pet sang: ${mode === 'Combat' ? 'Chiến Đấu' : 'Thu Thập'}` }
    ],
    updates: {}
  }
}
