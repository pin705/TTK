import { z } from 'zod'
import type { ActionHandler } from '../types'
import type { ZoneId } from '~~/shared/config'

const movePayloadSchema = z.object({ direction: z.string() })

export const move: ActionHandler = async ({ character, payload }) => {
  const { direction } = movePayloadSchema.parse(payload)
  const currentZoneData = ZoneManager.getZone(character.currentZoneId as ZoneId)

  if (!currentZoneData) throw new Error('Không tìm thấy khu vực hiện tại.')
  console.log('currentZoneData', character.currentZoneId, currentZoneData)
  const exit = currentZoneData.connectedZones?.find(z => z.direction === direction)
  if (!exit) throw new Error('Không thể đi theo hướng này.')

  const newZoneId = exit.zoneId as ZoneId
  const newZoneData = ZoneManager.getZone(newZoneId)
  if (!newZoneData) throw new Error(`Khu vực đích '${newZoneId}' không tồn tại.`)

  // Check energy cost for movement
  const energyCost = (newZoneData as any).energyCostPerMove || 0
  if (energyCost > 0) {
    // Calculate actual cost with module reduction if equipped
    let actualCost = energyCost
    if (character.evolution?.modules?.survival) {
      // TODO: Get module stats from items config
      // For now assume 20% reduction
      actualCost = Math.floor(energyCost * 0.8)
    }

    if (character.energy < actualCost) {
      throw new Error(`Không đủ năng lượng để di chuyển. Cần ${actualCost}, có ${character.energy}.`)
    }

    character.energy -= actualCost
  }

  character.currentZoneId = newZoneId
  await MonsterEngine.spawnMonstersForZone(newZoneId) // Sinh quái

  const activeMonsters = await MonsterEngine.getMonstersInZone(newZoneId) // Lấy quái từ Redis
  const newZone = {
    ...newZoneData,
    monsters: activeMonsters // Gắn danh sách quái vật động
  }

  const logs = [{ message: `Bạn đã di chuyển đến khu vực [${newZone.name}].`, type: 'info' }]
  const updates = { zone: newZone, character: { currentZoneId: character.currentZoneId } }

  // --- ✨ TỰ ĐỘNG DỪNG TU LUYỆN KHI DI CHUYỂN ✨ ---
  // Dừng cả khi di chuyển vào vùng an toàn VÀ vùng không an toàn
  if (character.cultivation.isCultivating) {
    character.cultivation.isCultivating = false
    logs.push({ message: 'Bạn di chuyển, làm gián đoạn quá trình tu luyện.', type: 'warning' })
    updates.character.cultivation = character.cultivation
  }

  return {
    log: logs,
    updates: {
      zone: newZone,
      character: { currentZoneId: character.currentZoneId }
    }
  }
}
