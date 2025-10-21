<template>
  <div>
    <NuxtLayout name="game" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const playerStore = usePlayerStore()
const mapStore = useMapStore()
const { addLog } = useGameLog()
const { execute, isLoading } = useGameAction() // Lấy execute từ useGameAction

// === Tải dữ liệu ban đầu ===
const { data, error } = await useFetch('/api/game/getInitialState')

if (error.value) {
  addLog('Không thể tải dữ liệu game!', 'error')
}
else if (data.value) {
  playerStore.setCharacter(data.value.character)
  mapStore.setCurrentZone(data.value.currentZone)
  addLog('Chào mừng đến với Tinh Không Đạo Lộ.')
}

// === Logic Tu Luyện Bị Động ===
let cultivateInterval: any = null

onMounted(() => {
  cultivateInterval = setInterval(async () => {
    // Chỉ chạy nếu không có hành động nào khác đang diễn ra
    if (!isLoading.value)
      await execute('character/cultivate')
  }, 5000) // 5 giây một lần
})

onUnmounted(() => {
  clearInterval(cultivateInterval)
})
</script>
