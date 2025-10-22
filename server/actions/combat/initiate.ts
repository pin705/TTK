import { z } from 'zod'
import type { ActionHandler } from '../types'
import type { MonsterId } from '~~/shared/config'

const initiatePayloadSchema = z.object({
  monsterId: z.string()
})

export const initiate: ActionHandler = async ({ character, payload }) => {
  const { monsterId } = initiatePayloadSchema.parse(payload) as { monsterId: MonsterId }

  const monsterTemplate = MonsterManager.getMonsterTemplate(monsterId)
  if (!monsterTemplate)
    throw new Error('Không tìm thấy quái vật này.')

  if (character.inCombat)
    throw new Error('Bạn đang trong một trận chiến khác.')

  // Thiết lập trạng thái chiến đấu
  character.inCombat = true
  character.combat = {
    // SỬA Ở ĐÂY: Gán trực tiếp monsterId (string) thay vì monster._id
    monsterId,
    monsterHp: monsterTemplate.hp,
    monsterName: monsterTemplate.name
  }

  return {
    log: {
      message: `Bạn đã khiêu chiến với [${monsterTemplate.name}]! Hãy chiến đấu!`,
      type: 'info'
    },
    updates: {
      character: { inCombat: true, combat: character.combat }
    }
  }
}
