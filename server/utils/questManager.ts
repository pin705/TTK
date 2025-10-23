import { quests, type QuestId, type QuestObjective } from '~~/shared/config'
import type { ICharacter, ActiveQuest } from '~~/server/models/character.model'

export const QuestManager = {
  /**
   * Giao nhiệm vụ cho người chơi.
   */
  assignQuest(character: ICharacter, questId: QuestId): boolean {
    const questTemplate = quests[questId]
    if (!questTemplate) return false // Nhiệm vụ không tồn tại

    // Kiểm tra các điều kiện nhận quest
    if (questTemplate.requiredLevel && character.level < questTemplate.requiredLevel) return false // Chưa đủ cấp
    if (character.activeQuests.some(q => q.questId === questId)) return false // Đã nhận rồi
    if (!questTemplate.isRepeatable && character.completedQuests.includes(questId)) return false // Đã hoàn thành và không lặp lại

    const newQuest: ActiveQuest = {
      questId,
      status: 'active',
      objectives: questTemplate.objectives.map(obj => ({
        type: obj.type,
        target: (obj as any)[`${obj.type}Id`] || (obj as any).itemId || (obj as any).monsterId, // Lấy target ID
        count: (obj as any).count || 1, // Mặc định count là 1 cho talk/explore
        current: 0
      })),
      startedAt: new Date()
    }
    character.activeQuests.push(newQuest)
    character.markModified('activeQuests') // Đánh dấu để Mongoose biết cần lưu
    return true
  },

  /**
   * Cập nhật tiến trình nhiệm vụ dựa trên một sự kiện.
   * @param eventType Loại sự kiện: 'kill', 'gather', 'talk', 'explore'
   * @param targetId ID của mục tiêu (monster, item, npc, zone)
   * @param amount Số lượng (thường là 1, trừ khi gather nhiều item cùng lúc)
   * @returns boolean - Liệu có nhiệm vụ nào được cập nhật không
   */
  updateProgress(character: ICharacter, eventType: string, targetId: string, amount: number = 1): boolean {
    let questUpdated = false
    let questCompleted = false

    character.activeQuests.forEach((quest) => {
      if (quest.status !== 'active') return // Chỉ cập nhật nhiệm vụ đang active

      let objectiveUpdated = false
      quest.objectives.forEach((obj) => {
        if (obj.type === eventType && obj.target === targetId && obj.current < obj.count) {
          obj.current = Math.min(obj.count, obj.current + amount)
          objectiveUpdated = true
          questUpdated = true
        }
      })

      // Nếu mục tiêu được cập nhật, kiểm tra xem quest đã hoàn thành chưa
      if (objectiveUpdated) {
        const allObjectivesMet = quest.objectives.every(obj => obj.current >= obj.count)
        if (allObjectivesMet) {
          quest.status = 'completed'
          questCompleted = true
        }
      }
    })

    if (questUpdated) {
      character.markModified('activeQuests')
    }

    // Trả về true nếu có quest vừa hoàn thành
    return questCompleted
  },

  /**
   * Trả thưởng nhiệm vụ.
   */
  claimReward(character: ICharacter, questId: QuestId): { success: boolean, logs: LogPayload[] } {
    const questIndex = character.activeQuests.findIndex(q => q.questId === questId)
    const quest = questIndex !== -1 ? character.activeQuests[questIndex] : null

    if (!quest || quest.status !== 'completed') {
      return { success: false, logs: [{ message: 'Bạn chưa hoàn thành nhiệm vụ này hoặc đã nhận thưởng.', type: 'warning' }] }
    }

    const questTemplate = quests[questId]
    if (!questTemplate) {
      return { success: false, logs: [{ message: 'Lỗi: Không tìm thấy thông tin nhiệm vụ.', type: 'error' }] }
    }

    const rewardLogs: LogPayload[] = [{ message: `Hoàn thành [${questTemplate.title}]!`, type: 'success' }]

    // Xử lý phần thưởng
    if (questTemplate.rewards.exp) {
      character.cultivation.exp += questTemplate.rewards.exp
      rewardLogs.push({ message: `Nhận được ${questTemplate.rewards.exp} EXP.`, type: 'reward' })
    }
    if (questTemplate.rewards.reputation) {
      character.reputation += questTemplate.rewards.reputation
      rewardLogs.push({ message: `Danh vọng tăng ${questTemplate.rewards.reputation}.`, type: 'reward' })
    }
    if (questTemplate.rewards.items) {
      questTemplate.rewards.items.forEach((itemReward) => {
        addItemToInventory(character, itemReward.itemId, itemReward.quantity)
        rewardLogs.push({ message: `Nhận được [${itemReward.itemId}] x${itemReward.quantity}.`, type: 'reward' })
      })
    }

    // Cập nhật trạng thái quest
    quest.status = 'claimed'
    if (!questTemplate.isRepeatable) {
      character.completedQuests.push(questId)
      character.markModified('completedQuests')
      // Xóa khỏi activeQuests nếu không lặp lại
      character.activeQuests.splice(questIndex, 1)
    } else {
      // Reset nhiệm vụ lặp lại (có thể thêm cooldown sau)
      character.activeQuests.splice(questIndex, 1)
    }

    character.markModified('activeQuests')

    return { success: true, logs: rewardLogs }
  },

  getQuest(questId: QuestId) {
    return quests[questId]
  },

  getAllQuests() {
    return quests
  }
}
