<template>
  <div class="space-y-4 text-sm font-mono">
    <div class="p-3 bg-gray-900/50 border border-gray-700 shadow-inner">
      <h3 class="text-green-400 border-b border-green-700/50 pb-1 mb-3 font-bold uppercase tracking-wider">
        > THÚ CƯỠI & HỢP ĐỒNG
      </h3>
      
      <div v-if="playerStore.character?.activePetId" class="space-y-3">
        <div class="border border-green-600/30 bg-green-900/20 p-3">
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="text-green-300 font-bold text-base">{{ activePet?.name || 'Thú Cưỡi Đang Hoạt Động' }}</p>
              <p class="text-xs text-gray-400 uppercase">Cấp Độ: {{ activePet?.level || 1 }}</p>
            </div>
            <button 
              class="px-2 py-1 border border-red-600/50 bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-colors text-xs uppercase tracking-wider"
              @click="deactivatePet"
              :disabled="isLoading"
            >
              [ THU HỒI ]
            </button>
          </div>
          
          <div class="space-y-1 text-xs">
            <div class="flex justify-between">
              <span class="text-gray-400">Sinh Lực:</span>
              <span class="text-white">{{ activePet?.hp || 0 }} / {{ activePet?.hpMax || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Tấn Công:</span>
              <span class="text-white">{{ activePet?.stats?.attack || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Phòng Thủ:</span>
              <span class="text-white">{{ activePet?.stats?.defense || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Chế Độ:</span>
              <span class="text-green-300 font-bold">{{ activePet?.mode || 'COMBAT' }}</span>
            </div>
          </div>
          
          <div class="mt-3 flex gap-2">
            <button 
              class="flex-1 px-2 py-1.5 border border-green-600/50 bg-green-900/30 text-green-400 hover:bg-green-900/50 transition-colors text-xs uppercase tracking-wider"
              @click="setPetMode('Combat')"
              :disabled="isLoading"
            >
              [ CHIẾN ĐẤU ]
            </button>
            <button 
              class="flex-1 px-2 py-1.5 border border-blue-600/50 bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 transition-colors text-xs uppercase tracking-wider"
              @click="setPetMode('Collect')"
              :disabled="isLoading"
            >
              [ THU THẬP ]
            </button>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-8 text-gray-500 italic border border-gray-700/50 bg-gray-800/30">
        <p class="mb-3">[ CHƯA CÓ THÚ CƯỠI ĐANG HOẠT ĐỘNG ]</p>
        <p class="text-xs">Sử dụng Nô Lệ Nhẫn để thuần phục quái thú hoặc mua thú cơ khí từ cửa hàng</p>
      </div>
    </div>

    <div class="p-3 bg-gray-900/50 border border-gray-700 shadow-inner">
      <h3 class="text-purple-400 border-b border-purple-700/50 pb-1 mb-3 font-bold uppercase tracking-wider">
        > DANH SÁCH THÚ CƯỠI
      </h3>
      
      <div v-if="ownedPets.length > 0" class="space-y-2">
        <div 
          v-for="pet in ownedPets" 
          :key="pet._id"
          class="border border-gray-600/30 bg-gray-800/30 p-2 hover:bg-gray-800/50 transition-colors"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="text-white font-semibold">{{ pet.name }}</p>
              <p class="text-xs text-gray-400">Lv.{{ pet.level }} | HP: {{ pet.hp }}/{{ pet.hpMax }}</p>
            </div>
            <button 
              v-if="pet._id !== playerStore.character?.activePetId"
              class="px-2 py-1 border border-green-600/50 bg-green-900/30 text-green-400 hover:bg-green-900/50 transition-colors text-xs uppercase tracking-wider"
              @click="activatePet(pet._id)"
              :disabled="isLoading"
            >
              [ TRIỆU HỒI ]
            </button>
            <span v-else class="text-green-400 text-xs uppercase">[ ĐANG HOẠT ĐỘNG ]</span>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-4 text-gray-500 italic">
        [ CHƯA CÓ THÚ CƯỠI NÀO ]
      </div>
    </div>

    <div class="p-3 bg-gray-900/50 border border-gray-700 shadow-inner">
      <h3 class="text-yellow-400 border-b border-yellow-700/50 pb-1 mb-3 font-bold uppercase tracking-wider">
        > HƯỚNG DẪN
      </h3>
      <ul class="space-y-1 text-xs text-gray-300">
        <li>> Sử dụng "Nô Lệ Nhẫn" trong chiến đấu để thuần phục quái thú</li>
        <li>> Mua "Thú Cơ Khí" từ cửa hàng hoặc chế tạo</li>
        <li>> Chế độ CHIẾN ĐẤU: thú sẽ hỗ trợ đánh quái</li>
        <li>> Chế độ THU THẬP: tự động thu thập tài nguyên</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameAction } from '~/composables/useGameAction'
import { usePlayerStore } from '~/stores/player'

const { execute, isLoading } = useGameAction()
const playerStore = usePlayerStore()

// Mock data - in reality this would come from API
const activePet = ref(null)
const ownedPets = ref([])

async function activatePet(petId: string) {
  await execute('pet/activate', { petId })
}

async function deactivatePet() {
  // Implement deactivation logic
  await execute('pet/deactivate')
}

async function setPetMode(mode: 'Combat' | 'Collect') {
  await execute('pet/setMode', { mode })
}
</script>
