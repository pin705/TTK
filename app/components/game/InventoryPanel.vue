<template>
  <div v-if="playerStore.character" class="space-y-3">
    <!-- Equipment Section -->
    <div class="p-3 bg-gray-900/50 rounded-lg border border-gray-700 shadow-inner">
      <h3 class="text-purple-400 border-b border-purple-700/50 pb-1 mb-3 font-semibold flex items-center">
        <Icon name="lucide:shield" class="mr-2 h-4 w-4 text-purple-500" />
        Trang Bị
      </h3>

      <div class="grid grid-cols-2 gap-2">
        <!-- Weapon Slot -->
        <div class="p-2 bg-gray-800/60 rounded-md border border-gray-700/80">
          <p class="text-xs text-gray-400 mb-1">Vũ Khí</p>
          <div v-if="playerStore.character.equipment.weapon" class="flex items-center gap-2">
            <Icon name="lucide:sword" class="h-5 w-5 text-red-400" />
            <div class="flex-1 min-w-0">
              <p class="text-sm text-red-300 truncate">{{ getItemName(playerStore.character.equipment.weapon) }}</p>
              <button @click="unequip('weapon')" class="text-xs text-gray-500 hover:text-red-400">Gỡ</button>
            </div>
          </div>
          <p v-else class="text-xs text-gray-600 italic">Trống</p>
        </div>

        <!-- Armor Slot -->
        <div class="p-2 bg-gray-800/60 rounded-md border border-gray-700/80">
          <p class="text-xs text-gray-400 mb-1">Giáp</p>
          <div v-if="playerStore.character.equipment.armor" class="flex items-center gap-2">
            <Icon name="lucide:shield" class="h-5 w-5 text-blue-400" />
            <div class="flex-1 min-w-0">
              <p class="text-sm text-blue-300 truncate">{{ getItemName(playerStore.character.equipment.armor) }}</p>
              <button @click="unequip('armor')" class="text-xs text-gray-500 hover:text-red-400">Gỡ</button>
            </div>
          </div>
          <p v-else class="text-xs text-gray-600 italic">Trống</p>
        </div>

        <!-- Accessory Slot -->
        <div class="p-2 bg-gray-800/60 rounded-md border border-gray-700/80 col-span-2">
          <p class="text-xs text-gray-400 mb-1">Phụ Kiện</p>
          <div v-if="playerStore.character.equipment.accessory" class="flex items-center gap-2">
            <Icon name="lucide:gem" class="h-5 w-5 text-cyan-400" />
            <div class="flex-1 min-w-0">
              <p class="text-sm text-cyan-300 truncate">{{ getItemName(playerStore.character.equipment.accessory) }}</p>
              <button @click="unequip('accessory')" class="text-xs text-gray-500 hover:text-red-400">Gỡ</button>
            </div>
          </div>
          <p v-else class="text-xs text-gray-600 italic">Trống</p>
        </div>
      </div>
    </div>

    <!-- Inventory Section -->
    <div class="p-3 bg-gray-900/50 rounded-lg border border-gray-700 shadow-inner">
      <h3 class="text-blue-400 border-b border-blue-700/50 pb-1 mb-3 font-semibold flex items-center justify-between">
        <span class="flex items-center">
          <Icon name="lucide:package" class="mr-2 h-4 w-4 text-blue-500" />
          Túi Đồ
        </span>
        <span class="text-xs text-gray-400">
          {{ playerStore.character.inventory.length }} / 100
        </span>
      </h3>

    <!-- Empty State -->
    <div v-if="!playerStore.character.inventory.length" class="text-center py-8 text-gray-500 italic">
      <Icon name="lucide:inbox" class="h-12 w-12 mx-auto mb-2 opacity-50" />
      <p class="text-sm">Túi đồ trống</p>
      <p class="text-xs mt-1">Chiến đấu với quái vật hoặc thu thập tài nguyên để nhận vật phẩm</p>
    </div>

    <!-- Item Grid -->
    <div v-else class="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-1">
      <div
        v-for="item in inventoryItems"
        :key="item.itemId"
        class="p-2 bg-gray-800/60 rounded-md border border-gray-700/80 hover:border-cyan-600/70 transition-all duration-200 cursor-pointer group relative"
        :title="item.description"
      >
        <!-- Item Icon/Badge -->
        <div class="flex items-start gap-2">
          <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-md flex items-center justify-center border border-gray-600">
            <Icon :name="getItemIcon(item.itemId)" class="h-6 w-6" :class="getItemColor(item.itemId)" />
          </div>

          <!-- Item Info -->
          <div class="flex-grow min-w-0">
            <p class="text-sm font-medium truncate group-hover:text-cyan-300 transition-colors" :class="getItemColor(item.itemId)">
              {{ getItemName(item.itemId) }}
            </p>
            <p class="text-xs text-gray-400">x{{ item.quantity }}</p>
            <p v-if="getItemType(item.itemId)" class="text-[10px] text-gray-500 uppercase">
              {{ getItemType(item.itemId) }}
            </p>
          </div>
        </div>

        <!-- Quick Actions (on hover) -->
        <div class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <button
            v-if="isEquipableItem(item.itemId)"
            class="p-1 bg-purple-600/80 hover:bg-purple-500 rounded text-white"
            title="Trang bị"
            @click="equipItem(item.itemId)"
          >
            <Icon name="lucide:shield" class="h-3 w-3" />
          </button>
          <button
            v-if="isUsableItem(item.itemId)"
            class="p-1 bg-green-600/80 hover:bg-green-500 rounded text-white"
            title="Sử dụng"
            @click="useItem(item.itemId)"
          >
            <Icon name="lucide:play" class="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>

    <!-- Resources Summary -->
    <div v-if="resourceSummary.length > 0" class="mt-3 pt-3 border-t border-gray-700 space-y-1">
      <p class="text-xs text-gray-400 font-semibold mb-2">Tài Nguyên Quan Trọng:</p>
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div v-for="resource in resourceSummary" :key="resource.itemId" class="flex items-center gap-1.5 p-1.5 bg-gray-800/40 rounded">
          <Icon :name="getItemIcon(resource.itemId)" class="h-4 w-4" :class="getItemColor(resource.itemId)" />
          <span class="text-gray-300">{{ resource.name }}:</span>
          <span class="font-semibold text-white">{{ resource.quantity }}</span>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { items, type ItemId } from '~~/shared/config'

