<template>
  <div class="mt-auto pt-2 border-t border-gray-600/50 flex-shrink-0 relative">
    <ul
      v-if="showSuggestions && suggestions.length > 0"
      class="absolute bottom-full left-0 right-0 mb-1 max-h-48 overflow-y-auto p-1
             bg-gray-900/90 backdrop-blur-sm border border-cyan-700/50 rounded-lg shadow-lg"
    >
      <li
        v-for="(cmd, index) in suggestions"
        :key="cmd.command"
        :class="{ 'bg-cyan-700/50': index === activeSuggestionIndex }"
        class="p-2 cursor-pointer hover:bg-cyan-700/30 rounded flex justify-between items-center"
        @mousedown.prevent="selectSuggestion(cmd)"
      >
        <div>
          <span class="text-cyan-300 font-semibold">{{ cmd.command }}</span>
          <span
            v-if="cmd.args"
            class="text-yellow-400 ml-1"
          >{{ cmd.args }}</span>
          <span class="text-gray-400 text-xs ml-3 italic">{{ cmd.description }}</span>
        </div>
        <span
          v-if="cmd.alias"
          class="text-xs text-gray-500 hidden md:inline"
        >Alias: {{ cmd.alias }}</span>
      </li>
    </ul>

    <form @submit.prevent="handleCommand">
      <div class="relative">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-600 font-bold">$</span>
        <input
          ref="inputRef"
          v-model="command"
          type="text"
          placeholder="Nhập lệnh... (gõ /help để xem)"
          class="w-full bg-gray-900/70 text-green-300 placeholder-gray-500 pl-7 pr-3 py-2 rounded-md
                 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-gray-900 border border-gray-700/50 transition-all"
          autocomplete="off"
          @input="updateSuggestions"
          @keydown="handleKeydown"
          @blur="hideSuggestions"
          @focus="updateSuggestions"
        >
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { commandList, useCommandHandler } from '~/composables/useCommandHandler'; // ✨ Import commandList

const command = ref('')
const commandHistory = ref<string[]>([])
let historyIndex = -1
const inputRef = ref<HTMLInputElement | null>(null)
const { executeCommand } = useCommandHandler()

// --- ✨ State cho Gợi ý Lệnh ✨ ---
const showSuggestions = ref(false)
const activeSuggestionIndex = ref(-1)

// Lọc danh sách lệnh dựa trên input
const suggestions = computed(() => {
  if (!command.value.startsWith('/')) {
    return []
  }
  const search = command.value.substring(1).toLowerCase()
  return commandList.filter(cmd =>
    cmd.command.substring(1).startsWith(search)
    || (cmd.alias && cmd.alias.substring(1).startsWith(search))
  )
})

// --- ✨ Hàm Xử lý Gợi ý ✨ ---

// Cập nhật danh sách gợi ý khi gõ
function updateSuggestions() {
  if (command.value.startsWith('/')) {
    showSuggestions.value = suggestions.value.length > 0
    activeSuggestionIndex.value = -1 // Reset khi gõ
  } else {
    showSuggestions.value = false
  }
}

// Ẩn gợi ý (có delay để xử lý click)
function hideSuggestions() {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200) // Delay 200ms
}

// Chọn một gợi ý
function selectSuggestion(cmd: typeof commandList[0]) {
  command.value = cmd.command + (cmd.args ? ' ' : '') // Tự động thêm dấu cách nếu có args
  hideSuggestions()
  inputRef.value?.focus() // Focus lại input sau khi chọn
}

// --- ✨ Cập nhật Xử lý Bàn phím ✨ ---

function handleKeydown(e: KeyboardEvent) {
  // 1. Điều hướng Lịch sử Lệnh (Arrow Up/Down khi không có gợi ý)
  if (!showSuggestions.value || suggestions.value.length === 0) {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      showHistory('up')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      showHistory('down')
    }
    return // Dừng tại đây nếu không có gợi ý
  }

  // 2. Điều hướng Box Gợi ý Lệnh
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeSuggestionIndex.value = (activeSuggestionIndex.value + 1) % suggestions.value.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeSuggestionIndex.value = (activeSuggestionIndex.value - 1 + suggestions.value.length) % suggestions.value.length
  } else if (e.key === 'Tab' || e.key === 'Enter') {
    if (activeSuggestionIndex.value !== -1) {
      e.preventDefault()
      selectSuggestion(suggestions.value[activeSuggestionIndex.value])
    }
    // Nếu Enter và không có gợi ý nào được chọn, để form submit (handleCommand)
  } else if (e.key === 'Escape') {
    e.preventDefault()
    hideSuggestions()
  }
}

// --- ✨ Cập nhật Xử lý Lệnh (Submit) ✨ ---

function handleCommand() {
  // Nếu đang chọn gợi ý, ưu tiên chọn gợi ý thay vì submit
  if (showSuggestions.value && activeSuggestionIndex.value !== -1) {
    selectSuggestion(suggestions.value[activeSuggestionIndex.value])
    return
  }

  const input = command.value.trim()
  if (!input) return

  if (commandHistory.value[0] !== input) {
    commandHistory.value.unshift(input)
  }
  if (commandHistory.value.length > 50) {
    commandHistory.value.pop()
  }
  historyIndex = -1

  executeCommand(input) // Thực thi lệnh
  command.value = '' // Xóa input
  hideSuggestions() // Ẩn gợi ý sau khi submit
}

// --- (Hàm showHistory giữ nguyên) ---
function showHistory(direction: 'up' | 'down') {
  if (direction === 'up' && historyIndex < commandHistory.value.length - 1) {
    historyIndex++
  } else if (direction === 'down' && historyIndex > 0) {
    historyIndex--
  } else if (direction === 'down' && historyIndex <= 0) {
    historyIndex = -1
    command.value = ''
  }
}

// Tự động focus vào input
onMounted(() => {
  inputRef.value?.focus()
})
</script>

<style scoped>
/* Thêm style cho scrollbar của box gợi ý */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: rgba(17, 24, 39, 0.5); /* gray-900/50 */
  border-radius: 2px;
}
::-webkit-scrollbar-thumb {
  background: rgba(55, 65, 81, 0.7); /* gray-700/70 */
  border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover {
   background: rgba(75, 85, 99, 0.9); /* gray-600/90 */
}
</style>
