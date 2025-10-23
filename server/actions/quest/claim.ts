import { z } from 'zod'
import type { ActionHandler } from '../types'
import type { QuestId } from '~~/shared/config'

const claimPayloadSchema = z.object({ questId: z.string() })

export const claim: ActionHandler = async ({ character, payload }) => {
  const { questId } = claimPayloadSchema.parse(payload) as { questId: QuestId }

  const result = QuestManager.claimReward(character, questId)

  return {
    log: result.logs,
    updates: { character: character.toObject() } // Cập nhật lại toàn bộ character
  }
}
