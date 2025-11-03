<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono"
    @click.self="close"
  >
    <div class="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border-2 border-red-600/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
      <!-- Header -->
      <div class="bg-gradient-to-r from-red-900/50 to-orange-900/50 border-b-2 border-red-600/50 p-4">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-xl font-bold text-red-300 uppercase tracking-wider">
              {{ monster?.name || 'THÔNG TIN QUÁI VẬT' }}
            </h2>
            <p class="text-sm text-gray-400 mt-1">
              Cấp độ: {{ monster?.level || '?' }} | 
              Loại: {{ monsterType }}
            </p>
          </div>
          <button 
            @click="close"
            class="px-3 py-1 border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 transition-colors uppercase text-sm"
          >
            [ ĐÓNG ]
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-4 space-y-4">
        <!-- Stats -->
        <div class="border border-red-600/30 bg-red-900/10 p-3">
          <h3 class="text-red-400 font-bold mb-2 uppercase text-sm">THÔNG SỐ CHIẾN ĐẤU:</h3>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-400">Sinh Lực:</span>
              <span class="text-red-300 font-bold">{{ monster?.hp || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Tấn Công:</span>
              <span class="text-orange-300 font-bold">{{ monster?.stats?.attack || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Phòng Thủ:</span>
              <span class="text-blue-300 font-bold">{{ monster?.stats?.defense || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Tốc Độ:</span>
              <span class="text-green-300 font-bold">{{ monster?.stats?.speed || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div v-if="monster?.description" class="border border-gray-600/30 bg-gray-800/30 p-3">
          <h3 class="text-yellow-400 font-bold mb-2 uppercase text-sm">MÔ TẢ:</h3>
          <p class="text-gray-300 text-sm">{{ monster.description }}</p>
        </div>

        <!-- Abilities -->
        <div v-if="monster?.abilities && monster.abilities.length > 0" class="border border-purple-600/30 bg-purple-900/10 p-3">
          <h3 class="text-purple-400 font-bold mb-2 uppercase text-sm">KỸ NĂNG ĐẶC BIỆT:</h3>
          <ul class="space-y-1 text-sm">
            <li 
              v-for="ability in monster.abilities" 
              :key="ability.name"
              class="text-purple-300"
            >
              > {{ ability.name }}: <span class="text-gray-400">{{ ability.description }}</span>
            </li>
          </ul>
        </div>

        <!-- Drops -->
        <div class="border border-green-600/30 bg-green-900/10 p-3">
          <h3 class="text-green-400 font-bold mb-2 uppercase text-sm">VẬT PHẨM RƠI:</h3>
          
          <div v-if="monster?.drops && monster.drops.length > 0" class="space-y-2">
            <div 
              v-for="drop in monster.drops" 
              :key="drop.itemId"
              class="flex justify-between items-center text-sm border-b border-gray-700/30 pb-1"
            >
              <span class="text-green-300">{{ drop.name || drop.itemId }}</span>
              <div class="text-right">
                <span class="text-gray-400 text-xs">Tỉ lệ:</span>
                <span class="text-yellow-400 ml-1">{{ (drop.chance * 100).toFixed(1) }}%</span>
              </div>
            </div>

            <!-- Expected rewards -->
            <div class="mt-3 pt-3 border-t border-green-700/30 text-xs text-gray-400">
              <p>Kinh nghiệm: <span class="text-cyan-400 font-bold">+{{ monster?.expReward || 0 }}</span></p>
              <p v-if="monster?.goldReward">Vàng: <span class="text-yellow-400 font-bold">+{{ monster.goldReward }}</span></p>
            </div>
          </div>
          
          <div v-else class="text-sm text-gray-500 italic text-center py-2">
            [ KHÔNG RƠI VẬT PHẨM ĐẶC BIỆT ]
          </div>
        </div>

        <!-- Weaknesses -->
        <div v-if="monster?.weaknesses && monster.weaknesses.length > 0" class="border border-cyan-600/30 bg-cyan-900/10 p-3">
          <h3 class="text-cyan-400 font-bold mb-2 uppercase text-sm">ĐIỂM YẾU:</h3>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="weakness in monster.weaknesses" 
              :key="weakness"
              class="px-2 py-1 bg-cyan-900/30 border border-cyan-600/50 text-cyan-300 text-xs uppercase"
            >
              {{ weakness }}
            </span>
          </div>
        </div>

        <!-- Combat Strategy -->
        <div v-if="monster?.strategy" class="border border-yellow-600/30 bg-yellow-900/10 p-3">
          <h3 class="text-yellow-400 font-bold mb-2 uppercase text-sm">CHIẾN THUẬT KHUYÊN DÙNG:</h3>
          <p class="text-gray-300 text-sm">{{ monster.strategy }}</p>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 pt-2">
          <button 
            @click="attackMonster"
            class="flex-1 px-4 py-2 border-2 border-red-600/50 bg-red-900/30 text-red-400 hover:bg-red-900/50 hover:border-red-500 transition-colors uppercase font-bold tracking-wider"
            :disabled="isLoading"
          >
            [ TẤN CÔNG NGAY ]
          </button>
          <button 
            v-if="canTame"
            @click="tameMonster"
            class="flex-1 px-4 py-2 border-2 border-green-600/50 bg-green-900/30 text-green-400 hover:bg-green-900/50 hover:border-green-500 transition-colors uppercase font-bold tracking-wider"
            :disabled="isLoading"
          >
            [ THUẦN PHỤC ]
          </button>
          <button 
            @click="close"
            class="px-4 py-2 border-2 border-gray-600/50 bg-gray-800/30 text-gray-400 hover:bg-gray-700/50 hover:border-gray-500 transition-colors uppercase font-bold tracking-wider"
          >
            [ HỦY ]
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameAction } from '~/composables/useGameAction'
import { usePlayerStore } from '~/stores/player'

interface MonsterInfoModalProps {
  isOpen: boolean
  monster: any
}

const props = defineProps<MonsterInfoModalProps>()
const emit = defineEmits(['close', 'attack', 'tame'])

const { execute, isLoading } = useGameAction()
const playerStore = usePlayerStore()

const monsterType = computed(() => {
  if (!props.monster?.type) return 'Quái thú'
  const types: Record<string, string> = {
    beast: 'Dã Thú',
    mutant: 'Đột Biến',
    mechanical: 'Cơ Khí',
    undead: 'Xác Sống',
    elemental: 'Nguyên Tố',
    demon: 'Ma Quỷ',
    boss: 'TRÙM'
  }
  return types[props.monster.type] || props.monster.type
})

const canTame = computed(() => {
  // Check if player is Spirit Reader and has slave ring
  return playerStore.character?.class === 'SpiritReader' && 
         playerStore.character?.inventory?.some((item: any) => item.itemId === 'slave_ring')
})

function close() {
  emit('close')
}

async function attackMonster() {
  emit('attack', props.monster)
  close()
}

async function tameMonster() {
  emit('tame', props.monster)
  close()
}
</script>
