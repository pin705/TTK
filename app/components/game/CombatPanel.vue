<template>
  <div v-if="playerStore.character?.inCombat && monster" class="p-3 md:p-4 space-y-4 border-2 border-red-600/60 rounded-xl bg-gradient-to-b from-red-950/40 via-gray-900/50 to-red-950/40 shadow-2xl relative overflow-hidden">
    <!-- Animated background effects -->
    <div class="absolute inset-0 bg-[url('/img/combat-bg.png')] bg-cover opacity-5 blur-sm pointer-events-none" />
    <div class="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-orange-900/20 animate-pulse pointer-events-none" style="animation-duration: 3s;"></div>
    <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
    <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
    
    <!-- Combat decorative corners -->
    <div class="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-red-500/50"></div>
    <div class="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-red-500/50"></div>
    <div class="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-red-500/50"></div>
    <div class="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-red-500/50"></div>

    <h2 class="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-red-400 font-bold text-center uppercase tracking-widest relative z-10 flex items-center justify-center gap-3 animate-pulse drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
      <Icon name="lucide:swords" class="h-5 w-5 md:h-6 md:w-6 text-red-400 animate-pulse" /> Giao Chiến <Icon name="lucide:swords" class="h-5 w-5 md:h-6 md:w-6 text-red-400 animate-pulse" />
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
      <!-- Player Stats -->
      <div class="p-4 bg-gradient-to-br from-cultivation-jade-900/40 via-gray-800/60 to-cultivation-jade-900/30 rounded-lg border-2 border-cultivation-jade-600/50 space-y-3 relative backdrop-blur-sm shadow-xl">
        <div class="absolute -top-1 -right-1 px-2 py-1 bg-gradient-to-r from-cultivation-jade-600 to-cultivation-jade-700 text-white text-[10px] rounded-md font-bold uppercase shadow-lg border border-cultivation-jade-400/50">
          <Icon name="lucide:user" class="h-2.5 w-2.5 inline mr-1" /> Bạn
        </div>
        <div class="flex items-center gap-2">
          <div class="h-10 w-10 rounded-full bg-gradient-to-br from-cultivation-jade-500 to-cultivation-jade-700 flex items-center justify-center shadow-lg">
            <Icon name="lucide:user" class="h-5 w-5 text-white" />
          </div>
          <div class="flex-1">
            <p class="text-base md:text-lg text-cultivation-jade-200 font-bold truncate drop-shadow-lg" :title="playerStore.character.name">
              {{ playerStore.character.name }}
            </p>
            <p class="text-xs text-cultivation-jade-400">Lv.{{ playerStore.character.level }}</p>
          </div>
        </div>
        <div class="w-full bg-gradient-to-r from-red-950/80 to-red-900/80 rounded-lg h-4 relative overflow-hidden border-2 border-red-600/60 shadow-inner">
          <div class="absolute inset-0 flex items-center justify-between px-2 text-[10px] font-bold text-white/90 z-10">
            <span>HP</span>
            <span>{{ playerStore.character.hp }} / {{ playerStore.character.hpMax }}</span>
          </div>
          <div class="bg-gradient-to-r from-red-500 via-red-600 to-orange-500 h-full transition-all duration-500 ease-in-out shadow-lg" :style="{ width: `${playerHpPercent}%` }" />
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
        <div class="w-full bg-gradient-to-r from-cultivation-celestial-950/80 to-cultivation-celestial-900/80 rounded-lg h-4 relative overflow-hidden border-2 border-cultivation-celestial-600/60 shadow-inner">
          <div class="absolute inset-0 flex items-center justify-between px-2 text-[10px] font-bold text-white/90 z-10">
            <span>Energy</span>
            <span>{{ playerStore.character.energy }} / {{ playerStore.character.energyMax }}</span>
          </div>
          <div
            class="bg-gradient-to-r from-cultivation-celestial-500 via-cultivation-celestial-600 to-sky-500 h-full transition-all duration-500 ease-in-out shadow-lg"
            :style="{ width: `${playerEnergyPercent}%` }"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
      </div>

      <!-- Monster Stats -->
      <div class="p-4 bg-gradient-to-br from-red-900/40 via-gray-800/60 to-orange-900/30 rounded-lg border-2 border-red-600/50 space-y-3 relative backdrop-blur-sm shadow-xl">
        <div class="absolute -top-1 -right-1 px-2 py-1 bg-gradient-to-r from-red-600 to-orange-600 text-white text-[10px] rounded-md font-bold uppercase shadow-lg border border-red-400/50 animate-pulse">
          <Icon name="lucide:skull" class="h-2.5 w-2.5 inline mr-1" /> Đối Thủ
        </div>
        <div class="flex items-center gap-2">
          <div class="h-10 w-10 rounded-full bg-gradient-to-br from-red-600 to-orange-700 flex items-center justify-center shadow-lg animate-pulse">
            <Icon name="lucide:flame" class="h-5 w-5 text-white" />
          </div>
          <div class="flex-1">
            <p
              class="text-base md:text-lg text-red-200 font-bold truncate drop-shadow-lg"
              :title="monster.name"
            >
              {{ monster.name }}
            </p>
            <p class="text-xs text-orange-400 font-semibold">
              Cấp {{ monster.level }}
            </p>
          </div>
        </div>
        <div class="w-full bg-gradient-to-r from-red-950/80 to-red-900/80 rounded-lg h-4 relative overflow-hidden border-2 border-red-600/60 shadow-inner">
          <div class="absolute inset-0 flex items-center justify-between px-2 text-[10px] font-bold text-white/90 z-10">
            <span>HP</span>
            <span>{{ monster.hp }} / {{ monster.maxHp }}</span>
          </div>
          <div
            class="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 h-full transition-all duration-500 ease-in-out shadow-lg"
            :style="{ width: `${monsterHpPercent}%` }"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
      </div>
    </div>

    <div class="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-4 pt-4 relative z-10 border-t-2 border-cultivation-gold-700/30">
      <!-- Decorative divider -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-cultivation-gold-500/50 to-transparent"></div>
      
      <button
        class="w-full md:w-auto bg-gradient-to-br from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:via-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg font-bold border-2 border-red-500/80 shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105 active:scale-95 transition-all min-w-[140px] group relative overflow-hidden uppercase tracking-wide"
        :disabled="isLoading"
        @click="performAttack"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer"></div>
        <UiLoadingSpinner v-if="isLoading" class="h-5 w-5 mr-2 relative z-10" />
        <Icon v-else name="lucide:sword" class="h-5 w-5 mr-2 group-hover:animate-pulse relative z-10" />
        <span class="relative z-10">Tấn Công</span>
      </button>

      <button
        class="w-full md:w-auto bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-gray-400 px-6 py-3 rounded-lg font-bold border-2 border-gray-600/80 shadow-lg opacity-60 cursor-not-allowed flex items-center justify-center min-w-[140px] uppercase tracking-wide"
        title="Tính năng đang phát triển"
      >
        <Icon name="lucide:sparkles" class="h-5 w-5 mr-2" />
        <span>Kỹ Năng</span>
      </button>

      <button
        class="w-full md:w-auto bg-gradient-to-br from-cultivation-gold-600 via-cultivation-gold-700 to-yellow-800 hover:from-cultivation-gold-500 hover:via-cultivation-gold-600 hover:to-yellow-700 text-white px-6 py-3 rounded-lg font-bold border-2 border-cultivation-gold-500/80 shadow-2xl flex items-center justify-center transform hover:scale-105 active:scale-95 transition-all min-w-[140px] group relative overflow-hidden uppercase tracking-wide"
        title="Bỏ chạy khỏi trận đánh"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer"></div>
        <Icon name="lucide:shield-off" class="h-5 w-5 mr-2 group-hover:animate-bounce relative z-10" />
        <span class="relative z-10">Bỏ Chạy</span>
      </button>
    </div>
  </div>

  <div v-else-if="playerStore.character?.inCombat" class="p-4 text-center text-gray-500 italic border border-gray-700/50 rounded-lg bg-gray-900/30">
    <UiLoadingSpinner class="h-5 w-5 inline mr-2"/> Đang thiết lập liên kết chiến đấu...
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '~/stores/player' // Sửa đường dẫn nếu cần
import { useMapStore } from '~/stores/map' // Sửa đường dẫn nếu cần
import { useGameAction } from '~/composables/useGameAction' // Sửa đường dẫn nếu cần
import { Icon } from '#components' // Sử dụng Icon của Nuxt UI (hoặc thư viện icon bạn dùng)
import UiLoadingSpinner from '~/components/ui/LoadingSpinner.vue'; // Import spinner

