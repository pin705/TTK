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

// === Tải dữ liệu ban đầu ===
const { data, error } = await useFetch('/api/game/getInitialState')

if (error.value) {
  addLog('Không thể tải dữ liệu game!', 'error')
} else if (data.value) {
  playerStore.setCharacter(data.value.character)
  mapStore.setCurrentZone(data.value.currentZone)
  addLog('Chào mừng đến với Tinh Không Đạo Lộ.')
  await fetchInitialLogs()
}
</script>
