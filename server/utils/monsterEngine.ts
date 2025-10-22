import redis from './redis'
import { zones, monsters, type ZoneId, type MonsterId } from '~~/shared/config' // Sửa đường dẫn nếu cần
import { randomUUID } from 'crypto' // Import thêm
import { ZoneManager, MonsterManager } from './gameDataManager'

const MONSTER_KEY_PREFIX = 'monster:'
const MONSTER_TTL_SECONDS = 3000 // Quái vật sẽ tự biến mất sau 5 phút nếu không ai tương tác

const NAME_PARTS = {
  prefix: ['Cuồng Bạo', 'Hắc Ám', 'Tinh Anh', 'Biến Dị'],
  suffix: {
    thú: ['Sói', 'Hổ', 'Sư Tử', 'Gấu'],
    côn_trùng: ['Bọ Cạp', 'Nhện Độc', 'Bọ Ngựa']
  }
}

export const MonsterEngine = {
  getMonsterKey(zoneId: string, monsterId: string) {
    return `${MONSTER_KEY_PREFIX}${zoneId}:${monsterId}`
  },
  async getMonsterInZone(zoneId: string, monsterId: string): Promise<any | null> {
    const monsterKey = `${MONSTER_KEY_PREFIX}${zoneId}:${monsterId}`
    const monsterData = await redis.hgetall(monsterKey)
    return monsterData
  },
  async getMonstersInZone(zoneId: string): Promise<any[]> {
    const keys = await redis.keys(`${MONSTER_KEY_PREFIX}${zoneId}:*`)
    if (keys.length === 0) return []

    const pipeline = redis.pipeline()
    keys.forEach(key => pipeline.hgetall(key))
    const results = await pipeline.exec()

    return results.map((res) => {
      const monsterData = res[1] as any
      if (monsterData && monsterData.id) { // Thêm kiểm tra monsterData.id
        return {
          ...monsterData,
          // SỬA LỖI: Thêm `|| 0` để tránh NaN
          level: parseInt(monsterData.level, 10) || 1, // Mặc định level 1 nếu lỗi
          hp: parseInt(monsterData.hp, 10) || 0,
          maxHp: parseInt(monsterData.maxHp, 10) || 1 // maxHp không nên là 0
        }
      }
      return null
    }).filter(Boolean)
  },

  /**
   * Sinh quái vật và lưu cả templateId
   */
  async generateAndSaveMonster(zoneId: ZoneId, monsterTemplateId: MonsterId) {
    const zoneConfig = ZoneManager.getZone(zoneId) // Dùng ZoneManager
    const monsterTemplate = MonsterManager.getMonsterTemplate(monsterTemplateId) // Dùng MonsterManager
    if (!zoneConfig || !monsterTemplate) return null // Thêm kiểm tra

    const monsterId = randomUUID()
    const key = `${MONSTER_KEY_PREFIX}${zoneId}:${monsterId}`

    const monsterData = {
      id: monsterId,
      templateId: monsterTemplateId, // Quan trọng: Lưu lại template gốc
      zoneId,
      name: monsterTemplate.name,
      level: monsterTemplate.level, // Lưu dạng string trong Redis
      hp: monsterTemplate.stats.hp,
      maxHp: monsterTemplate.stats.hp,
      status: 'idle',
      createdAt: Date.now().toString()
    }

    await redis.hset(key, monsterData)
    await redis.expire(key, MONSTER_TTL_SECONDS)
    return monsterData
  },

  /**
   * Sinh quái ngẫu nhiên dựa trên cấu hình zone (cần sửa lại)
   */
  async spawnMonstersForZone(zoneId: ZoneId) {
    const zoneConfig = ZoneManager.getZone(zoneId) // Dùng ZoneManager
    if (!zoneConfig || !zoneConfig.monsterDensity || zoneConfig.monsterDensity === 0) return

    const pattern = `${MONSTER_KEY_PREFIX}${zoneId}:*`
    const existingKeys = await redis.keys(pattern)
    const currentCount = existingKeys?.length ?? 0 // Xử lý trường hợp null/undefined
    const monsterDeficit = zoneConfig.monsterDensity - currentCount

    console.log(`Zone ${zoneId}: Density=${zoneConfig.monsterDensity}, Current=${currentCount}, Deficit=${monsterDeficit}`) // Debug log

    if (monsterDeficit > 0) {
      // Lấy danh sách monsterId có thể spawn trong zone này từ config zones.ts
      const possibleTemplates = zoneConfig.monsters || [] // Lấy mảng monsters từ config
      if (possibleTemplates.length === 0) {
        console.warn(`Zone ${zoneId} has density > 0 but no possible monster templates defined.`)
        return // Không có template để spawn
      }

      for (let i = 0; i < monsterDeficit; i++) {
        // Chọn ngẫu nhiên một template từ danh sách
        const randomTemplateEntry = possibleTemplates[Math.floor(Math.random() * possibleTemplates.length)]
        const templateId = randomTemplateEntry.monsterId as MonsterId
        // Gọi hàm generate mới đã có templateId
        await this.generateAndSaveMonster(zoneId, templateId)
      }
      console.log(`Spawned ${monsterDeficit} new monsters in zone ${zoneId}.`) // Debug log
    }
  }
}
