<template>
  <div class="space-y-4 text-sm font-mono">
    <div class="p-3 bg-gray-900/50 border border-gray-700 shadow-inner">
      <h3 class="text-cyan-400 border-b border-cyan-700/50 pb-1 mb-3 font-bold uppercase tracking-wider">
        > TRANG BỊ HIỆN TẠI
      </h3>
      
      <div class="space-y-2">
        <!-- Weapon Slot -->
        <div class="border border-red-600/30 bg-red-900/10 p-3">
          <div class="flex justify-between items-center mb-2">
            <span class="text-red-400 font-bold uppercase text-xs">VŨ KHÍ:</span>
            <button 
              v-if="equippedWeapon"
              class="px-2 py-1 border border-red-600/50 text-red-400 hover:bg-red-900/30 transition-colors text-xs uppercase"
              @click="unequip('weapon')"
              :disabled="isLoading"
            >
              [ TỞ BỎ ]
            </button>
          </div>
          <div v-if="equippedWeapon" class="text-white">
            <p class="font-bold">{{ equippedWeapon.name }}</p>
            <p class="text-xs text-gray-400">TẤN CÔNG: +{{ equippedWeapon.attack || 0 }}</p>
          </div>
          <div v-else class="text-gray-500 italic text-xs">
            [ TRỐNG ]
          </div>
        </div>

        <!-- Armor Slot -->
        <div class="border border-blue-600/30 bg-blue-900/10 p-3">
          <div class="flex justify-between items-center mb-2">
            <span class="text-blue-400 font-bold uppercase text-xs">ÁO GIÁP:</span>
            <button 
              v-if="equippedArmor"
              class="px-2 py-1 border border-blue-600/50 text-blue-400 hover:bg-blue-900/30 transition-colors text-xs uppercase"
              @click="unequip('armor')"
              :disabled="isLoading"
            >
              [ TỞ BỎ ]
            </button>
          </div>
          <div v-if="equippedArmor" class="text-white">
            <p class="font-bold">{{ equippedArmor.name }}</p>
            <p class="text-xs text-gray-400">PHÒNG THỦ: +{{ equippedArmor.defense || 0 }}</p>
          </div>
          <div v-else class="text-gray-500 italic text-xs">
            [ TRỐNG ]
          </div>
        </div>

        <!-- Accessory Slot -->
        <div class="border border-purple-600/30 bg-purple-900/10 p-3">
          <div class="flex justify-between items-center mb-2">
            <span class="text-purple-400 font-bold uppercase text-xs">PHỤ KIỆN:</span>
            <button 
              v-if="equippedAccessory"
              class="px-2 py-1 border border-purple-600/50 text-purple-400 hover:bg-purple-900/30 transition-colors text-xs uppercase"
              @click="unequip('accessory')"
              :disabled="isLoading"
            >
              [ TỞ BỎ ]
            </button>
          </div>
          <div v-if="equippedAccessory" class="text-white">
            <p class="font-bold">{{ equippedAccessory.name }}</p>
            <p class="text-xs text-gray-400">{{ equippedAccessory.description }}</p>
          </div>
          <div v-else class="text-gray-500 italic text-xs">
            [ TRỐNG ]
          </div>
        </div>

        <!-- Module Slots -->
        <div class="border-t-2 border-gray-700 pt-3 mt-3">
          <p class="text-yellow-400 font-bold uppercase text-xs mb-2">MODULE HỆ THỐNG:</p>
          
          <div class="space-y-2">
            <div 
              v-for="slot in ['moduleSlot1', 'moduleSlot2', 'moduleSlot3']" 
              :key="slot"
              class="border border-green-600/30 bg-green-900/10 p-2"
            >
              <div class="flex justify-between items-center">
                <div class="flex-grow">
                  <span class="text-green-400 font-bold text-xs uppercase">{{ getModuleSlotName(slot) }}:</span>
                  <div v-if="getEquippedModule(slot)" class="text-white text-xs mt-1">
                    <p class="font-semibold">{{ getEquippedModule(slot).name }}</p>
                  </div>
                  <div v-else class="text-gray-500 italic text-xs">
                    [ TRỐNG ]
                  </div>
                </div>
                <button 
                  v-if="getEquippedModule(slot)"
                  class="px-2 py-1 border border-red-600/50 text-red-400 hover:bg-red-900/30 transition-colors text-xs uppercase"
                  @click="unequipModule(slot)"
                  :disabled="isLoading"
                >
                  [ TỞ ]
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="p-3 bg-gray-900/50 border border-gray-700 shadow-inner">
      <h3 class="text-orange-400 border-b border-orange-700/50 pb-1 mb-3 font-bold uppercase tracking-wider">
        > TRANG BỊ CÓ THỂ ĐĂNG
      </h3>
      
      <div class="space-y-2 max-h-96 overflow-y-auto">
        <div 
          v-for="item in equipableItems" 
          :key="item.id"
          class="border border-gray-600/30 bg-gray-800/30 p-2 hover:bg-gray-800/50 transition-colors"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="text-white font-semibold text-sm">{{ item.name }}</p>
              <p class="text-xs text-gray-400">{{ item.type }} | {{ formatStats(item) }}</p>
            </div>
            <button 
              class="px-3 py-1 border border-green-600/50 bg-green-900/30 text-green-400 hover:bg-green-900/50 transition-colors text-xs uppercase font-bold"
              @click="equipItem(item)"
              :disabled="isLoading"
            >
              [ TRANG BỊ ]
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="equipableItems.length === 0" class="text-center py-6 text-gray-500 italic text-xs">
        [ KHÔNG CÓ TRANG BỊ NÀO TRONG TÚI ĐỒ ]
      </div>
    </div>

    <div class="p-3 bg-gray-900/50 border border-gray-700 shadow-inner">
      <h3 class="text-green-400 border-b border-green-700/50 pb-1 mb-3 font-bold uppercase tracking-wider">
        > NÂNG CẤP TRANG BỊ
      </h3>
      
      <div class="space-y-2">
        <div class="border border-green-600/30 bg-green-900/10 p-3">
          <p class="text-xs text-gray-300 mb-3">Nâng cấp trang bị để tăng chỉ số</p>
          
          <select 
            v-model="selectedUpgradeItem"
            class="w-full bg-gray-800 border border-gray-600 text-white p-2 mb-2 text-xs"
          >
            <option value="">-- Chọn trang bị --</option>
            <option 
              v-for="item in equippedItems" 
              :key="item.slot" 
              :value="item.slot"
            >
              {{ item.name }} (+{{ item.level || 0 }})
            </option>
          </select>
          
          <button 
            class="w-full px-3 py-2 border border-green-600/50 bg-green-900/30 text-green-400 hover:bg-green-900/50 transition-colors text-xs uppercase font-bold"
            @click="enhanceEquipment"
            :disabled="isLoading || !selectedUpgradeItem"
          >
            [ NÂNG CẤP ] (Chi phí: 1000 TC)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameAction } from '~/composables/useGameAction'
