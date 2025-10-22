<template>
  <div class="h-full flex flex-col">
    <h2 class="text-lg text-gray-400 border-b border-gray-600/50 pb-1 mb-2 flex-shrink-0">
      [ Log Hệ Thống ]
    </h2>
    <div
      ref="logContainer"
      class="flex-grow overflow-y-auto space-y-1 pr-2 text-sm"
    >
      <p
        v-for="(log, index) in logs"
        :key="index"
        class="font-mono"
      >
        <span class="text-gray-500 mr-2">{{ formatTime(log.timestamp) }}</span>
        <span :class="logColor(log.type)">{{ log.message }}</span>
      </p>
    </div>
    <GameCommandInput />
  </div>
</template>

<script setup lang="ts">
const { logs } = useGameLog()
const logContainer = ref<HTMLElement | null>(null)

/**
 * Định dạng chuỗi ISO timestamp thành dạng HH:mm:ss.
 */
function formatTime(isoString: string): string {
  if (!isoString) return ''
  return new Date(isoString).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

/**
 * Trả về class màu của TailwindCSS dựa trên loại log.
 */
function logColor(type?: string): string {
  switch (type) {
    // Lỗi & Thất bại
    case 'error':
    case 'defeat':
      return 'text-red-500 font-semibold'

    // Cảnh báo & Rủi ro
    case 'warning':
      return 'text-yellow-400'

    // Thành công & Tích cực
    case 'success':
    case 'victory':
      return 'text-green-400 font-semibold'

    // Nhận thưởng
    case 'reward':
      return 'text-cyan-400'

    // Thông tin từ hệ thống hoặc command
    case 'info':
      return 'text-blue-400'

    // Lệnh người dùng gõ
    case 'command':
      return 'text-purple-400'

    // Các log khác
    case 'attack':
    default:
      return 'text-gray-300'
  }
}

// Tự động cuộn xuống log mới nhất
watch(logs, () => {
  nextTick(() => {
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight
    }
  })
}, { deep: true })
</script>
