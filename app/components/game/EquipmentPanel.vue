<template>
  <div v-if="playerStore.character" class="p-3 bg-gray-900/50 rounded-lg border border-gray-700 shadow-inner">
    <h3 class="text-purple-400 border-b border-purple-700/50 pb-1 mb-3 font-semibold flex items-center">
      <Icon name="lucide:shirt" class="mr-2 h-4 w-4 text-purple-500" />
      Trang Bị
    </h3>

    <div class="space-y-3">
      <!-- Weapon Slot -->
      <div class="p-3 bg-gray-800/60 rounded-md border border-gray-700/80">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-400 flex items-center gap-2">
            <Icon name="lucide:sword" class="h-4 w-4 text-red-400" />
            Vũ Khí
          </span>
          <button
            v-if="playerStore.character.equipment.weapon"
            class="text-xs px-2 py-1 bg-red-600/70 hover:bg-red-500/70 rounded text-white disabled:opacity-50"
            :disabled="isLoading"
            @click="unequip('weapon')"
          >
            Tháo
          </button>
        </div>
        <div v-if="playerStore.character.equipment.weapon" class="flex items-center gap-2">
          <Icon :name="getItemIcon(playerStore.character.equipment.weapon)" class="h-6 w-6 text-red-400" />
          <div class="flex-grow">
            <p class="text-sm font-medium text-white">{{ getItemName(playerStore.character.equipment.weapon) }}</p>
            <p class="text-xs text-gray-400">{{ getItemStats(playerStore.character.equipment.weapon) }}</p>
          </div>
        </div>
        <div v-else class="text-sm text-gray-500 italic text-center py-2">
          Chưa trang bị
        </div>
      </div>

      <!-- Armor Slot -->
      <div class="p-3 bg-gray-800/60 rounded-md border border-gray-700/80">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-400 flex items-center gap-2">
            <Icon name="lucide:shield" class="h-4 w-4 text-blue-400" />
            Giáp
          </span>
          <button
            v-if="playerStore.character.equipment.armor"
            class="text-xs px-2 py-1 bg-red-600/70 hover:bg-red-500/70 rounded text-white disabled:opacity-50"
            :disabled="isLoading"
            @click="unequip('armor')"
          >
            Tháo
          </button>
        </div>
        <div v-if="playerStore.character.equipment.armor" class="flex items-center gap-2">
          <Icon :name="getItemIcon(playerStore.character.equipment.armor)" class="h-6 w-6 text-blue-400" />
          <div class="flex-grow">
            <p class="text-sm font-medium text-white">{{ getItemName(playerStore.character.equipment.armor) }}</p>
            <p class="text-xs text-gray-400">{{ getItemStats(playerStore.character.equipment.armor) }}</p>
          </div>
        </div>
        <div v-else class="text-sm text-gray-500 italic text-center py-2">
          Chưa trang bị
        </div>
      </div>

      <!-- Accessory Slot -->
      <div class="p-3 bg-gray-800/60 rounded-md border border-gray-700/80">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-400 flex items-center gap-2">
            <Icon name="lucide:gem" class="h-4 w-4 text-purple-400" />
            Phụ Kiện
          </span>
          <button
            v-if="playerStore.character.equipment.accessory"
            class="text-xs px-2 py-1 bg-red-600/70 hover:bg-red-500/70 rounded text-white disabled:opacity-50"
            :disabled="isLoading"
            @click="unequip('accessory')"
          >
            Tháo
          </button>
        </div>
        <div v-if="playerStore.character.equipment.accessory" class="flex items-center gap-2">
          <Icon :name="getItemIcon(playerStore.character.equipment.accessory)" class="h-6 w-6 text-purple-400" />
          <div class="flex-grow">
            <p class="text-sm font-medium text-white">{{ getItemName(playerStore.character.equipment.accessory) }}</p>
            <p class="text-xs text-gray-400">{{ getItemStats(playerStore.character.equipment.accessory) }}</p>
          </div>
        </div>
        <div v-else class="text-sm text-gray-500 italic text-center py-2">
          Chưa trang bị
        </div>
      </div>
    </div>

    <!-- Equippable Items in Inventory -->
    <div v-if="equippableItems.length > 0" class="mt-4 pt-4 border-t border-gray-700">
      <p class="text-xs text-gray-400 font-semibold mb-2">Trang Bị Trong Túi:</p>
      <div class="space-y-1 max-h-40 overflow-y-auto">
        <div
          v-for="item in equippableItems"
          :key="item.itemId"
          class="flex items-center justify-between p-2 bg-gray-800/40 rounded hover:bg-gray-700/40 transition-colors"
        >
          <div class="flex items-center gap-2 flex-grow">
            <Icon :name="getItemIcon(item.itemId)" class="h-4 w-4" :class="getRarityColor(item.itemId)" />
            <span class="text-xs text-gray-300 truncate">{{ getItemName(item.itemId) }}</span>
          </div>
          <button
            class="text-xs px-2 py-1 bg-green-600/70 hover:bg-green-500/70 rounded text-white disabled:opacity-50 flex-shrink-0"
            :disabled="isLoading"
            @click="equipItem(item.itemId)"
          >
            Trang Bị
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { items, type ItemId } from '~~/shared/config'

const playerStore = usePlayerStore()
const { execute, isLoading } = useGameAction()

// Get equippable items from inventory
const equippableItems = computed(() => {
  if (!playerStore.character?.inventory) return []
  
  return playerStore.character.inventory.filter(item => {
    const itemData = items[item.itemId as ItemId]
    return itemData && (
      itemData.type === 'weapon' || 
      itemData.type === 'armor' || 
      itemData.type === 'accessory' ||
      itemData.type === 'spirit_weapon'
    )
  })
})

function getItemName(itemId: string): string {
  const item = items[itemId as ItemId]
  return item?.name || itemId
}

function getItemIcon(itemId: string): string {
  const item = items[itemId as ItemId]
  switch (item?.type) {
    case 'weapon':
    case 'spirit_weapon': 
      return 'lucide:sword'
    case 'armor': 
      return 'lucide:shield'
    case 'accessory': 
      return 'lucide:gem'
    default: 
      return 'lucide:box'
  }
}

function getItemStats(itemId: string): string {
  const item = items[itemId as ItemId]
  if (!item?.stats) return ''
  
  const statStrings: string[] = []
  if (item.stats.attack) statStrings.push(`+${item.stats.attack} Tấn Công`)
  if (item.stats.defense) statStrings.push(`+${item.stats.defense} Phòng Thủ`)
  if (item.stats.spirit) statStrings.push(`+${item.stats.spirit} Tinh Thần`)
  if (item.stats.speed) statStrings.push(`+${item.stats.speed} Tốc Độ`)
  if (item.stats.hpMax) statStrings.push(`+${item.stats.hpMax} HP`)
  
  return statStrings.join(', ')
}

function getRarityColor(itemId: string): string {
  const item = items[itemId as ItemId]
  switch (item?.rarity) {
    case 'common': return 'text-gray-400'
    case 'uncommon': return 'text-green-400'
    case 'rare': return 'text-blue-400'
    case 'epic': return 'text-purple-400'
    case 'legendary': return 'text-yellow-400'
    default: return 'text-gray-400'
  }
}

async function equipItem(itemId: string) {
  await execute('equipment/equip', { itemId })
}

async function unequip(slot: string) {
  await execute('equipment/unequip', { slot })
}
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: rgba(17, 24, 39, 0.5);
  border-radius: 2px;
}
::-webkit-scrollbar-thumb {
  background: rgba(55, 65, 81, 0.7);
  border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 0.9);
}
</style>