import { usePlayerStore } from '~/stores/player'

const { execute, isLoading } = useGameAction()
const playerStore = usePlayerStore()

const selectedUpgradeItem = ref('')

// Get equipped items
const equippedWeapon = computed(() => {
  const weaponId = playerStore.character?.equipment?.weapon
  if (!weaponId) return null
  // Fetch weapon data from items config
  return { name: weaponId, attack: 10 } // Mock data
})

const equippedArmor = computed(() => {
  const armorId = playerStore.character?.equipment?.armor
  if (!armorId) return null
  return { name: armorId, defense: 5 } // Mock data
})

const equippedAccessory = computed(() => {
  const accessoryId = playerStore.character?.equipment?.accessory
  if (!accessoryId) return null
  return { name: accessoryId, description: 'Phụ kiện đặc biệt' } // Mock data
})

const equippedItems = computed(() => {
  const items = []
  if (equippedWeapon.value) items.push({ slot: 'weapon', name: equippedWeapon.value.name, level: 0 })
  if (equippedArmor.value) items.push({ slot: 'armor', name: equippedArmor.value.name, level: 0 })
  if (equippedAccessory.value) items.push({ slot: 'accessory', name: equippedAccessory.value.name, level: 0 })
  return items
})

function getEquippedModule(slot: string) {
  const moduleId = playerStore.character?.equipment?.[slot as keyof typeof playerStore.character.equipment]
  if (!moduleId) return null
  return { name: moduleId } // Mock data
}

function getModuleSlotName(slot: string): string {
  const names: Record<string, string> = {
    moduleSlot1: 'MODULE 1',
    moduleSlot2: 'MODULE 2',
    moduleSlot3: 'MODULE 3'
  }
  return names[slot] || slot
}

// Get equipable items from inventory
const equipableItems = computed(() => {
  if (!playerStore.character?.inventory) return []
  
  // Filter items that can be equipped
  return playerStore.character.inventory
    .filter((item: any) => {
      // Check if item is equipment (weapon, armor, accessory, module)
      return ['weapon', 'armor', 'accessory', 'module'].some(type => 
        item.itemId.includes(type)
      )
    })
    .map((item: any) => ({
      id: item.itemId,
      name: item.itemId.replace(/_/g, ' ').toUpperCase(),
      type: getItemType(item.itemId),
      quantity: item.quantity
    }))
})

function getItemType(itemId: string): string {
  if (itemId.includes('weapon')) return 'Vũ Khí'
  if (itemId.includes('armor')) return 'Áo Giáp'
  if (itemId.includes('accessory')) return 'Phụ Kiện'
  if (itemId.includes('module')) return 'Module'
  return 'Trang Bị'
}

function formatStats(item: any): string {
  // Mock stats based on item type
  if (item.type === 'Vũ Khí') return 'TẤN +10'
  if (item.type === 'Áo Giáp') return 'THỦ +5'
  return 'Trang bị đặc biệt'
}

async function equipItem(item: any) {
  // Determine slot based on item type
  let slot = 'weapon'
  if (item.type === 'Áo Giáp') slot = 'armor'
  else if (item.type === 'Phụ Kiện') slot = 'accessory'
  else if (item.type === 'Module') slot = 'moduleSlot1'
  
  await execute('character/equip', { itemId: item.id, slot })
}

async function unequip(slot: string) {
  await execute('character/unequip', { slot })
}

async function unequipModule(slot: string) {
  await execute('character/unequip', { slot })
}

async function enhanceEquipment() {
  if (!selectedUpgradeItem.value) return
  await execute('equipment/enhance', { slot: selectedUpgradeItem.value })
}
</script>
