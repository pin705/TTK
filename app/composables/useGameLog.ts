import { ref } from 'vue'

// Định nghĩa cấu trúc của một entry trong log
export interface LogEntry {
  timestamp: string
  message: string
  type?: 'default' | 'error' | 'warning' | 'success' | 'info' | 'command' | 'attack' | 'victory' | 'reward' | 'defeat'
}

const logs = ref<LogEntry[]>([])
const MAX_CLIENT_LOGS = 10 // Giới hạn số log hiển thị trên client

export function useGameLog() {
  // Hàm tải log ban đầu từ server (Redis)
  async function fetchInitialLogs() {
    try {
      const initialLogs = await $fetch<LogEntry[]>('/api/game/logs')
      logs.value = initialLogs.reverse()
    } catch (e) {
      console.error('Không thể tải lịch sử log', e)
    }
  }

  // Hàm thêm một mảng các log mới
  function addMultipleLogs(newLogs: LogEntry[]) {
    logs.value.push(...newLogs)
    const excess = logs.value.length - MAX_CLIENT_LOGS
    if (excess > 0) {
      logs.value.splice(0, excess)
    }
  }

  // Hàm thêm một log đơn lẻ (dùng cho các lệnh /command ở client)
  function addLog(message: string, type?: LogEntry['type']) {
    console.log('Adding log:', message, type)
    addMultipleLogs([{
      timestamp: new Date().toISOString(),
      message,
      type: type || 'default'
    }])
  }

  return { logs, addLog, addMultipleLogs, fetchInitialLogs }
}
