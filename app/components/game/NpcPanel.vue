<template>
  <div v-if="npcsInZone.length > 0">
    <h3 class="text-green-400">[Nhân Vật]</h3>
    <ul class="pl-4 space-y-2">
      <li v-for="npc in npcsInZone" :key="npc.npcId" class="flex items-center justify-between">
        <span>👤 <span class="text-green-300">{{ npc.name }}</span></span>
        <button
          class="bg-blue-800/50 hover:bg-blue-700/50 px-3 py-1 rounded text-xs"
          :disabled="isLoading"
          @click="talkToNpc(npc.npcId)"
        >
          Nói chuyện
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// Giả sử chúng ta có một store hoặc composable để quản lý dữ liệu NPC
const { execute, isLoading } = useGameAction()
const mapStore = useMapStore()

// Cần có một cách để lấy thông tin chi tiết của NPC từ npcId
// Ví dụ: tạo một store `useNpcStore` để tải tất cả NPC khi game bắt đầu
const allNpcs = ref([{ npcId: 'vo_su_truong', name: 'Võ Sư Trương' }]) // Dữ liệu mẫu

const npcsInZone = computed(() => {
  if (!mapStore.currentZone?.npcs) return []
  return allNpcs.value.filter(npc =>
    mapStore.currentZone.npcs.some(zoneNpc => zoneNpc.npcId === npc.npcId)
  )
})

async function talkToNpc(npcId: string) {
  await execute('npc/talk', { npcId })
}
</script>
