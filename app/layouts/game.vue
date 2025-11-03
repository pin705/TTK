<template>
  <div class="bg-gradient-to-br from-gray-950 via-cultivation-gold-950/10 to-gray-950 text-cultivation-gold-100 min-h-screen flex flex-col relative overflow-hidden">
    <!-- Background pattern -->
    <div class="fixed inset-0 bg-cultivation-pattern opacity-20 pointer-events-none"></div>
    <div class="fixed inset-0 bg-dragon-scale opacity-10 pointer-events-none"></div>
    
    <!-- Top Navigation Bar -->
    <div class="relative z-20 bg-gradient-to-r from-gray-900/95 via-cultivation-gold-900/20 to-gray-900/95 border-b-2 border-cultivation-gold-600/40 px-4 py-3 flex items-center justify-between flex-shrink-0 shadow-2xl backdrop-blur-sm">
      <!-- Decorative top border -->
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cultivation-gold-500/50 to-transparent"></div>
      
      <div class="flex items-center gap-3">
        <div class="text-cultivation-gold-400 text-xl font-bold">
          ✦
        </div>
        <h1 class="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cultivation-gold-400 via-cultivation-gold-300 to-cultivation-jade-400 uppercase tracking-wider drop-shadow-lg">
          TINH KHÔNG ĐẠO LỘ
        </h1>
      </div>
      
      <!-- Quick Stats -->
      <div v-if="playerStore.character" class="flex items-center gap-2 md:gap-3 text-xs md:text-sm font-mono">
        <div class="flex items-center gap-1.5 px-2 md:px-3 py-1.5 bg-gradient-to-br from-red-900/40 to-red-950/60 border border-red-600/50 backdrop-blur-sm shadow-lg">
          <span class="text-red-400 font-bold">HP:</span>
          <span class="text-red-200 font-semibold">{{ playerStore.character.hp }}/{{ playerStore.character.hpMax }}</span>
        </div>
        <div class="flex items-center gap-1.5 px-2 md:px-3 py-1.5 bg-gradient-to-br from-cultivation-celestial-900/40 to-cultivation-celestial-950/60 border border-cultivation-celestial-600/50 backdrop-blur-sm shadow-lg">
          <span class="text-cultivation-celestial-400 font-bold">NL:</span>
          <span class="text-cultivation-celestial-200 font-semibold">{{ playerStore.character.energy }}/{{ playerStore.character.energyMax }}</span>
        </div>
        <div class="hidden md:flex items-center gap-1.5 px-2 md:px-3 py-1.5 bg-gradient-to-br from-cultivation-gold-900/40 to-cultivation-gold-950/60 border border-cultivation-gold-600/50 backdrop-blur-sm shadow-lg">
          <span class="text-cultivation-gold-400 font-bold">TC:</span>
          <span class="text-cultivation-gold-200 font-semibold">{{ playerStore.character.resources?.energyCrystals || 0 }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2 text-xs font-mono">
        <button 
          class="px-3 py-1.5 hover:bg-cultivation-gold-800/30 transition-all border border-cultivation-gold-600/30 hover:border-cultivation-gold-500/50 text-cultivation-gold-400 hover:text-cultivation-gold-300 uppercase tracking-wider"
          @click="showSettings = true"
        >
          [ CÀI ĐẶT ]
        </button>
        <button 
          class="px-3 py-1.5 hover:bg-red-800/30 transition-all border border-red-600/30 hover:border-red-500/50 text-red-400 hover:text-red-300 uppercase tracking-wider"
          @click="handleLogout"
        >
          [ THOÁT ]
        </button>
      </div>
    </div>

    <!-- Settings Modal -->
    <GameSettingsModal :is-open="showSettings" @close="showSettings = false" />

    <!-- Tutorial Hint Component -->
    <GameTutorialHint />

    <!-- Main Game Area -->
    <div class="flex-grow overflow-hidden relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 h-full p-3 md:p-4 lg:p-6 overflow-hidden">
        <!-- Left Panel - Character Status -->
        <div class="col-span-1 lg:col-span-3 space-y-3 md:space-y-4 overflow-y-auto custom-scrollbar">
          <GameHeaderStatus class="border-2 border-cultivation-gold-600/40 p-3 md:p-4 rounded-xl bg-gradient-to-br from-gray-900/80 via-gray-900/70 to-cultivation-gold-900/30 backdrop-blur-md shadow-2xl relative overflow-hidden" />
        </div>

        <!-- Center Panel - Main Game View -->
        <div class="col-span-1 lg:col-span-6 overflow-hidden">
          <GameMainPanel />
        </div>

        <!-- Right Panel - Game Log & Commands -->
        <div class="col-span-1 lg:col-span-3 flex flex-col overflow-hidden">
          <GameLog class="border-2 border-cultivation-gold-700/30 p-3 rounded-xl flex-grow bg-gradient-to-br from-gray-900/70 via-gray-900/60 to-gray-800/70 backdrop-blur-md shadow-2xl overflow-hidden" />
        </div>
      </div>
    </div>
  </div>
</template>

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

<script setup lang="ts">
const playerStore = usePlayerStore()
const showSettings = ref(false)

async function handleLogout() {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await navigateTo('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>
