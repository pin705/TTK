<template>
  <div class="border-2 border-cultivation-gold-600/40 rounded-xl bg-gradient-to-br from-gray-900/80 via-gray-900/70 to-cultivation-gold-900/30 backdrop-blur-md h-full shadow-2xl overflow-hidden relative">
    <!-- Decorative corner elements -->
    <div class="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cultivation-gold-500/40 rounded-tl-xl"></div>
    <div class="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cultivation-gold-500/40 rounded-tr-xl"></div>
    <div class="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cultivation-gold-500/40 rounded-bl-xl"></div>
    <div class="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cultivation-gold-500/40 rounded-br-xl"></div>
    
    <GameCombatPanel
      v-if="playerStore.character?.inCombat"
      class="p-3 md:p-4 h-full"
    />

    <div
      v-else
      class="flex flex-col h-full relative z-10"
    >
      <!-- Enhanced Tab Bar -->
      <div class="flex border-b-2 border-cultivation-gold-700/30 bg-gradient-to-r from-gray-900/60 via-cultivation-gold-900/20 to-gray-900/60 backdrop-blur-sm relative">
        <!-- Decorative top line -->
        <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cultivation-gold-500/30 to-transparent"></div>
        
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="flex-1 px-3 md:px-4 py-3 text-xs md:text-sm font-semibold focus:outline-none transition-all duration-300 flex items-center justify-center gap-2 relative group uppercase tracking-wider"
          :class="activeTab === tab.id 
            ? 'text-cultivation-gold-300 bg-gradient-to-b from-cultivation-gold-900/40 to-cultivation-gold-900/20 border-b-3 border-cultivation-gold-500 shadow-lg' 
            : 'text-cultivation-gold-600 hover:bg-cultivation-gold-900/20 hover:text-cultivation-gold-400'"
          @click="activeTab = tab.id"
        >
          <Icon :name="tab.icon" class="h-4 w-4 transition-transform group-hover:scale-110" :class="activeTab === tab.id ? 'animate-pulse' : ''" />
          <span class="hidden sm:inline">{{ tab.name }}</span>
          <!-- Active Indicator Glow -->
          <div 
            v-if="activeTab === tab.id"
            class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cultivation-gold-400 to-transparent animate-pulse"
          ></div>
          <div 
            v-if="activeTab === tab.id"
            class="absolute inset-0 bg-gradient-to-b from-cultivation-gold-500/10 to-transparent pointer-events-none rounded-t-lg"
          ></div>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="p-3 md:p-4 flex-grow overflow-y-auto custom-scrollbar">
        <GameTabsZoneTab v-if="activeTab === 'zone'" />
        <GameTabsCharacterTab v-if="activeTab === 'character'" />
        <GameTabsQuestsTab v-if="activeTab === 'quests'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const playerStore = usePlayerStore()

type Tab = 'zone' | 'character' | 'quests'
const activeTab = ref<Tab>('zone')

const tabs = [
  { id: 'zone', name: 'Khu Vực', icon: 'lucide:map' },
  { id: 'character', name: 'Nhân Vật', icon: 'lucide:user' },
  { id: 'quests', name: 'Nhiệm Vụ', icon: 'lucide:scroll-text' }
]
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
