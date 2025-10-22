<template>
  <div
    v-if="playerStore.character && currentRealm"
    class="space-y-4"
  >
    <div class="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
      <p class="mt-2 text-sm">
        Tâm Cảnh:
        <span :class="mindStateColor">{{ mindStateText }} ({{ playerStore.character.cultivation.stateOfMind.toFixed(1) }})</span>
      </p>
    </div>

    <div class="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
      <h3 class="text-yellow-400 border-b border-yellow-700/50 pb-1 mb-2 font-semibold">
        Tu Luyện
      </h3>
      <p>Cảnh giới: <span class="text-white font-bold">{{ playerStore.character.cultivation.stage }}</span></p>

      <div>
        <span class="text-sm text-purple-400">Tu Vi</span>
        <div class="w-full bg-gray-700 rounded-full h-2.5 mt-1">
          <div
            class="bg-purple-600 h-2.5 rounded-full"
            :style="{ width: expPercent + '%' }"
          />
        </div>
        <p class="text-xs text-right">
          {{ playerStore.character.cultivation.exp }} / {{ currentRealm.expRequired }}
        </p>
      </div>

      <div
        v-if="canBreakthrough"
        class="mt-3 text-center"
      >
        <button
          class="bg-yellow-600/50 hover:bg-yellow-500/50 px-4 py-2 rounded disabled:opacity-50 animate-pulse font-bold"
          :disabled="isLoading"
          @click="performBreakthrough"
        >
          ⚡ ĐỘT PHÁ ⚡
        </button>
        <p
          v-if="nextRealm"
          class="text-xs text-gray-400 mt-1"
        >
          Cảnh giới tiếp theo: {{ nextRealm.name }}
        </p>
      </div>
    </div>

    <div class="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
      <h3 class="text-cyan-400 border-b border-cyan-700/50 pb-1 mb-2 font-semibold">
        Bảng Thuộc Tính
      </h3>
      <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <span>Tấn Công: <span class="text-white">{{ playerStore.character.stats.attack }}</span></span>
        <span>Phòng Thủ: <span class="text-white">{{ playerStore.character.stats.defense }}</span></span>
        <span>Tốc Độ: <span class="text-white">{{ playerStore.character.stats.speed }}</span></span>
        <span>Chí Mạng: <span class="text-white">{{ (playerStore.character.stats.critChance * 100).toFixed(0) }}%</span></span>
        <span>Kháng: <span class="text-white">{{ playerStore.character.stats.resistance }}</span></span>
        <span>Né Tránh: <span class="text-white">{{ (playerStore.character.stats.dodgeChance * 100).toFixed(0) }}%</span></span>
      </div>
    </div>

    <div class="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
      <h3 class="text-orange-400 border-b border-orange-700/50 pb-1 mb-2 font-semibold">
        Trạng Thái Hiện Tại
      </h3>
      <div
        v-if="!activeEffects.length"
        class="text-sm text-gray-500 italic"
      >
        - Bình thường -
      </div>
      <ul
        v-else
        class="space-y-1 text-sm"
      >
        <li
          v-for="effect in activeEffects"
          :key="effect.effectId"
          :class="effectColor(effect)"
        >
          <Icon
            :name="effectIcon(effect)"
            class="inline-block mr-1"
          />
          {{ effect.name }}
          <span
            v-if="effect.durationText"
            class="text-gray-400 text-xs ml-1"
          >({{ effect.durationText }})</span>
        </li>
      </ul>
    </div>

    <GameInventoryPanel />
  </div>
</template>

<script setup lang="ts">
import { realms } from '~~/shared/config' // <-- IMPORT TRỰC TIẾP TỪ CONFIG
import { formatDistanceToNowStrict } from 'date-fns'; // Import thư viện date-fns

const { execute, isLoading } = useGameAction()
const playerStore = usePlayerStore()

const currentRealm = computed(() => {
  if (!playerStore.character) return null
  const stageId = playerStore.character.cultivation.stageId as keyof typeof realms
  return realms[stageId] || Object.values(realms)[0]
})

const nextRealm = computed(() => {
  if (!currentRealm.value) return null
  return Object.values(realms).find(r => r.level === currentRealm.value.level + 1)
})

const expPercent = computed(() => {
  if (!playerStore.character || !currentRealm.value) return 0
  return (playerStore.character.cultivation.exp / currentRealm.value.expRequired) * 100
})

const canBreakthrough = computed(() => {
  if (!playerStore.character || !currentRealm.value) return false
  return playerStore.character.cultivation.exp >= currentRealm.value.expRequired
})

const mindStateText = computed(() => {
  const mind = playerStore.character?.cultivation.stateOfMind || 1.0
  if (mind >= 1.5) return 'Minh Kính'
  if (mind >= 1.1) return 'Bình Tĩnh'
  if (mind >= 0.9) return 'Bình Thường'
  if (mind >= 0.5) return 'Bất Ổn'
  return 'Hỗn Loạn'
})

const mindStateColor = computed(() => {
  const mind = playerStore.character?.cultivation.stateOfMind || 1.0
  if (mind >= 1.5) return 'text-sky-400'
  if (mind >= 1.1) return 'text-green-400'
  if (mind >= 0.9) return 'text-gray-300'
  if (mind >= 0.5) return 'text-yellow-400'
  return 'text-red-500'
})

// --- HIỂN THỊ HIỆU ỨNG ---
const activeEffects = computed(() => {
  if (!playerStore.character?.effects) return []
  const now = Date.now()
  return playerStore.character.effects
    .filter(e => !e.expiresAt || new Date(e.expiresAt).getTime() > now) // Lọc hiệu ứng còn hạn
    .map(e => ({
      ...e,
      // Tính toán thời gian còn lại
      durationText: e.expiresAt
        ? formatDistanceToNowStrict(new Date(e.expiresAt), { addSuffix: true, locale: vi })
        : null // Hiển thị 'còn lại X phút/giây'
    }))
})

// Hàm chọn màu cho hiệu ứng
function effectColor(effect: any): string {
  if (effect.effectId === 'heavy_wound') return 'text-red-500 font-semibold'
  // Thêm màu cho các buff/debuff khác
  return 'text-gray-300'
}

// Hàm chọn icon cho hiệu ứng
function effectIcon(effect: any): string {
  if (effect.effectId === 'heavy_wound') return 'lucide:heart-crack'
  // Thêm icon cho các buff/debuff khác
  return 'lucide:sparkles' // Icon mặc định
}

async function performBreakthrough() {
  await execute('character/breakthrough')
}
</script>
