import { z } from 'zod'
import type { ActionHandler } from '../types'

const initiatePayloadSchema = z.object({
  // The monsterId received here is the dynamic UUID from Redis
  monsterId: z.string().uuid('ID quái vật không hợp lệ')
})

export const initiate: ActionHandler = async ({ character, payload }) => {
  const { monsterId } = initiatePayloadSchema.parse(payload)

  const monsterData = await MonsterEngine.getMonsterInZone(character.currentZoneId, monsterId)

  // --- KIỂM TRA QUÁI VẬT TỒN TẠI TRONG REDIS ---
  if (!monsterData.id) {
    // Quái vật có thể đã bị giết hoặc hết hạn TTL
    return {
      log: [{ message: `Mục tiêu đã biến mất khỏi khu vực.`, type: 'warning' }],
      updates: {
        // Có thể cần cập nhật lại zone monsters ở đây nếu client chưa nhận được update
      }
    }
  }

  if (character.inCombat) {
    throw new Error('Bạn đang trong một trận chiến khác.')
  }

  // --- THIẾT LẬP TRẠNG THÁI CHIẾN ĐẤU ---
  const currentHp = parseInt(monsterData.hp, 10) || 0
  character.inCombat = true
  character.combat = {
    // Lưu ID động (UUID) của quái vật từ Redis
    monsterId: monsterData.id,
    // Lưu HP hiện tại của quái vật từ Redis
    monsterHp: currentHp,
    monsterName: monsterData.name
    // (Optional) Có thể lưu templateId ở đây nếu cần tra cứu chỉ số gốc sau này
    // monsterTemplateId: monsterData.templateId
  }

  return {
    log: [{
      message: `Bạn đã khiêu chiến với [${monsterData.name}]! Hãy chiến đấu!`,
      type: 'info'
    }],
    updates: {
      character: { inCombat: true, combat: character.combat }
    }
  }
}
