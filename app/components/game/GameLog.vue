<template>
  <div class="h-full flex flex-col relative">
    <!-- Decorative header -->
    <div class="relative flex-shrink-0 mb-3">
      <h2 class="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cultivation-gold-400 to-cultivation-gold-300 border-b-2 border-cultivation-gold-700/30 pb-2 flex items-center gap-2 uppercase tracking-wider">
        <Icon name="lucide:scroll-text" class="h-5 w-5 text-cultivation-gold-400" />
        Log Hệ Thống
      </h2>
      <div class="absolute bottom-0 left-0 w-24 h-px bg-gradient-to-r from-cultivation-gold-500/50 to-transparent"></div>
    </div>
    
    <div
      ref="logContainer"
      class="flex-grow overflow-auto space-y-1.5 pr-2 text-sm max-h-[calc(100vh-200px)] custom-scrollbar"
    >
      <div
        v-for="(log, index) in logs"
        :key="index"
        class="hover:bg-cultivation-gold-900/10 px-2 py-1 rounded transition-colors"
      >
        <span class="text-cultivation-gold-600/60 mr-2 text-xs font-mono">{{ formatTime(log.timestamp) }}</span>
        <span :class="logColor(log.type)" class="leading-relaxed">{{ log.message }}</span>
      </div>
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
    case 'error': case 'defeat': return 'text-red-400 font-semibold'
    case 'warning': return 'text-cultivation-gold-400 font-semibold'
    case 'success': case 'victory': return 'text-cultivation-jade-400 font-semibold'
    case 'reward': return 'text-cultivation-gold-300 font-semibold'
    case 'info': return 'text-cultivation-celestial-400'
    case 'command': return 'text-cultivation-mystic-400 font-semibold'
    case 'attack':
    default: return 'text-cultivation-gold-200/80'
  }
}
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(251, 191, 36, 0.4) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, rgba(251, 191, 36, 0.4), rgba(217, 119, 6, 0.4));
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, rgba(251, 191, 36, 0.6), rgba(217, 119, 6, 0.6));
}
</style>
