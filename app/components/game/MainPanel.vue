<template>
  <div class="border-2 border-gray-600/50 rounded-lg bg-gradient-to-br from-gray-900/60 via-black/40 to-gray-900/60 backdrop-blur-sm h-full shadow-2xl overflow-hidden">
    <GameCombatPanel
      v-if="playerStore.character?.inCombat"
      class="p-3 h-full"
    />

    <div
      v-else
      class="flex flex-col h-full"
    >
      <!-- Enhanced Tab Bar -->
      <div class="flex border-b border-gray-600/50 bg-gray-900/50 backdrop-blur-sm">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="px-4 py-3 text-sm font-medium focus:outline-none transition-all duration-200 flex items-center gap-2 relative"
          :class="activeTab === tab.id 
            ? 'text-cyan-300 bg-gray-800/70 border-b-2 border-cyan-400 shadow-lg' 
            : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-300'"
          @click="activeTab = tab.id"
        >
          <Icon :name="tab.icon" class="h-4 w-4" />
          <span>{{ tab.name }}</span>
          <!-- Active Indicator Glow -->
          <div 
            v-if="activeTab === tab.id"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          ></div>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="p-4 flex-grow overflow-y-auto custom-scrollbar">
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
  scrollbar-color: rgba(34, 211, 238, 0.3) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(34, 211, 238, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(34, 211, 238, 0.5);
}
</style>
