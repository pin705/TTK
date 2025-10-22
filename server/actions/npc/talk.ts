import { z } from 'zod'
import type { ActionHandler } from '../types'

const talkPayloadSchema = z.object({
  npcId: z.string()
})

export const talk: ActionHandler = async ({ character, payload }) => {
  const { npcId } = talkPayloadSchema.parse(payload)

  const zone = await ZoneManager.getZone(character.currentZoneId)

  if (!zone || !zone.npcs.some(npc => npc.npcId === npcId))
    throw new Error('NPC này không có ở đây.')

  const npc = await NpcManager.getNpc(npcId)
  if (!npc)
    throw new Error('Không tìm thấy thông tin NPC.')

  // Lấy một câu thoại ngẫu nhiên
  const randomGreeting = npc.dialogues.greeting[Math.floor(Math.random() * npc.dialogues.greeting.length)]

  return {
    log: {
      message: `[${npc.name}]: "${randomGreeting}"`,
      type: 'info'
    },
    updates: {} // Hiện tại chỉ log, sau này có thể mở ra bảng hội thoại
  }
}
