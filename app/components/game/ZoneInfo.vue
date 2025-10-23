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
    class="p-3 md:p-4 space-y-4 text-sm border border-cyan-700/50 rounded-lg bg-gradient-to-b from-gray-900/50 via-black/30 to-gray-900/50 shadow-lg relative overflow-hidden backdrop-blur-sm"
  >
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent opacity-30 pointer-events-none" />

    <div class="relative z-10">
      <h2 class="text-lg md:text-xl text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-2 border-b border-cyan-700/30 pb-1 mb-2">
        <Icon
          name="lucide:map-pin"
          class="h-5 w-5"
        /> {{ mapStore.currentZone.name }}
      </h2>
      <p class="text-gray-300 italic leading-relaxed text-xs md:text-sm">
        {{ mapStore.currentZone.description }}
      </p>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-1 text-xs text-gray-400 relative z-10 border-t border-cyan-700/30 pt-2">
      <span
        class="flex items-center"
        title="Cấp độ đề nghị"
      >
        <Icon
          name="lucide:bar-chart"
          class="mr-1.5 h-3.5 w-3.5 text-yellow-500"
        />
        Lv. {{ mapStore.currentZone.recommendedLevel || '??' }}
      </span>
      <span
        class="flex items-center"
        title="Mật độ sinh vật"
      >
        <Icon
          name="lucide:bug"
          class="mr-1.5 h-3.5 w-3.5 text-red-500"
        />
        {{ monsterDensityText }}
      </span>
      <span
        class="flex items-center"
        title="Linh khí"
      >
        <Icon
          name="lucide:wind"
          class="mr-1.5 h-3.5 w-3.5 text-blue-500"
        />
        {{ energyFluctuationText }}
      </span>
      <span
        class="flex items-center col-span-2 md:col-span-1"
        title="Tài nguyên"
      >
        <Icon
          name="lucide:gem"
          class="mr-1.5 h-3.5 w-3.5 text-purple-500"
        />
        {{ resourceRarityText }}
      </span>
      <span
        v-if="mapStore.currentZone.weatherEffect && mapStore.currentZone.weatherEffect !== 'none'"
        class="flex items-center text-orange-400 col-span-2 md:col-span-2 animate-pulse"
        title="Hiệu ứng môi trường"
      >
        <Icon
          name="lucide:cloud-lightning"
          class="mr-1.5 h-3.5 w-3.5"
        />
        {{ mapStore.currentZone.weatherEffect }} </span>
    </div>

    <div class="relative z-10 border-t border-cyan-700/30 pt-3">
      <h3 class="text-red-400 font-semibold mb-2 flex items-center gap-1.5">
        <Icon
          name="lucide:radar"
          class="h-4 w-4 animate-spin"
          style="animation-duration: 3s;"
        /> [ Quét Sinh Vật Thù Địch ]
      </h3>
      <p
        v-if="!mapStore.currentZone.monsters?.length"
        class="pl-2 text-sm text-gray-500 italic"
      >
        <Icon
          name="lucide:shield-check"
          class="inline-block mr-1 h-4 w-4 text-green-600"
        /> Tín hiệu an toàn. Không phát hiện mối đe dọa.
      </p>
      <ul
        v-else
        class="space-y-2 max-h-[300px] overflow-y-auto pr-1 grid grid-cols-3 gap-2"
      >
        <li
          v-for="monster in mapStore.currentZone.monsters"
          :key="monster.id"
          class="p-2 bg-gray-800/60 rounded border border-gray-700/80 flex items-center justify-between hover:border-red-600/70 transition-colors duration-200 group"
        >
          <div class="flex-grow pr-3 overflow-hidden">
            <div class="flex justify-between items-baseline">
              <span
                class="font-medium text-red-400 truncate group-hover:text-red-300"
                :title="monster.name"
              >
                <Icon
                  name="lucide:skull"
                  class="inline-block mr-1 h-3.5 w-3.5 text-red-600 -mt-px"
                />{{ monster.name }}
              </span>
              <span class="text-xs text-gray-400 flex-shrink-0 ml-2">Lv.{{ monster.level }}</span>
            </div>
            <div class="w-full bg-gradient-to-r from-red-900/80 to-red-800/50 rounded-full h-2.5 mt-1 relative overflow-hidden border border-red-700/50 shadow-inner">
              <div class="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white/90 z-10 tracking-tighter">
                {{ monster.hp }} / {{ monster.maxHp }}
              </div>
              <div
                class="bg-gradient-to-r from-red-600 to-orange-500 h-full rounded-full transition-all duration-300 ease-in-out"
                :style="{ width: `${monsterHpPercent(monster)}%` }"
              />
            </div>
          </div>
          <button
            class="bg-red-700/50 hover:bg-red-600/60 p-1.5 rounded text-xs text-red-100 flex-shrink-0 border border-red-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoading || playerStore.character?.inCombat"
            title="Tấn công"
            @click="initiateCombat(monster.id)"
          >
            <Icon
              name="lucide:sword"
              class="h-4 w-4"
            />
          </button>
        </li>
      </ul>
    </div>
  </div>
  <div
    v-else
    class="p-4 text-center text-gray-500 italic border border-gray-700/50 rounded-lg bg-gray-900/30"
  >
    <UiLoadingSpinner class="h-5 w-5 inline mr-2" /> Đang tải dữ liệu khu vực...
  </div>
</template>

<script setup lang="ts">
const mapStore = useMapStore()
const playerStore = usePlayerStore()
const { execute, isLoading } = useGameAction()

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
/* Thêm hiệu ứng cho viền khi hover quái vật */
li:hover {
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.4); /* Màu đỏ red-500 */
}
/* Style cho scrollbar (Webkit) */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: rgba(17, 24, 39, 0.5); /* gray-900/50 */
  border-radius: 2px;
}
::-webkit-scrollbar-thumb {
  background: rgba(55, 65, 81, 0.7); /* gray-700/70 */
  border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover {
   background: rgba(75, 85, 99, 0.9); /* gray-600/90 */
}
</style>
