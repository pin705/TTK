import redis from './redis'

const LOG_LIST_PREFIX = 'logs:'
const MAX_LOGS = 50 // Giới hạn chỉ lưu 50 log mới nhất

// Định nghĩa các loại log hợp lệ
export type LogType = 'default' | 'error' | 'info' | 'command' | 'success' | 'warning'

export const Logger = {
  /**
   * Thêm một log mới cho nhân vật.
   * @param characterId ID của nhân vật
   * @param message Nội dung log
   * @param type Loại log
   */
  async add(characterId: string, message: string | string[], type: LogType = 'default') {
    if (!characterId) return

    const key = `${LOG_LIST_PREFIX}${characterId}`
    const now = new Date().toISOString()

    // ĐỊNH DẠNG MỚI: timestamp|type|message
    const messages = Array.isArray(message)
      ? message.map(msg => `${now}|${type}|${msg}`)
      : [`${now}|${type}|${message}`]

    if (messages.length > 0) {
      await redis.lpush(key, ...messages)
      await redis.ltrim(key, 0, MAX_LOGS - 1)
    }
  },

  /**
   * Lấy toàn bộ danh sách log của một nhân vật.
   * @returns Mảng các chuỗi log thô từ Redis.
   */
  async get(characterId: string): Promise<string[]> {
    if (!characterId) return []
    const key = `${LOG_LIST_PREFIX}${characterId}`
    return await redis.lrange(key, 0, -1)
  },
}
