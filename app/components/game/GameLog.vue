<template>
  <div class="h-full flex flex-col">
    <h2 class="text-lg text-gray-400 border-b border-gray-600/50 pb-1 mb-2 flex-shrink-0">
      [ Log Hệ Thống ]
    </h2>
    <div
      ref="logContainer"
      class="flex-grow overflow-auto space-y-1 pr-2 text-sm max-h-[calc(100vh-200px)]"
    >
      <p
        v-for="(log, index) in logs"
        :key="index"
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

// --- LOGIC TỰ ĐỘNG CUỘN ĐÃ ĐƯỢC TỐI ƯU ---
watch(logs, () => {
  if (!logContainer.value) return

  // 1. Lấy thông tin vị trí cuộn TRƯỚC KHI DOM được cập nhật
  const { scrollTop, scrollHeight, clientHeight } = logContainer.value

  // 2. Kiểm tra xem người dùng có đang ở gần cuối hay không (sai số 20px)
  const isScrolledToBottom = scrollHeight - clientHeight <= scrollTop + 20

  // 3. Chờ cho DOM cập nhật (log mới được thêm vào)
  nextTick(() => {
    // 4. Nếu trước đó người dùng đang ở cuối, thì mới tự động cuộn xuống
    if (isScrolledToBottom && logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight
    }
  })
}, { deep: true })

// --- CÁC HÀM TIỆN ÍCH ---
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
    case 'error': case 'defeat': return 'text-red-500 font-semibold'
    case 'warning': return 'text-yellow-400'
    case 'success': case 'victory': return 'text-green-400 font-semibold'
    case 'reward': return 'text-cyan-400'
    case 'info': return 'text-blue-400'
    case 'command': return 'text-purple-400'
    case 'attack':
    default: return 'text-gray-300'
  }
}
</script>
