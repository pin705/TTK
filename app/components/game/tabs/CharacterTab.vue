<template>
  <div
    v-if="playerStore.character && currentRealm"
    class="space-y-4 text-sm"
  >
    <div class="p-3 bg-gray-900/50 border border-gray-700 shadow-inner font-mono">
      <h3 class="text-yellow-400 border-b border-yellow-700/50 pb-1 mb-2 font-bold uppercase tracking-wider">
        > TU LUYỆN & CẢNH GIỚI
      </h3>
      <div class="grid grid-cols-2 gap-x-4 mb-2">
        <p>Cấp Độ: <span class="text-white font-bold">Lv.{{ playerStore.character.level }}</span></p>
        <p>Cảnh Giới Hiện Tại: <span class="text-white font-bold">{{ playerStore.character.cultivation.stage }}</span></p>
        <p>Ngộ Đạo: <span class="text-white">{{ playerStore.character.cultivation.comprehension }}</span></p>
        <p class="text-sm">
          Tâm Cảnh:
          <span
            :class="mindStateColor"
            class="font-semibold"
          >{{ mindStateText }}</span>
          <span class="text-xs text-gray-400"> ({{ playerStore.character.cultivation.stateOfMind.toFixed(1) }})</span>
        </p>
      </div>

      <div class="mb-2">
        <div class="flex justify-between items-center text-xs mb-0.5 text-purple-400">
          <span class="font-semibold">Tu Vi</span>
          <span>{{ playerStore.character.cultivation.exp }} / {{ currentRealm.expRequired }}</span>
        </div>
        <div class="w-full bg-gray-800/50 rounded-full h-2.5 relative overflow-hidden border border-gray-700">
          <div
            class="bg-gradient-to-r from-purple-600 to-indigo-500 h-full rounded-full transition-all duration-300 ease-in-out"
            :style="{ width: expPercent + '%' }"
          />
        </div>
      </div>
      <div
        v-if="canBreakthrough"
        class="mt-3 text-center"
      >
        <button
          class="bg-gradient-to-r from-yellow-600 to-orange-500 hover:from-yellow-500 hover:to-orange-400 text-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg border border-yellow-400/80 text-base uppercase tracking-widest"
          :disabled="isLoading"
          @click="performBreakthrough"
        >
          ✦ ĐỘT PHÁ ✦
        </button>
        <p
          v-if="nextRealm"
          class="text-xs text-gray-400 mt-1"
        >
          Đủ điều kiện đột phá lên: <span class="text-yellow-300 font-medium">{{ nextRealm.name }}</span>
        </p>
        <p
          v-else
          class="text-xs text-green-400 mt-1"
        >
          Đã đạt cảnh giới tối đa!
        </p>
      </div>
      <div
        v-else-if="currentRealm && nextRealm"
        class="mt-3 text-center"
      >
        <p class="text-xs text-gray-500 italic">
          Cần thêm {{ expNeeded }} Tu Vi để đột phá lên {{ nextRealm.name }}
        </p>
      </div>
    </div>

    <div class="p-3 bg-gray-900/50 border border-gray-700 shadow-inner font-mono">
      <h3 class="text-emerald-400 border-b border-emerald-700/50 pb-1 mb-2 font-bold flex items-center justify-between uppercase tracking-wider">
        <span>
          > PHÂN PHỐI TIỀM NĂNG
        </span>
        <span class="text-xs text-gray-400">ĐIỂM:
          <span class="text-white font-bold text-base ml-1">{{ playerStore.character.statPoints }}</span>
        </span>
      </h3>
      <div
        v-if="playerStore.character.statPoints > 0"
        class="space-y-2"
      >
        <div
          v-for="statKey in allocatableStats"
          :key="statKey"
          class="flex items-center justify-between bg-gray-800/50 p-1.5 border border-gray-700/50"
        >
          <span class="flex items-center text-xs uppercase tracking-wider">
            <span :class="statColor(statKey)" class="font-bold mr-2">{{ statPrefix(statKey) }}:</span>
            {{ statName(statKey) }}
            <span class="text-gray-400 ml-1">({{ playerStore.character.allocatedStats[statKey] || 0 }})</span>
          </span>
          <button
            class="bg-emerald-700/70 hover:bg-emerald-600/70 text-emerald-100 px-2 py-0.5 text-xs border border-emerald-600/50 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
            :disabled="isLoading"
            @click="allocate(statKey, 1)"
          >
            [ + ]
          </button>
        </div>
      </div>
      <div
        v-else
        class="text-sm text-gray-500 italic text-center py-2"
      >
        Không có điểm tiềm năng để phân phối. Hãy lên cấp để nhận thêm!
      </div>
    </div>

    <div class="p-3 bg-gray-900/50 border border-gray-700 shadow-inner font-mono">
      <h3 class="text-cyan-400 border-b border-cyan-700/50 pb-1 mb-2 font-bold uppercase tracking-wider">
        > BẢNG THUỘC TÍNH
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-xs">
        <span><span class="text-red-400 font-bold">TẤN:</span> <span class="text-white ml-1">{{ playerStore.character.stats.attack }}</span></span>
        <span><span class="text-blue-400 font-bold">THỦ:</span> <span class="text-white ml-1">{{ playerStore.character.stats.defense }}</span></span>
        <span><span class="text-green-400 font-bold">TỐC:</span> <span class="text-white ml-1">{{ playerStore.character.stats.speed }}</span></span>
        <span><span class="text-yellow-400 font-bold">CHÍ MẠNG:</span> <span class="text-white ml-1">{{ (playerStore.character.stats.critChance * 100).toFixed(0) }}%</span></span>
        <span><span class="text-purple-400 font-bold">KHÁNG:</span> <span class="text-white ml-1">{{ playerStore.character.stats.resistance }}</span></span>
        <span><span class="text-sky-400 font-bold">NÉ:</span> <span class="text-white ml-1">{{ (playerStore.character.stats.dodgeChance * 100).toFixed(0) }}%</span></span>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 mt-1 pt-1 border-t border-gray-700/50 text-xs">
        <span><span class="text-gray-400 font-bold">DANH VỌNG:</span> <span class="text-white ml-1">{{ playerStore.character.reputation }}</span></span>
        <span><span :class="karmaColor" class="font-bold">KARMA:</span> <span
          :class="karmaColor"
          class="ml-1"
        >{{ playerStore.character.karma }}</span></span>
      </div>
    </div>

    <div class="p-3 bg-gray-900/50 border border-gray-700 shadow-inner font-mono">
      <h3 class="text-orange-400 border-b border-orange-700/50 pb-1 mb-2 font-bold uppercase tracking-wider">
        > TRẠNG THÁI & HIỆU ỨNG
      </h3>
      <div
        v-if="!activeEffects.length"
        class="text-sm text-gray-500 italic"
      >
        - Trạng thái bình thường -
      </div>
      <ul
        v-else
        class="space-y-1 text-sm"
      >
        <li
          v-for="effect in activeEffects"
          :key="effect.effectId"
          :class="effectColor(effect)"
          class="flex items-center text-xs"
        >
          <span class="font-bold mr-2">{{ effectPrefix(effect) }}</span>
          <span class="font-medium">{{ effect.name }}</span>
          <span
            v-if="effect.durationText"
            class="text-gray-400 text-xs ml-auto pl-2 whitespace-nowrap"
          >({{ effect.durationText }})</span>
        </li>
      </ul>
    </div>

    <GameEvolutionPanel />

    <GameInventoryPanel />
  </div>
  <div
    v-else
    class="p-3 text-center text-gray-500 italic"
  >
    Đang tải dữ liệu nhân vật...
  </div>
