<template>
  <div
    v-if="playerStore.character"
    class="p-3 border border-cyan-700/50 rounded-lg bg-gradient-to-br from-gray-900/70 via-black/50 to-gray-900/70 backdrop-blur-sm shadow-lg text-sm"
  >
    <div class="flex items-center space-x-3 md:space-x-4 mb-3">
      <div class="relative group flex-shrink-0">
        <img
          :src="playerStore.character.avatar || '/default-avatar.png'"
          alt="Avatar"
          class="h-16 w-16 md:h-20 md:w-20 rounded-full border-2 object-cover transition-all duration-300 shadow-md"
          :class="isWounded ? 'border-red-500/70 grayscale-[70%]' : 'border-cyan-500/70'"
        >
        <label
          for="avatar-upload"
          class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <UiLoadingSpinner
            v-if="isUploading"
            class="h-6 w-6 text-white"
          />
          <Icon
            v-else
            name="lucide:camera"
            class="h-5 w-5 text-gray-300 group-hover:text-white"
          />
        </label>
        <input
          id="avatar-upload"
          type="file"
          class="hidden"
          accept="image/png, image/jpeg, image/gif"
          @change="handleAvatarChange"
        >
      </div>
      <div class="flex-grow overflow-hidden">
        <h2
          class="text-base md:text-lg text-cyan-200 font-bold truncate uppercase tracking-wide"
          :title="playerStore.character.name"
        >
          {{ playerStore.character.name }}
        </h2>
        <p class="text-yellow-400 text-xs md:text-sm">
          Lv.{{ playerStore.character.level }} - {{ playerStore.character.cultivation.stage }}
        </p>
        <div
          v-if="isWounded"
          class="text-red-500 text-xs font-semibold animate-pulse mt-1 flex items-center gap-1 bg-red-900/30 px-1.5 py-0.5 rounded border border-red-700/50 w-fit"
        >
          <Icon
            name="lucide:heart-crack"
            class="h-3 w-3"
          /> Trọng Thương
        </div>
      </div>
    </div>

    <div class="space-y-2">
      <UiStatusBar
        label="HP"
        :current="playerStore.character.hp"
        :max="playerStore.character.hpMax"
        :color-class="isWounded ? 'bg-gradient-to-r from-red-700 to-red-900 border-red-700/50 text-red-300' : 'bg-gradient-to-r from-red-500 to-orange-500 border-red-600/50 text-red-200'"
        icon="lucide:heart-pulse"
      />
      <UiStatusBar
        label="N.Lượng"
        :current="playerStore.character.energy"
        :max="playerStore.character.energyMax"
        color-class="bg-gradient-to-r from-blue-500 to-sky-500 border-blue-600/50 text-blue-200"
        icon="lucide:zap"
      />
      <UiStatusBar
        v-if="currentRealm"
        label="Tu Vi"
        :current="playerStore.character.cultivation.exp"
        :max="currentRealm.expRequired"
        color-class="bg-gradient-to-r from-purple-500 to-indigo-500 border-purple-600/50 text-purple-200"
        icon="lucide:book-up"
      />
    </div>

    <div class="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 border-t border-cyan-700/30 pt-3 text-xs">
      <div class="col-span-2 md:col-span-1 grid grid-cols-3 gap-1 text-center">
        <UiStatDisplay
          icon="lucide:sword"
          :value="playerStore.character.stats?.attack || 0"
          label="T.Công"
        />
        <UiStatDisplay
          icon="lucide:shield"
          :value="playerStore.character.stats?.defense || 0"
          label="P.Thủ"
        />
        <UiStatDisplay
          icon="lucide:wind"
          :value="playerStore.character.stats?.speed || 0"
          label="T.Độ"
        />
      </div>
      <div class="col-span-2 md:col-span-1 text-center md:text-right mt-2 md:mt-0 border-t border-cyan-700/30 md:border-none pt-2 md:pt-0">
        <p class="text-[10px] text-gray-400 uppercase tracking-wider">
          Vị Trí Hiện Tại
        </p>
        <p
          class="text-cyan-300 font-medium text-sm truncate"
          :title="mapStore.currentZone?.name"
        >
          <Icon
            name="lucide:map-pin"
            class="inline-block mr-1 h-3.5 w-3.5 -mt-px"
          /> {{ mapStore.currentZone?.name || 'Không xác định' }}
        </p>
      </div>
    </div>

    <p
      v-if="uploadError"
      class="text-xs text-red-500 mt-2 text-center"
    >
      {{ uploadError }}
    </p>
  </div>
  <div
    v-else
    class="p-4 border border-gray-700/50 rounded-lg bg-gray-900/30 backdrop-blur-sm text-center text-gray-500 italic"
  >
    <UiLoadingSpinner class="h-5 w-5 inline mr-2" /> Đang tải dữ liệu mô phỏng...
  </div>
</template>

<script setup lang="ts">
import { realms } from '~~/shared/config'

// --- Stores & Composables ---
const playerStore = usePlayerStore()
const mapStore = useMapStore()
const { addLog } = useGameLog()
const { upload, isLoading: isUploading, error: uploadError } = useAvatarUploader()

// --- Computed Properties ---
const isWounded = computed(() => playerStore.character?.effects?.some(e => e.effectId === 'heavy_wound' && (!e.expiresAt || new Date(e.expiresAt) > new Date())) || false)

const calculatePercent = (current: number | undefined, max: number | undefined): number => {
  if (current === undefined || max === undefined || max <= 0) return 0
  return Math.max(0, Math.min(100, (current / max) * 100))
}

const hpPercent = computed(() => calculatePercent(playerStore.character?.hp, playerStore.character?.hpMax))
const energyPercent = computed(() => calculatePercent(playerStore.character?.energy, playerStore.character?.energyMax))

const currentRealm = computed(() => {
  if (!playerStore.character?.cultivation?.stageId) return null
  const stageId = playerStore.character.cultivation.stageId as keyof typeof realms
  return realms[stageId]
})

const expPercent = computed(() => calculatePercent(playerStore.character?.cultivation?.exp, currentRealm.value?.expRequired))

// --- Methods ---
async function handleAvatarChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  const file = input.files[0]
  await upload(file)
  input.value = '' // Reset input
}
</script>

<style scoped>
/* Có thể thêm các style tùy chỉnh nhỏ ở đây nếu cần */
</style>
