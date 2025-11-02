import redis from './redis'

const LOG_LIST_PREFIX = 'logs:'
const MAX_LOGS = 15 // Giới hạn chỉ lưu 50 log mới nhất

export type LogType = 'default' | 'error' | 'info' | 'command' | 'success' | 'warning' | 'attack' | 'victory' | 'reward' | 'defeat' | 'system' | 'combat' | 'guild' | 'market' | 'party' | 'event'

export interface LogPayload {
  message: string
  type: LogType
}

export const Logger = {
  /**
   * Thêm một hoặc nhiều log entries mới cho nhân vật.
   */
  async add(characterId: string, logs: LogPayload[]) {
    if (!characterId || logs.length === 0) return

    const key = `${LOG_LIST_PREFIX}${characterId}`

    // SỬA LỖI 1: Tạo timestamp riêng cho mỗi log trong batch
    const messages = logs.map(log => {
      const now = new Date().toISOString()
      return `${now}|${log.type}|${log.message}`
    })

    await redis.lpush(key, ...messages)
    // Lệnh ltrim vẫn rất quan trọng để giữ cho danh sách trên Redis luôn gọn gàng
    await redis.ltrim(key, 0, MAX_LOGS - 1)
  },

  /**
   * Lấy danh sách log mới nhất của một nhân vật.
   * @returns Mảng các chuỗi log thô từ Redis.
   */
  async get(characterId: string): Promise<string[]> {
    if (!characterId) return []
    const key = `${LOG_LIST_PREFIX}${characterId}`

    // SỬA LỖI 2: Luôn chỉ lấy tối đa MAX_LOGS phần tử
    // Điều này đảm bảo an toàn ngay cả khi ltrim gặp sự cố.
    return await redis.lrange(key, 0, MAX_LOGS - 1)
  },
}
