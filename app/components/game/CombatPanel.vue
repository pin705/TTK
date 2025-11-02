<template>
  <div v-if="playerStore.character?.inCombat && monster" class="p-3 md:p-4 space-y-4 border border-red-700/50 rounded-lg bg-gradient-to-b from-gray-900/50 via-black/30 to-gray-900/50 shadow-lg relative overflow-hidden">
    <div class="absolute inset-0 bg-[url('/img/combat-bg.png')] bg-cover opacity-10 blur-sm pointer-events-none" />

    <h2 class="text-xl md:text-2xl text-red-400 font-bold text-center uppercase tracking-widest relative z-10 flex items-center justify-center gap-2 animate-softPulse">
      <Icon name="lucide:swords" class="h-5 w-5 md:h-6 md:w-6" /> Giao Chiến <Icon name="lucide:swords" class="h-5 w-5 md:h-6 md:w-6" />
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
      <div class="p-3 bg-gray-800/60 rounded border border-green-600/40 space-y-2 relative">
        <div class="absolute top-1 right-1 px-1.5 py-0.5 bg-green-700/50 text-green-200 text-[10px] rounded font-semibold uppercase">
          Bạn
        </div>
        <p class="text-base md:text-lg text-green-300 font-semibold truncate" :title="playerStore.character.name">
          {{ playerStore.character.name }}
        </p>
        <div class="w-full bg-green-900/70 rounded-full h-3 relative overflow-hidden border border-green-700/50">
          <div class="absolute inset-0 flex items-center justify-between px-2 text-[9px] font-bold text-white/80 z-10">
            <span>HP</span>
            <span>{{ playerStore.character.hp }} / {{ playerStore.character.hpMax }}</span>
          </div>
          <div class="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full transition-all duration-300 ease-in-out shadow-inner" :style="{ width: `${playerHpPercent}%` }" />
        </div>
        <div class="w-full bg-blue-900/70 rounded-full h-3 relative overflow-hidden border border-blue-700/50">
          <div class="absolute inset-0 flex items-center justify-between px-2 text-[9px] font-bold text-white/80 z-10">
            <span>Energy</span>
            <span>{{ playerStore.character.energy }} / {{ playerStore.character.energyMax }}</span>
          </div>
          <div
            class="bg-gradient-to-r from-blue-500 to-sky-400 h-full rounded-full transition-all duration-300 ease-in-out shadow-inner"
            :style="{ width: `${playerEnergyPercent}%` }"
          />
        </div>
      </div>

      <div class="p-3 bg-gray-800/60 rounded border border-red-600/40 space-y-2 relative">
        <div class="absolute top-1 right-1 px-1.5 py-0.5 bg-red-700/50 text-red-200 text-[10px] rounded font-semibold uppercase">
          Đối Thủ
        </div>
        <p
          class="text-base md:text-lg text-red-300 font-semibold truncate"
          :title="monster.name"
        >
          {{ monster.name }}
        </p>
        <p class="text-xs text-gray-400 -mt-1">
          Cấp {{ monster.level }}
        </p>
        <div class="w-full bg-red-900/70 rounded-full h-3 mt-1 relative overflow-hidden border border-red-700/50">
          <div class="absolute inset-0 flex items-center justify-between px-2 text-[9px] font-bold text-white/80 z-10">
            <span>HP</span>
            <span>{{ monster.hp }} / {{ monster.maxHp }}</span>
          </div>
          <div
            class="bg-gradient-to-r from-red-500 to-orange-400 h-full rounded-full transition-all duration-300 ease-in-out shadow-inner"
            :style="{ width: `${monsterHpPercent}%` }"
          />
        </div>
      </div>
    </div>

    <div class="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-4 pt-3 relative z-10 border-t border-gray-700/50">
      <button
        class="w-full md:w-auto bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white px-6 py-3 rounded-lg font-bold border-2 border-red-500/80 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105 transition-all min-w-[140px] group"
        :disabled="isLoading"
        @click="performAttack"
      >
        <UiLoadingSpinner v-if="isLoading" class="h-5 w-5 mr-2" />
        <Icon v-else name="lucide:sword" class="h-5 w-5 mr-2 group-hover:animate-pulse" />
        <span>Tấn Công</span>
      </button>

      <button
        class="w-full md:w-auto bg-gradient-to-b from-gray-600 to-gray-800 text-gray-400 px-6 py-3 rounded-lg font-bold border-2 border-gray-500/80 shadow-md opacity-60 cursor-not-allowed flex items-center justify-center min-w-[140px]"
        title="Tính năng đang phát triển"
      >
        <Icon name="lucide:sparkles" class="h-5 w-5 mr-2" />
        <span>Kỹ Năng</span>
      </button>

      <button
        class="w-full md:w-auto bg-gradient-to-b from-yellow-600 to-yellow-800 hover:from-yellow-500 hover:to-yellow-700 text-white px-6 py-3 rounded-lg font-bold border-2 border-yellow-500/80 shadow-lg flex items-center justify-center transform hover:scale-105 transition-all min-w-[140px] group"
        title="Bỏ chạy khỏi trận đánh"
      >
        <Icon name="lucide:shield-off" class="h-5 w-5 mr-2 group-hover:animate-bounce" />
        <span>Bỏ Chạy</span>
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
