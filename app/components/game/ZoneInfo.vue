<!-- <template>
  <div
    v-if="mapStore.currentZone"
    class="space-y-4"
  >
    <div>
      <h2 class="text-xl text-cyan-400 font-bold">
        [ {{ mapStore.currentZone.name }} ]
      </h2>
      <p class="text-sm text-gray-300 mt-1 whitespace-pre-wrap border-l-2 border-cyan-700 pl-2 italic">
        {{ mapStore.currentZone.description }}
      </p>
    </div>

    <div>
      <h3 class="text-red-500 font-semibold">
        [Sinh Vật Nguy Hiểm]
      </h3>
      <p
        v-if="!mapStore.currentZone.monsters?.length"
        class="pl-2 text-sm text-gray-500 italic"
      >
        - Môi trường an toàn -
      </p>
      <ul
        v-else
        class="space-y-3 mt-2"
      >
        <li
          v-for="monster in mapStore.currentZone.monsters"
          :key="monster.id"
          class="p-2 bg-gray-900/50 rounded border border-gray-700 flex items-center justify-between hover:border-red-500/50 transition-colors duration-200"
        >
          <div class="flex-grow pr-4">
            <div class="flex justify-between items-baseline">
              <span class="font-semibold text-red-400">{{ monster.name }}</span>
              <span class="text-xs text-gray-400">Cấp {{ monster.level }}</span>
            </div>
            <div class="w-full bg-red-900/70 rounded-full h-2 mt-1 relative overflow-hidden border border-red-800/50">
              <div
                class="bg-red-500 h-full rounded-full transition-all duration-300 ease-in-out"
                :style="{ width: `${monsterHpPercent(monster)}%` }"
              />
              <span class="absolute inset-0 text-center text-[9px] font-bold text-white/80 leading-tight tracking-tighter">{{ monster.hp }} / {{ monster.maxHp }}</span>
            </div>
          </div>
          <button
            class="bg-red-800/50 hover:bg-red-700/50 px-3 py-1 rounded text-xs text-white flex-shrink-0 border border-red-700/50"
            :disabled="isLoading || playerStore.character?.inCombat"
            title="Tấn công"
            @click="initiateCombat(monster.id)"
          >
            <Icon name="lucide:sword" />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMapStore } from '~/stores/map'
import { usePlayerStore } from '~/stores/player' // Import PlayerStore
import { useGameAction } from '~/composables/useGameAction'
import { Icon } from '#components' // Import Icon

const mapStore = useMapStore()
const playerStore = usePlayerStore() // Lấy player store
const { execute, isLoading } = useGameAction()

// Hàm tính HP Percent cho từng quái vật
function monsterHpPercent(monster: any): number {
  if (!monster || monster.maxHp <= 0) return 0
  return Math.max(0, Math.min(100, (monster.hp / monster.maxHp) * 100))
}

async function initiateCombat(monsterId: string) {
  // Kiểm tra nếu người chơi đã trong combat
  if (playerStore.character?.inCombat) {
    // Có thể thêm log thông báo ở đây
    console.warn('Cannot initiate combat while already in combat.')
    return
  }
  await execute('combat/initiate', { monsterId })
}
</script> -->