</template>

<script setup lang="ts">
import { useGameAction } from '~/composables/useGameAction' // Sửa đường dẫn nếu cần
import { usePlayerStore } from '~/stores/player' // Sửa đường dẫn nếu cần
import { formatDistanceToNowStrict } from 'date-fns'
import { vi } from 'date-fns/locale'
import { realms } from '~~/shared/config'
import { ALLOCATABLE_STATS, type AllocatableStat } from '~~/shared/config' // Import config điểm tiềm năng

const { execute, isLoading } = useGameAction()
const playerStore = usePlayerStore()

// --- Logic Cảnh giới & EXP (Sửa lỗi allRealms) ---
const currentRealm = computed(() => {
  if (!playerStore.character?.cultivation?.stageId) return Object.values(realms)[0] // Mặc định cảnh giới đầu
  const stageId = playerStore.character.cultivation.stageId as keyof typeof realms
  // Trả về cảnh giới từ config, hoặc cảnh giới đầu tiên nếu stageId không hợp lệ
  return realms[stageId] || Object.values(realms)[0]
})

const nextRealm = computed(() => {
  if (!currentRealm.value) return null
  // Tìm cảnh giới có level cao hơn 1 bậc
  return Object.values(realms).find(r => r.level === currentRealm.value.level + 1)
})

const expPercent = computed(() => {
  // Chống lỗi chia cho 0 nếu expRequired không hợp lệ
  if (!playerStore.character || !currentRealm.value || currentRealm.value.expRequired <= 0) return 0
  // Đảm bảo % không vượt quá 100 hoặc nhỏ hơn 0
  return Math.max(0, Math.min(100, (playerStore.character.cultivation.exp / currentRealm.value.expRequired) * 100))
})

// Tính EXP còn thiếu để đột phá
const expNeeded = computed(() => {
  if (!playerStore.character || !currentRealm.value) return 0
  return Math.max(0, currentRealm.value.expRequired - playerStore.character.cultivation.exp)
})

