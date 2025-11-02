<template>
  <div>
    <NuxtLayout name="game" />
  </div>
</template>

<script setup lang="ts">
// Import các store và composable như trong file của bạn
import { usePlayerStore } from '~/stores/player'
import { useMapStore } from '~/stores/map'
import { useGameLog } from '~/composables/useGameLog'
import { useGameAction } from '~/composables/useGameAction'

definePageMeta({
  layout: false
})

const playerStore = usePlayerStore()
const mapStore = useMapStore()
const { addLog, fetchInitialLogs } = useGameLog()
const { execute, isLoading } = useGameAction()

// === Tải dữ liệu ban đầu ===
const { data, error } = await useFetch('/api/game/getInitialState')

if (error.value) {
  addLog('Không thể tải dữ liệu game!', 'error')
} else if (data.value) {
  playerStore.setCharacter(data.value.character)
  mapStore.setCurrentZone(data.value.currentZone)
  addLog('Chào mừng đến với Tinh Không Đạo Lộ.', 'info')
  await fetchInitialLogs()
  
  // Display tutorial hints if available
  if (data.value.tutorialHints && data.value.tutorialHints.length > 0) {
    for (const hint of data.value.tutorialHints) {
      addLog(hint, 'info')
    }
  }
}

// === LOGIC HỒI PHỤC TỰ NHIÊN ===
let recoveryInterval: ReturnType<typeof setInterval> | null = null
const RECOVERY_INTERVAL_MS = 10000 // 10 giây một lần

// === ✨ LOGIC TU LUYỆN TỰ ĐỘNG (TICK) ✨ ===
let cultivationInterval: ReturnType<typeof setInterval> | null = null
const CULTIVATION_INTERVAL_MS = 5000 // 5 giây một lần

onMounted(() => {
  // Interval cho hồi phục HP
  recoveryInterval = setInterval(async () => {
    if (!isLoading.value && playerStore.character && !playerStore.character.inCombat) {
      execute('character/passiveRecoveryTick') // Không await
    }
  }, RECOVERY_INTERVAL_MS)

  // Interval cho tu luyện
  cultivationInterval = setInterval(async () => {
    // Chỉ chạy nếu:
    // 1. Không có hành động nào khác đang diễn ra (isLoading = false)
    // 2. Nhân vật đã được tải (playerStore.character tồn tại)
    // 3. Nhân vật đang trong trạng thái tu luyện (isCultivating = true)
    if (!isLoading.value && playerStore.character && playerStore.character.cultivation?.isCultivating) {
      execute('character/cultivationTick') // Không await
    }
  }, CULTIVATION_INTERVAL_MS)
})

onUnmounted(() => {
  if (recoveryInterval) {
    clearInterval(recoveryInterval)
  }
  if (cultivationInterval) {
    clearInterval(cultivationInterval)
  }
})
</script>
