import type { ActionHandler } from '../types'

export const cultivate: ActionHandler = async ({ character }) => {
  const now = new Date()
  const lastTick = new Date(character.lastCultivateTick)
  const secondsPassed = Math.floor((now.getTime() - lastTick.getTime()) / 1000)

  if (secondsPassed < 5)
    return { log: { message: 'Bạn cần chờ thêm một chút trước khi tu luyện tiếp.', type: 'info' }, updates: {} }

  // **KIỂM TRA ĐIỀU KIỆN TU LUYỆN - SỬA LỖI Ở ĐÂY**
  // Lấy dữ liệu zone từ file config, không cần `await`
  const zone = ZoneManager.getZone(character.currentZoneId)
  if (!zone)
    throw new Error('Lỗi: Không tìm thấy khu vực hiện tại.')

  if (!zone.allowCultivation) {
    return {
      log: {
        message: 'Nơi này linh khí hỗn loạn, không thích hợp để tu luyện.',
        type: 'warning'
      },
      updates: {}
    }
  }

  // **TÍNH TOÁN EXP NHẬN ĐƯỢC**
  const baseExpPerTick = 1 // 1 EXP mỗi 5 giây

  // Hệ số từ Tâm Cảnh (stateOfMind)
  const stateOfMindMultiplier = character.cultivation.stateOfMind || 1.0

  // Hệ số từ Linh khí khu vực (energyFluctuation)
  const zoneMultiplier = zone.energyFluctuation || 1.0

  const expGained = Math.max(1, Math.floor(baseExpPerTick * stateOfMindMultiplier * zoneMultiplier))

  if (expGained > 0) {
    character.cultivation.exp += expGained
    character.lastCultivateTick = now
  } else {
    return {
      log: {
        message: 'Tâm cảnh bất ổn, không thể hấp thụ linh khí.',
        type: 'warning'
      },
      updates: {}
    }
  }

  return {
    log: {
      message: `Bạn tu luyện và nhận được ${expGained} điểm tu vi.`,
      type: 'info'
    },
    updates: {
      character: {
        cultivation: character.cultivation,
        lastCultivateTick: character.lastCultivateTick
      }
    }
  }
}
