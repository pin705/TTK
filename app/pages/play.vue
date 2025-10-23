<template>
  <div>
    <NuxtLayout name="game" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const playerStore = usePlayerStore()
const mapStore = useMapStore()
const { addLog, fetchInitialLogs } = useGameLog()
const { execute, isLoading } = useGameAction() // Lấy execute từ useGameAction

// === Tải dữ liệu ban đầu ===
const { data, error } = await useFetch('/api/game/getInitialState')

if (error.value) {
  addLog('Không thể tải dữ liệu game!', 'error')
} else if (data.value) {
  playerStore.setCharacter(data.value.character)
  mapStore.setCurrentZone(data.value.currentZone)
  addLog('Chào mừng đến với Tinh Không Đạo Lộ.', 'default')
  await fetchInitialLogs()
}

// === ✨ LOGIC HỒI PHỤC TỰ NHIÊN ✨ ===
let recoveryInterval: ReturnType<typeof setInterval> | null = null
const RECOVERY_INTERVAL_MS = 10000 // 10 giây một lần

const isWounded = computed(() => {
  return playerStore.character?.effects?.some(e => e.effectId === 'heavy_wound' && (!e.expiresAt || new Date(e.expiresAt) > new Date())) || false
})
onMounted(() => {
  // if (!isWounded.value) return // Chỉ thiết lập nếu không trọng thương
  recoveryInterval = setInterval(async () => {
    // Chỉ chạy nếu:
    // 1. Không có hành động nào khác đang diễn ra (isLoading = false)
    // 2. Nhân vật đã được tải (playerStore.character tồn tại)
    // 3. Nhân vật không ở trong combat (playerStore.character.inCombat = false)
    if (!isLoading.value && playerStore.character && !playerStore.character.inCombat) {
      // Không cần await vì đây là tiến trình nền, không muốn nó chặn các hành động khác
      execute('character/passiveRecoveryTick')
    }
  }, RECOVERY_INTERVAL_MS)
})

onUnmounted(() => {
  if (recoveryInterval) {
    clearInterval(recoveryInterval)
  }
})
</script>
