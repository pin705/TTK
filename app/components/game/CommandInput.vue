<template>
  <div class="mt-auto pt-2 border-t border-gray-600/50 flex-shrink-0">
    <form @submit.prevent="handleCommand">
      <div class="relative">
        <span class="absolute left-2 top-1/2 -translate-y-1/2 text-green-600">$</span>
        <input
          ref="inputRef"
          v-model="command"
          type="text"
          placeholder="Nhập lệnh... (ví dụ: /status, /map)"
          class="w-full bg-gray-900/50 text-green-300 placeholder-gray-500 pl-6 pr-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-green-500 transition"
          @keydown.up.prevent="showHistory('up')"
          @keydown.down.prevent="showHistory('down')"
          @keydown.esc.prevent="command = ''"
        >
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const command = ref('')
const commandHistory = ref<string[]>([])
let historyIndex = -1
const inputRef = ref<HTMLInputElement | null>(null)
const { executeCommand } = useCommandHandler()

/**
 * Xử lý khi người dùng nhấn Enter.
 */
function handleCommand() {
  const input = command.value.trim()
  if (!input) return

  // Thêm vào lịch sử nếu lệnh khác với lệnh cuối cùng
  if (commandHistory.value[0] !== input) {
    commandHistory.value.unshift(input)
  }

  // Giới hạn lịch sử lưu 50 lệnh
  if (commandHistory.value.length > 50) {
    commandHistory.value.pop()
  }

  historyIndex = -1 // Reset vị trí lịch sử

  // Thực thi lệnh
  executeCommand(input)

  command.value = '' // Xóa input
}

/**
 * Điều hướng qua lịch sử lệnh bằng phím mũi tên.
 */
function showHistory(direction: 'up' | 'down') {
  if (direction === 'up' && historyIndex < commandHistory.value.length - 1) {
    historyIndex++
  } else if (direction === 'down' && historyIndex > 0) {
    historyIndex--
  } else if (direction === 'down' && historyIndex <= 0) {
    historyIndex = -1
    command.value = ''
    return
  }

  if (historyIndex >= 0) {
    command.value = commandHistory.value[historyIndex]
  }
}

// Tự động focus vào ô input khi component được mount
onMounted(() => {
  inputRef.value?.focus()
})
</script>

<style scoped>
/* Thêm một vài style nhỏ để giao diện đẹp hơn */
input:focus {
  background-color: rgba(17, 24, 39, 0.7); /* bg-gray-900/70 */
}
</style>
