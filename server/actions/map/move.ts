import { z } from 'zod'
import type { ActionHandler } from '../types'
import type { ZoneId } from '~~/shared/config'

const movePayloadSchema = z.object({ direction: z.string() })

export const move: ActionHandler = async ({ character, payload }) => {
  const { direction } = movePayloadSchema.parse(payload)
  const currentZoneData = ZoneManager.getZone(character.currentZoneId as ZoneId)

  if (!currentZoneData) throw new Error('Không tìm thấy khu vực hiện tại.')
  const exit = currentZoneData.connectedZones?.find(z => z.direction === direction)
  if (!exit) throw new Error('Không thể đi theo hướng này.')

  const newZoneId = exit.zoneId as ZoneId
  const newZoneData = ZoneManager.getZone(newZoneId)
  if (!newZoneData) throw new Error(`Khu vực đích '${newZoneId}' không tồn tại.`)

  character.currentZoneId = newZoneId
  await MonsterEngine.spawnMonstersForZone(newZoneId) // Sinh quái

  const activeMonsters = await MonsterEngine.getMonstersInZone(newZoneId) // Lấy quái từ Redis
  const newZone = {
    ...newZoneData,
    monsters: activeMonsters // Gắn danh sách quái vật động
  }

  return {
    log: [{ message: `Bạn đã di chuyển đến khu vực [${newZone.name}].`, type: 'info' }],
    updates: {
      zone: newZone,
      character: { currentZoneId: character.currentZoneId }
    }
  }
}
