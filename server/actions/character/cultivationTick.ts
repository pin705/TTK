import type { ActionHandler } from '../types'

const CULTIVATION_TICK_RATE_SECONDS = 5

export const cultivationTick: ActionHandler = async ({ character }) => {
  // 1. Kiểm tra xem có đang tu luyện không
  if (!character.cultivation.isCultivating || character.inCombat) {
    // Nếu đang combat thì tự động dừng tu luyện
    if (character.cultivation.isCultivating) {
      character.cultivation.isCultivating = false
      return {
        log: [{ message: 'Bạn bị gián đoạn, đã dừng tu luyện.', type: 'warning' }],
        updates: { character: { cultivation: character.cultivation } }
      }
    }
    return { log: [], updates: {} } // Không làm gì cả
  }

  const now = new Date()
  const lastTick = new Date(character.lastCultivateTick)
  const secondsPassed = Math.floor((now.getTime() - lastTick.getTime()) / 1000)

  // 2. Kiểm tra đã đủ thời gian cho tick tiếp theo chưa
  if (secondsPassed < CULTIVATION_TICK_RATE_SECONDS) {
    return { log: [], updates: {} } // Chưa đến lúc
  }

  // 3. Tính toán số tick đã trôi qua (để xử lý offline/lag)
  const ticksPassed = Math.floor(secondsPassed / CULTIVATION_TICK_RATE_SECONDS)
  if (ticksPassed <= 0) {
    return { log: [], updates: {} }
  }

  const zone = ZoneManager.getZone(character.currentZoneId as any)
  if (!zone || !zone.allowCultivation) {
    // Bị di chuyển đến khu vực không an toàn -> Dừng tu luyện
    character.cultivation.isCultivating = false
    return {
      log: [{ message: 'Linh khí hỗn loạn! Bạn đã bị buộc dừng tu luyện.', type: 'warning' }],
      updates: { character: { cultivation: character.cultivation } }
    }
  }

  // 4. Tính toán EXP
  const baseExpPerTick = 5
  const stateOfMindMultiplier = character.cultivation.stateOfMind
  const zoneMultiplier = zone.energyFluctuation || 1.0
  const currentRealm = CultivationManager.getRealm(character.cultivation.stageId)
  const realmMultiplier = 1 + (currentRealm?.level || 1) * 0.05

  const expGainedPerTick = Math.max(1, Math.floor(baseExpPerTick * stateOfMindMultiplier * zoneMultiplier * realmMultiplier))

  if (expGainedPerTick <= 0) {
    return {
      log: [{ message: 'Tâm cảnh bất ổn, không thể hấp thụ linh khí.', type: 'warning' }],
      updates: {}
    }
  }

  const totalExpGained = expGainedPerTick * ticksPassed
  character.cultivation.exp += totalExpGained
  character.lastCultivateTick = new Date(lastTick.getTime() + ticksPassed * CULTIVATION_TICK_RATE_SECONDS * 1000)

  const logs: LogPayload[] = [{ message: `Tu luyện hấp thụ... nhận được ${totalExpGained} điểm tu vi.`, type: 'info' }]

  // 5. Kiểm tra lên cấp
  const levelUpLogs = checkAndApplyLevelUp(character)
  let statsUpdated = false
  if (levelUpLogs.length > 0) {
    logs.push(...levelUpLogs)
    recalculateStats(character)
    statsUpdated = true
  }

  // 6. Trả về kết quả
  return {
    log: logs,
    updates: {
      character: {
        cultivation: character.cultivation,
        lastCultivateTick: character.lastCultivateTick,
        ...(statsUpdated ? character : {})
      }
    }
  }
}
