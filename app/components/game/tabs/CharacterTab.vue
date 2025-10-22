<template>
  <div
    v-if="playerStore.character && currentRealm"
    class="space-y-4"
  >
    <div class="p-3 bg-gray-900/50 rounded">
      <h3 class="text-yellow-400 border-b border-yellow-700/50 pb-1 mb-2">
        Tu Luyện
      </h3>
      <p>Cảnh giới: <span class="text-white">{{ playerStore.character.cultivation.stage }}</span></p>

      <div>
        <span class="text-sm text-purple-400">Tu Vi</span>
        <div class="w-full bg-gray-700 rounded-full h-2.5 mt-1">
          <div
            class="bg-purple-600 h-2.5 rounded-full"
            :style="{ width: expPercent + '%' }"
          />
        </div>
        <p class="text-xs text-right">
          {{ playerStore.character.cultivation.exp }} / {{ currentRealm.expRequired }}
        </p>
      </div>

      <div
        v-if="canBreakthrough"
        class="mt-3 text-center"
      >
        <button
          class="bg-yellow-600/50 hover:bg-yellow-500/50 px-4 py-2 rounded disabled:opacity-50 animate-pulse"
          :disabled="isLoading"
          @click="performBreakthrough"
        >
          ⚡ ĐỘT PHÁ ⚡
        </button>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4" />
    <GameInventoryPanel />
  </div>
</template>

<script setup lang="ts">
// Cần một store hoặc composable để chứa dữ liệu các cảnh giới
const { execute, isLoading } = useGameAction()
const playerStore = usePlayerStore()

// Dữ liệu mẫu, lý tưởng nhất là tạo một store để tải tất cả realm khi game bắt đầu
const allRealms = ref([
  { level: 1, stageId: 'apprentice_low', name: 'Học Đồ Cấp Thấp', expRequired: 100 },
  { level: 2, stageId: 'apprentice_mid', name: 'Học Đồ Cấp Trung', expRequired: 300 },
  { level: 3, stageId: 'apprentice_high', name: 'Học Đồ Cấp Cao', expRequired: 800 },
  { level: 4, stageId: 'fighter_low', name: 'Võ Giả Cấp Thấp', expRequired: 2000 }
])

const currentRealm = computed(() => {
  if (!playerStore.character) return null
  return allRealms.value.find(r => r.stageId === playerStore.character.cultivation.stageId) || allRealms.value[0]
})

const expPercent = computed(() => {
  if (!playerStore.character || !currentRealm.value) return 0
  return (playerStore.character.cultivation.exp / currentRealm.value.expRequired) * 100
})

const canBreakthrough = computed(() => {
  if (!playerStore.character || !currentRealm.value) return false
  return playerStore.character.cultivation.exp >= currentRealm.value.expRequired
})

async function performBreakthrough() {
  await execute('character/breakthrough')
}
</script>
