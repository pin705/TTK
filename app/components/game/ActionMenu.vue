<template>
  <div v-if="mapStore.currentZone" class="space-y-2">
    <h3 class="text-purple-400">[Hành động]</h3>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="exit in mapStore.currentZone.connectedZones"
        :key="exit.direction"
        class="bg-green-800/50 hover:bg-green-700/50 px-3 py-1 rounded disabled:opacity-50"
        :disabled="isLoading"
        @click="performMove(exit.direction)"
      >
        Đi về phía {{ exit.direction }}
      </button>

      <button
        v-for="resource in mapStore.currentZone.resources"
        :key="resource.itemId"
        class="bg-yellow-800/50 hover:bg-yellow-700/50 px-3 py-1 rounded disabled:opacity-50"
        :disabled="isLoading"
        @click="performGather(resource.itemId)"
      >
        Thu thập [{{ resource.itemId }}]
      </button>
    </div>
    <p v-if="isLoading" class="text-sm text-gray-400 animate-pulse">
      Đang xử lý...
    </p>
  </div>
</template>

<script setup lang="ts">
const mapStore = useMapStore()
const { execute, isLoading } = useGameAction()

async function performMove(direction: string) {
  await execute('map/move', { direction })
}

async function performGather(itemId: string) {
  await execute('resource/gather', { itemId })
}
</script>
