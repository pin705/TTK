import type { ActionHandler } from '../types'
import type { NpcId, QuestId, QuestTemplate } from '~~/shared/config' // Import types

export const talk: ActionHandler = async ({ character, payload }) => {
  const { npcId } = payload as { npcId: NpcId } // Assume payload is validated or use Zod

  const zone = ZoneManager.getZone(character.currentZoneId as any)
  if (!zone || !zone.npcs?.some(npc => npc.npcId === npcId)) {
    throw new Error('NPC này không có ở đây.')
  }

  const npc = NpcManager.getNpc(npcId)
  if (!npc) {
    throw new Error('Không tìm thấy thông tin NPC.')
  }

  const logs: LogPayload[] = []

  // 1. Lời chào ngẫu nhiên
  const randomGreeting = npc.dialogues.greeting[Math.floor(Math.random() * npc.dialogues.greeting.length)]
  logs.push({ message: `[${npc.name}]: "${randomGreeting}"`, type: 'default' })

  // 2. Cập nhật tiến trình quest 'talk' (nếu có)
  const talkQuestCompleted = QuestManager.updateProgress(character, 'talk', npc.npcId, 1)
  if (talkQuestCompleted) {
    logs.push({ message: `(Bạn đã hoàn thành mục tiêu nói chuyện với [${npc.name}] cho một nhiệm vụ!)`, type: 'success' })
  }

  // --- ✨ PHẦN ĐIỀU HƯỚNG NHIỆM VỤ ✨ ---

  // 3. Tìm nhiệm vụ có thể nhận (Available Quests)
  const availableQuests: { id: QuestId, template: QuestTemplate }[] = []
  Object.entries(QuestManager.getAllQuests()).forEach(([id, quest]) => {
    const questId = id as QuestId
    if (quest.npcId === npc.npcId // Đúng NPC
      && (!quest.requiredLevel || character.level >= quest.requiredLevel) // Đủ cấp độ (cần thêm level vào character)
      && !character.activeQuests.some(q => q.questId === questId) // Chưa nhận
      && (quest.isRepeatable || !character.completedQuests.includes(questId)) // Có thể lặp lại hoặc chưa hoàn thành
    ) {
      availableQuests.push({ id: questId, template: quest })
    }
  })

  if (availableQuests.length > 0) {
    logs.push({ message: `[${npc.name}] có ${availableQuests.length} nhiệm vụ mới cho bạn:`, type: 'info' })
    availableQuests.forEach((q) => {
      // Hiển thị rõ ràng hơn, kèm hướng dẫn
      logs.push({ message: `❓ [${q.template.title}] - Gõ: /quest accept ${q.id}`, type: 'info' })
    })
  }

  // 4. Tìm nhiệm vụ có thể trả (Completable Quests)
  const completableQuests: { id: QuestId, template: QuestTemplate }[] = []
  character.activeQuests.forEach((q) => {
    const template = QuestManager.getQuest(q.questId as QuestId)
    // Kiểm tra xem nhiệm vụ đã completed VÀ NPC trả nhiệm vụ (mục tiêu cuối cùng) là NPC này
    if (template && q.status === 'completed') {
      const lastObjective = template.objectives[template.objectives.length - 1]
      if (lastObjective?.type === 'talk' && lastObjective.npcId === npc.npcId) {
        completableQuests.push({ id: q.questId as QuestId, template })
      }
    }
  })

  if (completableQuests.length > 0) {
    logs.push({ message: `[${npc.name}]: Cậu đã hoàn thành việc ta giao rồi sao?`, type: 'info' })
    completableQuests.forEach((q) => {
      // Hiển thị rõ ràng hơn, kèm hướng dẫn
      logs.push({ message: `✅ [${q.template.title}] - Gõ: /quest claim ${q.id}`, type: 'success' })
    })
  }

  // --- Kết thúc phần điều hướng ---

  return { log: logs, updates: { character: character.toObject() } } // Trả về character updated (quan trọng nếu quest 'talk' hoàn thành)
}
