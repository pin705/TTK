<template>
  <div
    v-if="mapStore.currentZone"
    class="p-3 bg-gray-900/50 rounded-lg border border-purple-700/50 shadow-inner space-y-3"
  >
    <h3 class="text-purple-400 font-semibold flex items-center gap-2">
      <Icon name="lucide:zap" class="h-4 w-4 text-purple-500" />
      Hành Động Khả Dụng
    </h3>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="exit in mapStore.currentZone.connectedZones"
        :key="exit.direction"
        class="bg-gradient-to-r from-green-800/70 to-emerald-800/70 hover:from-green-700/70 hover:to-emerald-700/70 px-3 py-2 rounded-md disabled:opacity-50 border border-green-600/50 text-sm font-medium transition-all hover:scale-105 hover:shadow-lg flex items-center gap-1.5"
        :disabled="isLoading"
        @click="performMove(exit.direction)"
      >
        <Icon
          name="lucide:map-pin"
          class="h-4 w-4"
        />
        {{ exit.direction }}
      </button>

      <button
        v-for="resource in mapStore.currentZone.resources"
        :key="resource.itemId"
        class="bg-gradient-to-r from-yellow-800/70 to-orange-800/70 hover:from-yellow-700/70 hover:to-orange-700/70 px-3 py-2 rounded-md disabled:opacity-50 border border-yellow-600/50 text-sm font-medium transition-all hover:scale-105 hover:shadow-lg flex items-center gap-1.5"
        :disabled="isLoading"
        @click="performGather(resource.itemId)"
      >
        <Icon
          name="lucide:pickaxe"
          class="h-4 w-4"
        />
        Thu thập {{ getResourceName(resource.itemId) }}
      </button>

      <!-- <button
        v-if="canDisplayCultivateButton"
        class="px-3 py-1 rounded disabled:opacity-50 border text-sm flex items-center"
        :class="isCultivating ? 'bg-red-800/60 hover:bg-red-700/60 border-red-700 text-red-100' : 'bg-sky-800/60 hover:bg-sky-700/60 border-sky-700 text-sky-100'"
        :disabled="isLoading"
        @click="performCultivateToggle"
      >
        <Icon
          v-if="isCultivating"
          name="lucide:loader-circle"
          class="animate-spin -ml-1 mr-2 h-4 w-4"
        />
        <Icon
          v-else
          name="lucide:brain-circuit"
          class="inline-block mr-1 -mt-px"
        />
        {{ isCultivating ? 'Dừng Tu Luyện' : 'Bắt Đầu Tu Luyện' }}
      </button>

      <button
        v-if="canMeditate"
        class="bg-indigo-800/60 hover:bg-indigo-700/60 px-3 py-1 rounded disabled:opacity-50 border border-indigo-700 text-sm flex items-center"
        :disabled="isLoading"
        @click="performMeditate"
      >
        <Icon
          name="lucide:heart-pulse"
          class="inline-block mr-1 -mt-px"
        /> Đả Tọa
      </button> -->
    </div>

    <p
      v-if="isLoading && !isCultivating"
      class="text-xs text-gray-400 animate-pulse pt-1"
    >
      Đang xử lý...
    </p>
  </div>
</template>

<script setup lang="ts">
import { items, type ItemId } from '~~/shared/config'

const mapStore = useMapStore()
const { execute, isLoading } = useGameAction()
const playerStore = usePlayerStore()
const isCultivating = ref(false)

function getResourceName(itemId: string): string {
  const item = items[itemId as ItemId]
  return item?.name || itemId
}

// Kiểm tra trạng thái Trọng Thương
const isWounded = computed(() => {
  return playerStore.character?.effects?.some(e => e.effectId === 'heavy_wound' && (!e.expiresAt || new Date(e.expiresAt) > new Date())) || false
})
// Điều kiện hiển thị nút Tu Luyện
const canCultivate = computed(() => mapStore.currentZone?.allowCultivation && !isWounded.value)
const isFullHp = computed(() => {
  return playerStore.character ? playerStore.character.hp >= playerStore.character.hpMax : false
})
// Điều kiện hiển thị nút Đả Tọa
const canMeditate = computed(() => mapStore.currentZone?.allowCultivation && !isWounded.value && !isFullHp.value)

async function performMove(direction: string) {
  await execute('map/move', { direction })
}

async function performGather(itemId: string) {
  await execute('resource/gather', { itemId })
}

async function performMeditate() {
  execute('character/meditate')
}

const canDisplayCultivateButton = computed(() => {
  // Hiển thị nút nếu đang tu luyện (để có thể dừng)
  if (isCultivating.value) return true
  // Hoặc nếu ở khu vực cho phép và không bị thương
  return mapStore.currentZone?.allowCultivation && !isWounded.value
})

async function performCultivateToggle() {
  // Chỉ gọi action 'character/cultivate'
  // Action này sẽ tự động bật hoặc tắt tu luyện
  await execute('character/cultivate')
  // Không cần setTimeout nữa
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