// Điều kiện để nút Đột Phá hiển thị và hoạt động
const canBreakthrough = computed(() => {
  if (!playerStore.character || !currentRealm.value) return false
  // Phải có cảnh giới tiếp theo VÀ đủ EXP
  return !!nextRealm.value && playerStore.character.cultivation.exp >= currentRealm.value.expRequired
})

async function performBreakthrough() {
  await execute('character/breakthrough')
}

// Danh sách các chỉ số có thể cộng điểm
const allocatableStats = ALLOCATABLE_STATS

// Hàm gọi action cộng điểm
async function allocate(stat: AllocatableStat, amount: number) {
  await execute('character/allocateStat', { stat, amount })
}

// --- Hàm tiện ích cho giao diện điểm tiềm năng ---
function statName(statKey: AllocatableStat): string {
  switch (statKey) {
    case 'attack': return 'Tấn Công'
    case 'defense': return 'Phòng Thủ'
    case 'speed': return 'Tốc Độ'
    case 'hpMax': return 'Sinh Lực'
    case 'energyMax': return 'Năng Lượng'
    default: return statKey
  }
}
function statPrefix(statKey: AllocatableStat): string {
  switch (statKey) {
    case 'attack': return 'TẤN'
    case 'defense': return 'THỦ'
    case 'speed': return 'TỐC'
    case 'hpMax': return 'HP'
    case 'energyMax': return 'NL'
    default: return 'ST'
  }
}
function statColor(statKey: AllocatableStat): string {
  switch (statKey) {
    case 'attack': return 'text-red-400'
    case 'defense': return 'text-blue-400'
    case 'speed': return 'text-green-400'
    case 'hpMax': return 'text-red-400'
    case 'energyMax': return 'text-sky-400'
    default: return 'text-gray-400'
  }
}

// --- Hiển thị Tâm Cảnh ---
const mindStateText = computed(() => {
  const mind = playerStore.character?.cultivation.stateOfMind || 1.0
  console.log('Tâm Cảnh:', playerStore.character?.cultivation.stateOfMind)
  if (mind >= 1.5) return 'Tâm Như Minh Kính'
  if (mind >= 1.1) return 'Tâm Thần Bình Tĩnh'
  if (mind >= 0.9) return 'Tâm Trạng Bình Thường'
  if (mind >= 0.5) return 'Tâm Thần Bất Ổn'
  return 'Tâm Ma Xâm Thực'
})

const mindStateColor = computed(() => {
  const mind = playerStore.character?.cultivation.stateOfMind || 1.0
  if (mind >= 1.5) return 'text-sky-400'
  if (mind >= 1.1) return 'text-green-400'
  if (mind >= 0.9) return 'text-gray-300' // Bình thường màu xám nhạt
  if (mind >= 0.5) return 'text-yellow-400'
  return 'text-red-500 font-bold' // Hỗn loạn màu đỏ đậm
})

// --- Hiển thị Karma ---
const karmaColor = computed(() => {
  const karma = playerStore.character?.karma || 0
  if (karma > 50) return 'text-sky-400' // Thiện cao
  if (karma > 0) return 'text-green-400' // Thiện
  if (karma < -50) return 'text-red-600' // Ác cao
  if (karma < 0) return 'text-red-400' // Ác
  return 'text-white' // Trung lập
})

// --- Hiển thị Hiệu Ứng ---
const activeEffects = computed(() => {
  if (!playerStore.character?.effects) return []
  const now = Date.now()
  return playerStore.character.effects
    // Lọc bỏ hiệu ứng hết hạn
    .filter(e => !e.expiresAt || new Date(e.expiresAt).getTime() > now)
    .map(e => ({
      ...e,
      // Tính toán thời gian còn lại dạng "còn lại X p/s"
      durationText: e.expiresAt
        ? formatDistanceToNowStrict(new Date(e.expiresAt), { addSuffix: true, locale: vi }).replace('khoảng ', '') // Bỏ chữ "khoảng"
        : null
    }))
})

// Hàm chọn màu cho hiệu ứng
function effectColor(effect: any): string {
  if (effect.effectId === 'heavy_wound') return 'text-red-500 font-semibold'
  // Thêm màu cho các buff (màu xanh lá) / debuff khác (màu vàng/cam)
  if (effect.hpRegenModifier > 0) return 'text-green-400' // Buff hồi phục
  if (effect.hpRegenModifier < 0) return 'text-yellow-400' // Debuff hồi phục
  return 'text-gray-300'
}

// Hàm chọn prefix cho hiệu ứng
function effectPrefix(effect: any): string {
  if (effect.effectId === 'heavy_wound') return '✗'
  if (effect.hpRegenModifier > 0) return '↑' // Buff
  if (effect.hpRegenModifier < 0) return '↓' // Debuff
  return '•'
}
</script>
