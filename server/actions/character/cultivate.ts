import type { ActionHandler } from '../types'

export const cultivate: ActionHandler = async ({ character }) => {
  const now = new Date()
  const zone = ZoneManager.getZone(character.currentZoneId as any)
  const logs: LogPayload[] = []

  // --- XỬ LÝ DỪNG TU LUYỆN ---
  if (character.cultivation.isCultivating) {
    character.cultivation.isCultivating = false
    character.lastCultivateTick = now // Cập nhật tick lần cuối
    logs.push({ message: 'Bạn đã dừng tu luyện.', type: 'info' })
    return {
      log: logs,
      updates: {
        character: {
          cultivation: character.cultivation,
          lastCultivateTick: character.lastCultivateTick
        }
      }
    }
  }

  // --- XỬ LÝ BẮT ĐẦU TU LUYỆN ---

  // 1. Kiểm tra điều kiện bắt đầu
  if (!zone) throw new Error('Lỗi: Không tìm thấy khu vực hiện tại.')
  if (!zone.allowCultivation) {
    throw new Error('Nơi này linh khí hỗn loạn, không thích hợp để tu luyện.')
  }
  if (character.inCombat) {
    throw new Error('Không thể tu luyện khi đang giao chiến.')
  }
  if (character.effects.some(e => e.effectId === 'heavy_wound' && (!e.expiresAt || new Date(e.expiresAt) > new Date()))) {
    throw new Error('Đang Trọng Thương, không thể tập trung tu luyện.')
  }

  // 2. Bắt đầu tu luyện
  character.cultivation.isCultivating = true
  character.lastCultivateTick = now
  logs.push({ message: 'Bạn bắt đầu tiến vào trạng thái tu luyện...', type: 'success' })

  return {
    log: logs,
    updates: {
      character: {
        cultivation: character.cultivation,
        lastCultivateTick: character.lastCultivateTick
      }
    }
  }
}
