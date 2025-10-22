import { z } from 'zod'
import type { ActionHandler } from '../types'
import type { QuestId } from '~~/shared/config'

const acceptPayloadSchema = z.object({ questId: z.string() })

export const accept: ActionHandler = async ({ character, payload }) => {
  const { questId } = acceptPayloadSchema.parse(payload) as { questId: QuestId }
  const quest = QuestManager.getQuest(questId)

  if (!quest) throw new Error('Nhiệm vụ không tồn tại.')
  if (character.activeQuests.some(q => q.questId === questId)) throw new Error('Bạn đã nhận nhiệm vụ này rồi.')

  const newQuest = {
    questId,
    objectives: quest.objectives.map(obj => ({ ...obj, current: 0 })),
    completed: false
  }
  character.activeQuests.push(newQuest)

  return {
    log: { message: `Bạn đã nhận nhiệm vụ: [${quest.title}]`, type: 'info' },
    updates: { character: { activeQuests: character.activeQuests } }
  }
}
