<template>
  <div v-if="playerStore.character" class="p-3 bg-gray-900/50 rounded-lg border border-gray-700 shadow-inner space-y-3">
    <h3 class="text-purple-400 border-b border-purple-700/50 pb-1 font-semibold flex items-center">
      <Icon name="lucide:dna" class="mr-2 h-4 w-4 text-purple-500" />
      Hệ Thống Tiến Hóa
    </h3>

    <!-- Evolution Rank Progress -->
    <div class="p-3 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-lg border border-purple-700/50">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm text-gray-300">Cấp Độ Gene:</span>
        <span class="text-lg font-bold text-purple-300">{{ currentEvolutionRank }}</span>
      </div>
      
      <!-- Gene Energy Progress Bar -->
      <div class="relative">
        <div class="w-full bg-gray-800/70 rounded-full h-3 border border-gray-700 overflow-hidden">
          <div class="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white/90 z-10">
            <span>{{ geneEnergy }} / {{ nextRankEnergy }}</span>
          </div>
          <div 
            class="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
            :style="{ width: `${geneEnergyPercent}%` }"
          />
        </div>
      </div>

      <!-- Gene Integrity -->
      <div class="mt-2 flex items-center justify-between text-xs">
        <span class="text-gray-400">Độ Toàn Vẹn Gene:</span>
        <span :class="geneIntegrityColor" class="font-semibold">
          {{ geneIntegrity }}%
        </span>
      </div>
    </div>

    <!-- Energy Crystal Management -->
    <div class="p-3 bg-gray-800/60 rounded-lg border border-gray-700/80 space-y-2">
      <div class="flex items-center justify-between">
        <span class="text-sm text-cyan-300 flex items-center gap-1.5">
          <Icon name="lucide:gem" class="h-4 w-4 text-cyan-500" />
          Tinh Thể Năng Lượng:
        </span>
        <span class="text-lg font-bold text-cyan-400">{{ energyCrystals }}</span>
      </div>

      <!-- Absorb Crystals Form -->
      <div class="flex gap-2 items-center">
        <input
          v-model.number="absorbAmount"
          type="number"
          min="1"
          :max="energyCrystals"
          placeholder="Số lượng"
          class="flex-grow px-3 py-2 bg-gray-900/80 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
        <button
          :disabled="isLoading || !canAbsorb"
          class="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-md text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
          @click="absorbEnergy"
        >
          <Icon name="lucide:zap" class="h-4 w-4" />
          Hấp Thụ
        </button>
      </div>
      <p class="text-xs text-gray-500 italic">
        <Icon name="lucide:info" class="inline h-3 w-3 mr-1" />
        1 Tinh Thể = 10 Năng Lượng Gene
      </p>
    </div>

    <!-- Equipped Modules -->
    <div class="space-y-2">
      <h4 class="text-sm font-semibold text-orange-400 flex items-center gap-1.5">
        <Icon name="lucide:cpu" class="h-4 w-4" />
        Module Cơ Thể:
      </h4>
      <div class="grid grid-cols-3 gap-2">
        <ModuleSlot 
          slot-name="Tu Luyện"
          :module-id="playerStore.character.evolution?.modules?.cultivation"
          slot-type="cultivation"
        />
        <ModuleSlot 
          slot-name="Chiến Đấu"
          :module-id="playerStore.character.evolution?.modules?.combat"
          slot-type="combat"
        />
        <ModuleSlot 
          slot-name="Sinh Tồn"
          :module-id="playerStore.character.evolution?.modules?.survival"
          slot-type="survival"
        />
      </div>
    </div>

    <!-- Gene Breakthrough Button -->
    <button
      v-if="canBreakthrough"
      :disabled="isLoading"
      class="w-full py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold rounded-lg border-2 border-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg animate-pulse flex items-center justify-center gap-2"
      @click="performBreakthrough"
    >
      <Icon name="lucide:sparkles" class="h-5 w-5" />
      ĐỘT PHÁ GENE
      <Icon name="lucide:sparkles" class="h-5 w-5" />
    </button>
    <div v-else class="text-xs text-gray-500 text-center italic">
      Cần thêm năng lượng gene và vật phẩm đột phá để tiến hóa
    </div>
  </div>
</template>

<script setup lang="ts">
const playerStore = usePlayerStore()
const { execute, isLoading } = useGameAction()

const absorbAmount = ref(10)

// Computed properties
const geneEnergy = computed(() => playerStore.character?.evolution?.geneEnergy || 0)
const geneIntegrity = computed(() => playerStore.character?.evolution?.geneIntegrity || 100)
const energyCrystals = computed(() => playerStore.character?.resources?.energyCrystals || 0)
const currentEvolutionRank = computed(() => playerStore.character?.evolution?.rank || 'Học Đồ')

// Mock data - should come from config
const nextRankEnergy = computed(() => 1000) // TODO: Get from cultivation config
const geneEnergyPercent = computed(() => {
  return Math.min(100, (geneEnergy.value / nextRankEnergy.value) * 100)
})

const geneIntegrityColor = computed(() => {
  if (geneIntegrity.value >= 80) return 'text-green-400'
  if (geneIntegrity.value >= 50) return 'text-yellow-400'
  return 'text-red-400'
})

const canAbsorb = computed(() => {
  return absorbAmount.value > 0 && absorbAmount.value <= energyCrystals.value
})

const canBreakthrough = computed(() => {
  // TODO: Check if has breakthrough item and sufficient energy
  return false
})

// Actions
async function absorbEnergy() {
  if (!canAbsorb.value) return
  await execute('character/absorbEnergy', { amount: absorbAmount.value })
}

async function performBreakthrough() {
  await execute('character/geneBreakthrough')
}
</script>

<script setup lang="ts">
// Module Slot Component (inline for simplicity)
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  opacity: 1;
}
</style>