<template>
  <div
    v-if="mapStore.currentZone"
    class="p-3 md:p-4 space-y-4 text-sm border-2 border-cultivation-gold-700/40 bg-gradient-to-b from-gray-900/60 via-cultivation-gold-950/20 to-gray-900/60 shadow-xl relative overflow-hidden backdrop-blur-sm font-mono"
  >
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cultivation-gold-900/10 via-transparent to-transparent opacity-30 pointer-events-none" />
    
    <!-- Decorative corners -->
    <div class="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-cultivation-gold-500/40"></div>
    <div class="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-cultivation-gold-500/40"></div>
    <div class="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 border-cultivation-gold-500/40"></div>
    <div class="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 border-cultivation-gold-500/40"></div>

    <div class="relative z-10">
      <h2 class="text-lg md:text-xl text-transparent bg-clip-text bg-gradient-to-r from-cultivation-gold-300 to-cultivation-jade-300 font-bold uppercase tracking-widest border-b-2 border-cultivation-gold-700/40 pb-2 mb-2">
        > {{ mapStore.currentZone.name }}
      </h2>
      <p class="text-cultivation-gold-200/80 italic leading-relaxed text-xs md:text-sm">
        {{ mapStore.currentZone.description }}
      </p>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-cultivation-gold-300/90 relative z-10 border-t-2 border-cultivation-gold-700/30 pt-3">
      <span class="flex items-center gap-1.5 bg-cultivation-gold-900/20 px-2 py-1.5 border border-cultivation-gold-700/30">
        <span class="text-cultivation-gold-400 font-bold">CẤP:</span>
        <span class="font-semibold">{{ mapStore.currentZone.recommendedLevel || '??' }}</span>
      </span>
      <span class="flex items-center gap-1.5 bg-red-900/20 px-2 py-1.5 border border-red-700/30">
        <span class="text-red-400 font-bold">QUÁI:</span>
        <span class="font-semibold text-red-300">{{ monsterDensityText }}</span>
      </span>
      <span class="flex items-center gap-1.5 bg-cultivation-celestial-900/20 px-2 py-1.5 border border-cultivation-celestial-700/30">
        <span class="text-cultivation-celestial-400 font-bold">NĂNG LƯỢNG:</span>
        <span class="font-semibold text-cultivation-celestial-300">{{ energyFluctuationText }}</span>
      </span>
      <span class="flex items-center gap-1.5 bg-cultivation-mystic-900/20 px-2 py-1.5 border border-cultivation-mystic-700/30 col-span-2 md:col-span-1">
        <span class="text-cultivation-mystic-400 font-bold">TÀI NGUYÊN:</span>
        <span class="font-semibold text-cultivation-mystic-300">{{ resourceRarityText }}</span>
      </span>
      <span
        v-if="mapStore.currentZone.weatherEffect && mapStore.currentZone.weatherEffect !== 'none'"
        class="flex items-center gap-1.5 bg-orange-900/20 px-2 py-1.5 border border-orange-700/30 col-span-2 md:col-span-2"
      >
        <span class="text-orange-400 font-bold">THỜI TIẾT:</span>
        <span class="font-semibold text-orange-300">{{ mapStore.currentZone.weatherEffect }}</span>
      </span>
    </div>

    <div class="relative z-10 border-t-2 border-cultivation-gold-700/30 pt-3">
      <h3 class="text-red-400 font-bold mb-3 uppercase tracking-widest">
        > QUÉT SINH VẬT THÙ ĐỊCH
      </h3>
      <p
        v-if="!mapStore.currentZone.monsters?.length"
        class="px-3 py-2 text-sm text-cultivation-jade-400 italic bg-cultivation-jade-900/20 border border-cultivation-jade-700/30"
      >
        [ AN TOÀN ] Không phát hiện mối đe dọa.
      </p>
      <ul
        v-else
        class="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar"
      >
        <li
          v-for="monster in mapStore.currentZone.monsters"
          :key="monster.id"
          class="p-3 bg-gradient-to-r from-gray-800/70 to-red-950/30 border-2 border-red-700/50 flex items-center justify-between hover:border-red-500/70 transition-all duration-200 group"
        >
          <div class="flex-grow pr-3 overflow-hidden">
            <div class="flex justify-between items-baseline mb-1">
              <button
                class="font-bold text-red-300 truncate group-hover:text-red-200 hover:underline text-left"
                :title="monster.name"
                @click="showMonsterInfo(monster)"
              >
                ▸ {{ monster.name }}
              </button>
              <span class="text-xs text-cultivation-gold-400 flex-shrink-0 ml-2 bg-cultivation-gold-900/30 px-2 py-0.5 border border-cultivation-gold-700/40">Lv.{{ monster.level }}</span>
            </div>
            <div class="w-full bg-gradient-to-r from-red-950/80 to-red-900/80 h-3 relative overflow-hidden border-2 border-red-700/60 shadow-inner">
              <div class="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/90 z-10 tracking-tight">
                HP: {{ monster.hp }} / {{ monster.maxHp }}
              </div>
              <div
                class="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 h-full transition-all duration-500 ease-out relative"
                :style="{ width: `${monsterHpPercent(monster)}%` }"
              />
            </div>
          </div>
          <button
            class="bg-gradient-to-br from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 px-3 py-1.5 text-red-100 flex-shrink-0 border-2 border-red-500/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs uppercase font-bold tracking-wider"
            :disabled="isLoading || playerStore.character?.inCombat"
            @click="initiateCombat(monster.id)"
          >
            [ ĐÁNH ]
          </button>
        </li>
      </ul>
    </div>
  </div>
  <div
    v-else
    class="p-4 text-center text-cultivation-gold-500 italic border-2 border-cultivation-gold-700/40 bg-gradient-to-br from-gray-900/60 to-cultivation-gold-950/20"
  >
    [ ĐANG TẢI DỮ LIỆU KHU VỰC... ]
  </div>

  <!-- Monster Info Modal -->
  <GameMonsterInfoModal
    :is-open="showMonsterModal"
    :monster="selectedMonster"
    @close="showMonsterModal = false"
    @attack="handleAttack"
    @tame="handleTame"
  />