const playerStore = usePlayerStore()
const { execute, isLoading } = useGameAction()

const inventoryItems = computed(() => {
  return playerStore.character?.inventory || []
})

// Resources to highlight (crystals, solutions, etc.)
const resourceSummary = computed(() => {
  const important = ['energy_crystal', 'gene_solution_basic', 'gene_solution_advanced', 'cosmic_herb_low']
  return inventoryItems.value
    .filter(item => important.includes(item.itemId))
    .map(item => ({
      itemId: item.itemId,
      name: getItemName(item.itemId),
      quantity: item.quantity
    }))
})

function getItemName(itemId: string): string {
  const item = items[itemId as ItemId]
  return item?.name || itemId
}

function getItemType(itemId: string): string {
  const item = items[itemId as ItemId]
  return item?.type || ''
}

function getItemIcon(itemId: string): string {
  const item = items[itemId as ItemId]
  switch (item?.type) {
    case 'module': return 'lucide:cpu'
    case 'gene_solution': return 'lucide:flask-conical'
    case 'skill_book': return 'lucide:book-open'
    case 'evolution_resource': return 'lucide:gem'
    default: return 'lucide:box'
  }
}

function getItemColor(itemId: string): string {
  const item = items[itemId as ItemId]
  switch (item?.type) {
    case 'module': return 'text-purple-400'
    case 'gene_solution': return 'text-green-400'
    case 'skill_book': return 'text-yellow-400'
    case 'evolution_resource': return 'text-cyan-400'
    default: return 'text-gray-400'
  }
}

function isUsableItem(itemId: string): boolean {
  const item = items[itemId as ItemId]
  return item?.type === 'consumable' || item?.type === 'gene_solution'
}

function isEquipableItem(itemId: string): boolean {
  const item = items[itemId as ItemId]
  return ['weapon', 'armor', 'accessory', 'spirit_weapon', 'module_cultivation', 'module_combat', 'module_survival'].includes(item?.type || '')
}

async function equipItem(itemId: string) {
  try {
    await execute('equipment/equip', { itemId })
  } catch (error) {
    console.error('Failed to equip item:', error)
  }
}

async function unequip(slot: string) {
  try {
    await execute('equipment/unequip', { slot })
  } catch (error) {
    console.error('Failed to unequip item:', error)
  }
}

async function useItem(itemId: string) {
  // TODO: Implement item usage
  console.log('Use item:', itemId)
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
