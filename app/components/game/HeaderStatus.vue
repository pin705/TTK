<template>
  <div
    v-if="playerStore.character"
    class="relative text-sm"
  >
    <!-- Decorative corner ornaments -->
    <div class="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cultivation-gold-500/60"></div>
    <div class="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cultivation-gold-500/60"></div>
    <div class="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cultivation-gold-500/60"></div>
    <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cultivation-gold-500/60"></div>

    <div class="flex items-center space-x-3 md:space-x-4 mb-4">
      <div class="relative group flex-shrink-0">
        <div class="absolute inset-0 rounded-full bg-gradient-to-br from-cultivation-gold-500/20 to-cultivation-mystic-500/20 blur-lg animate-pulse"></div>
        <img
          :src="playerStore.character.avatar || '/default-avatar.png'"
          alt="Avatar"
          class="h-16 w-16 md:h-20 md:w-20 rounded-full border-3 object-cover transition-all duration-300 shadow-xl relative z-10"
          :class="isWounded ? 'border-red-500/70 grayscale-[70%] shadow-red-500/50' : 'border-cultivation-gold-500/70 shadow-cultivation-gold-500/50'"
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
          class="text-base md:text-lg text-transparent bg-clip-text bg-gradient-to-r from-cultivation-gold-300 via-cultivation-gold-200 to-cultivation-jade-300 font-bold truncate uppercase tracking-wider drop-shadow-lg"
          :title="playerStore.character.name"
        >
          {{ playerStore.character.name }}
        </h2>
        <p class="text-cultivation-gold-400 text-xs md:text-sm font-semibold flex items-center gap-1.5 mt-1">
          <span class="bg-cultivation-gold-900/40 px-2 py-0.5 rounded border border-cultivation-gold-600/40">Lv.{{ playerStore.character.level }}</span>
          <span class="text-cultivation-jade-400">{{ playerStore.character.cultivation.stage }}</span>
        </p>
        <div
          v-if="isWounded"
          class="text-red-400 text-xs font-semibold animate-pulse mt-2 flex items-center gap-1.5 bg-gradient-to-r from-red-900/40 to-red-800/40 px-2 py-1 rounded-lg border border-red-600/50 w-fit shadow-lg"
        >
          <Icon
            name="lucide:heart-crack"
            class="h-3 w-3"
          /> Trọng Thương
        </div>
      </div>
    </div>

    <div class="space-y-2.5 mt-4">
      <UiStatusBar
        label="HP"
        :current="playerStore.character.hp"
        :max="playerStore.character.hpMax"
        :color-class="isWounded ? 'bg-gradient-to-r from-red-600 via-red-700 to-red-800 border-red-600/60 text-red-200' : 'bg-gradient-to-r from-red-500 via-red-600 to-orange-600 border-red-500/60 text-red-100'"
        icon="lucide:heart-pulse"
      />
      <UiStatusBar
        label="N.Lượng"
        :current="playerStore.character.energy"
        :max="playerStore.character.energyMax"
        color-class="bg-gradient-to-r from-cultivation-celestial-500 via-cultivation-celestial-600 to-cultivation-celestial-700 border-cultivation-celestial-500/60 text-cultivation-celestial-100"
        icon="lucide:zap"
      />
      <UiStatusBar
        v-if="currentRealm"
        label="Tu Vi"
        :current="playerStore.character.cultivation.exp"
        :max="currentRealm.expRequired"
        color-class="bg-gradient-to-r from-cultivation-mystic-500 via-cultivation-mystic-600 to-indigo-600 border-cultivation-mystic-500/60 text-cultivation-mystic-100"
        icon="lucide:sparkles"
      />
    </div>

    <div class="grid grid-cols-1 gap-x-4 gap-y-2 mt-4 border-t border-cultivation-gold-700/30 pt-3 text-xs relative">
      <!-- Decorative divider line -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-cultivation-gold-500/50 to-transparent"></div>

      <div class="col-span-2 md:col-span-1 text-center md:text-left mt-2 md:mt-0">
        <p class="text-[10px] text-cultivation-gold-500/70 uppercase tracking-widest mb-1 flex items-center justify-center md:justify-start gap-1">
          <Icon name="lucide:map" class="h-3 w-3" />
          Vị Trí Hiện Tại
        </p>
        <p
          class="text-cultivation-jade-300 font-medium text-sm bg-cultivation-gold-900/20 px-3 py-1.5 rounded-lg border border-cultivation-gold-600/30 inline-flex items-center gap-2"
          :title="mapStore.currentZone?.name"
        >
          <Icon
            name="lucide:map-pin"
            class="h-3.5 w-3.5 text-cultivation-gold-400"
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
