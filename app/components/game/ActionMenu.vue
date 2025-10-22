<template>
  <div
    v-if="mapStore.currentZone"
    class="space-y-2"
  >
    <h3 class="text-purple-400">
      [Hành động Khả dụng]
    </h3>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="exit in mapStore.currentZone.connectedZones"
        :key="exit.direction"
        class="bg-green-800/50 hover:bg-green-700/50 px-3 py-1 rounded disabled:opacity-50"
        :disabled="isLoading"
        @click="performMove(exit.direction)"
      >
        {{ exit.direction }}
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

      <button
        v-if="mapStore.currentZone.allowCultivation"
        class="bg-sky-800/50 hover:bg-sky-700/50 px-3 py-1 rounded disabled:opacity-50 flex items-center"
        :disabled="isLoading"
        @click="performCultivate"
      >
        <svg
          v-if="isCultivating"
          class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        Tu Luyện
      </button>
    </div>

    <p
      v-if="isLoading && !isCultivating"
      class="text-sm text-gray-400 animate-pulse"
    >
      Đang xử lý...
    </p>
  </div>
</template>

<script setup lang="ts">
const mapStore = useMapStore()
const { execute, isLoading } = useGameAction()
const isCultivating = ref(false)

async function performMove(direction: string) {
  await execute('map/move', { direction })
}

async function performGather(itemId: string) {
  await execute('resource/gather', { itemId })
}

async function performCultivate() {
  isCultivating.value = true
  await execute('character/cultivate')
  // Dùng setTimeout để tạo cảm giác "đang tu luyện" và tránh spam click
  setTimeout(() => {
    isCultivating.value = false
  }, 1000) // Hiệu ứng loading kéo dài 1 giây
}
</script>
