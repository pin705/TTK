<template>
  <div class="border border-gray-600/50 rounded-lg bg-gray-900/30 backdrop-blur-sm h-full">
    <GameCombatPanel
      v-if="playerStore.character?.inCombat"
      class="p-3"
    />

    <div
      v-else
      class="flex flex-col h-full"
    >
      <div class="flex border-b border-gray-600/50">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="px-4 py-2 text-sm focus:outline-none"
          :class="activeTab === tab.id ? 'text-cyan-400 bg-gray-800/50 border-b-2 border-cyan-400' : 'text-gray-400 hover:bg-gray-700/50'"
          @click="activeTab = tab.id"
        >
          {{ tab.name }}
        </button>
      </div>

      <div class="p-3 flex-grow overflow-y-auto">
        <GameTabsZoneTab v-if="activeTab === 'zone'" />
        <GameTabsCharacterTab v-if="activeTab === 'character'" />
        <GameTabsQuestsTab v-if="activeTab === 'quests'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const playerStore = usePlayerStore()

type Tab = 'zone' | 'character' | 'quests' | 'system'
const activeTab = ref<Tab>('zone')

const tabs = [
  { id: 'zone', name: 'Khu Vực' },
  { id: 'character', name: 'Nhân Vật' },
  { id: 'quests', name: 'Nhiệm Vụ' }
  // { id: 'system', name: 'Hệ Thống' },
]
</script>
