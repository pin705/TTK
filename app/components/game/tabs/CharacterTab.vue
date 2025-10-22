<template>
  <div
    v-if="playerStore.character && currentRealm"
    class="space-y-4"
  >
    <div class="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
      <h3 class="text-yellow-400 border-b border-yellow-700/50 pb-1 mb-2 font-semibold">
        Tu Luyện
      </h3>
      <p>Cảnh giới: <span class="text-white font-bold">{{ playerStore.character.cultivation.stage }}</span></p>

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
          class="bg-yellow-600/50 hover:bg-yellow-500/50 px-4 py-2 rounded disabled:opacity-50 animate-pulse font-bold"
          :disabled="isLoading"
          @click="performBreakthrough"
        >
          ⚡ ĐỘT PHÁ ⚡
        </button>
        <p
          v-if="nextRealm"
          class="text-xs text-gray-400 mt-1"
        >
          Cảnh giới tiếp theo: {{ nextRealm.name }}
        </p>
      </div>
    </div>

    <div class="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
      <h3 class="text-cyan-400 border-b border-cyan-700/50 pb-1 mb-2 font-semibold">
        Bảng Thuộc Tính
      </h3>
      <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <span>Tấn Công: <span class="text-white">{{ playerStore.character.stats.attack }}</span></span>
        <span>Phòng Thủ: <span class="text-white">{{ playerStore.character.stats.defense }}</span></span>
        <span>Tốc Độ: <span class="text-white">{{ playerStore.character.stats.speed }}</span></span>
        <span>Chí Mạng: <span class="text-white">{{ (playerStore.character.stats.critChance * 100).toFixed(0) }}%</span></span>
        <span>Kháng: <span class="text-white">{{ playerStore.character.stats.resistance }}</span></span>
        <span>Né Tránh: <span class="text-white">{{ (playerStore.character.stats.dodgeChance * 100).toFixed(0) }}%</span></span>
      </div>
    </div>

    <GameInventoryPanel />
  </div>
</template>

<script setup lang="ts">
import { realms } from '~~/shared/config' // <-- IMPORT TRỰC TIẾP TỪ CONFIG

const { execute, isLoading } = useGameAction()
const playerStore = usePlayerStore()

const currentRealm = computed(() => {
  if (!playerStore.character) return null
  const stageId = playerStore.character.cultivation.stageId as keyof typeof realms
  return realms[stageId] || Object.values(realms)[0]
})

const nextRealm = computed(() => {
  if (!currentRealm.value) return null
  return Object.values(realms).find(r => r.level === currentRealm.value.level + 1)
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
