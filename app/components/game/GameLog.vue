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

// Hàm format thời gian
function formatTime(isoString: string) {
  return new Date(isoString).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// Hàm chọn màu cho log
function logColor(type?: string) {
  switch (type) {
    case 'error': return 'text-red-500'
    case 'info': return 'text-cyan-400'
    case 'command': return 'text-yellow-400'
    default: return 'text-gray-300'
  }
}

watch(logs, () => {
  nextTick(() => {
    if (logContainer.value)
      logContainer.value.scrollTop = logContainer.value.scrollHeight
  })
}, { deep: true })
</script>
