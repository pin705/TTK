import { ref } from 'vue'

export interface LogEntry {
  timestamp: string
  message: string
  type?: 'error' | 'info' | 'command'
}

const logs = ref<LogEntry[]>([])
const MAX_CLIENT_LOGS = 50 // Giữ số lượng log trên client khớp với server

export function useGameLog() {
  /**
   * Tải log ban đầu từ server.
   */
  async function fetchInitialLogs() {
    try {
      const initialLogs = await $fetch<LogEntry[]>('/api/game/logs')
      logs.value = initialLogs.reverse() // Đảo ngược để log cũ nhất ở trên
    } catch (e) {
      console.error('Failed to fetch initial logs', e)
    }
  }

  /**
   * Thêm một log mới vào danh sách trên client.
   * @param message Nội dung log
   * @param type Loại log
   */
  function addLog(message: string, type?: LogEntry['type']) {
    logs.value.push({
      timestamp: new Date().toISOString(),
      message,
      type
    })

    // Cắt bớt log cũ trên client
    if (logs.value.length > MAX_CLIENT_LOGS)
      logs.value.shift()
  }

  return {
    logs,
    addLog,
    fetchInitialLogs
  }
}