const playerStore = usePlayerStore()
const mapStore = useMapStore()
const { execute, isLoading } = useGameAction()

// Lấy thông tin quái vật đang chiến đấu từ mapStore (đã được cập nhật bởi action)
const monster = computed(() => {
  if (!playerStore.character?.inCombat || !playerStore.character.combat?.monsterId) return null
  return mapStore.currentZone?.monsters?.find(m => m.id === playerStore.character?.combat?.monsterId)
})

// Tính % HP (có chống lỗi chia cho 0 và giới hạn 0-100)
const calculateHpPercent = (current: number | undefined, max: number | undefined): number => {
  if (current === undefined || max === undefined || max <= 0) return 0
  return Math.max(0, Math.min(100, (current / max) * 100))
}

const playerHpPercent = computed(() => calculateHpPercent(playerStore.character?.hp, playerStore.character?.hpMax))
const playerEnergyPercent = computed(() => calculateHpPercent(playerStore.character?.energy, playerStore.character?.energyMax))
const monsterHpPercent = computed(() => calculateHpPercent(monster.value?.hp, monster.value?.maxHp))

async function performAttack() {
  await execute('combat/attack')
}

// TODO: Thêm hàm xử lý bỏ chạy
</script>

<style scoped>
/* Thêm một chút hiệu ứng để tăng cảm giác "vũ trụ" */
.animate-softPulse {
  animation: softPulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes softPulse {
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.02); }
}
/* Style cho thanh HP đẹp hơn */
.h-1\.5 { height: 0.375rem; /* 6px */ }
.h-3 { height: 0.75rem; /* 12px */ }
</style>