</template>

<script setup lang="ts">
const mapStore = useMapStore()
const playerStore = usePlayerStore()
const { execute, isLoading } = useGameAction()

const showMonsterModal = ref(false)
const selectedMonster = ref(null)

// --- Hàm tiện ích hiển thị ---
function monsterHpPercent(monster: any): number {
  if (!monster || monster.maxHp <= 0) return 0
  return Math.max(0, Math.min(100, (monster.hp / monster.maxHp) * 100))
}
const monsterDensityText = computed(() => {
  const density = mapStore.currentZone?.monsterDensity
  if (density === 'none' || density === 0) return 'An toàn'
  if (density <= 3) return 'Thấp'
  if (density <= 7) return 'Trung bình'
  return 'Cao'
})

const energyFluctuationText = computed(() => {
  const fluctuation = mapStore.currentZone?.energyFluctuation || 1.0
  if (fluctuation > 1.2) return 'Rất mạnh'
  if (fluctuation > 1.0) return 'Mạnh'
  if (fluctuation < 0.8) return 'Yếu'
  return 'Bình thường'
})

const resourceRarityText = computed(() => {
  const rarity = mapStore.currentZone?.resourceRarity || 'common'
  switch (rarity) {
    case 'rare': return 'Hiếm'
    case 'uncommon': return 'Không phổ biến'
    default: return 'Phổ biến'
  }
})

// --- Hành động ---

function showMonsterInfo(monster: any) {
  selectedMonster.value = monster
  showMonsterModal.value = true
}

async function handleAttack(monster: any) {
  await initiateCombat(monster.id)
}

async function handleTame(monster: any) {
  await execute('pet/tame', { monsterId: monster.id })
}

async function initiateCombat(monsterId: string) {
  // Kiểm tra nếu người chơi đã trong combat
  if (playerStore.character?.inCombat) {
    // Có thể thêm log thông báo ở đây
    console.warn('Cannot initiate combat while already in combat.')
    return
  }
  await execute('combat/initiate', { monsterId })
}
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(251, 191, 36, 0.4) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, rgba(251, 191, 36, 0.4), rgba(217, 119, 6, 0.4));
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, rgba(251, 191, 36, 0.6), rgba(217, 119, 6, 0.6));
}
</style>
