import { z } from 'zod'
import type { ActionHandler } from '../types'
import type { QuestId, QuestObjective } from '~~/shared/config'

export const accept: ActionHandler = async ({ character, payload }) => {
  const { questId } = payload as { questId: QuestId } // Ép kiểu payload
  const questTemplate = QuestManager.getQuest(questId) // Lấy template từ config

  if (!questTemplate) {
    throw new Error('Nhiệm vụ không tồn tại.')
  }
  // Kiểm tra level (cần đảm bảo character có trường level)
  if (questTemplate.requiredLevel && character.level < questTemplate.requiredLevel) {
    throw new Error(`Yêu cầu Level ${questTemplate.requiredLevel} để nhận nhiệm vụ này.`)
  }
  if (character.activeQuests.some(q => q.questId === questId)) {
    throw new Error('Bạn đã nhận nhiệm vụ này rồi.')
  }
  if (!questTemplate.isRepeatable && character.completedQuests?.includes(questId)) {
    throw new Error('Bạn đã hoàn thành nhiệm vụ này và không thể làm lại.')
  }

  // --- SỬA LỖI MAPPING Ở ĐÂY ---
  const newQuest: ActiveQuest = {
    questId,
    status: 'active', // Sửa: Dùng status thay vì completed
    startedAt: new Date(),
    objectives: questTemplate.objectives.map((obj: QuestObjective) => {
      let targetId = ''
      // Xác định targetId dựa trên type
      switch (obj.type) {
        case 'kill':
          targetId = obj.monsterId
          break
        case 'gather':
          targetId = obj.itemId
          break
        case 'talk':
          targetId = obj.npcId
          break
        case 'explore':
          targetId = obj.zoneId
          break
      }
      // Tạo object đúng schema
      return {
        type: obj.type,
        target: targetId,
        count: (obj as any).count || 1, // Lấy count, mặc định là 1 nếu không có (talk, explore)
        current: 0 // Tiến trình ban đầu là 0
        // Không lưu description vào DB objectives của Character
      }
    })
  }
  // --- KẾT THÚC SỬA LỖI ---

  character.activeQuests.push(newQuest)
  character.markModified('activeQuests') // Quan trọng: Báo cho Mongoose biết mảng đã thay đổi

  return {
    log: [{ message: `Đã nhận nhiệm vụ: [${questTemplate.title}]`, type: 'info' }], // Trả về mảng log
    updates: {
      // Chỉ gửi lại phần activeQuests đã được cập nhật
      character: { activeQuests: character.activeQuests }
    }
  }
}
