<template>
  <div class="space-y-4 text-sm font-mono">
    <div v-if="playerStore.character?.guildId" class="space-y-4">
      <div class="p-3 bg-gray-900/50 border border-gray-700 shadow-inner">
        <h3 class="text-cyan-400 border-b border-cyan-700/50 pb-1 mb-3 font-bold uppercase tracking-wider">
          > THÔNG TIN LIÊN MINH
        </h3>
        
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-400">Tên:</span>
            <span class="text-cyan-300 font-bold">{{ guildInfo?.name || 'ĐANG TẢI...' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Cấp Độ:</span>
            <span class="text-white">{{ guildInfo?.level || 1 }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Thành Viên:</span>
            <span class="text-white">{{ guildInfo?.memberCount || 0 }} / {{ guildInfo?.maxMembers || 20 }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Kho Tài Nguyên:</span>
            <span class="text-yellow-400">{{ guildInfo?.resources || 0 }} TC</span>
          </div>
        </div>
        
        <div class="mt-4 flex gap-2">
          <button 
            class="flex-1 px-2 py-1.5 border border-cyan-600/50 bg-cyan-900/30 text-cyan-400 hover:bg-cyan-900/50 transition-colors text-xs uppercase tracking-wider"
            @click="openGuildBase"
            :disabled="isLoading"
          >
            [ CĂN CỨ ]
          </button>
          <button 
            class="flex-1 px-2 py-1.5 border border-purple-600/50 bg-purple-900/30 text-purple-400 hover:bg-purple-900/50 transition-colors text-xs uppercase tracking-wider"
            @click="openGuildWar"
            :disabled="isLoading"
          >
            [ CHIẾN TRANH ]
          </button>
        </div>
      </div>

      <div class="p-3 bg-gray-900/50 border border-gray-700 shadow-inner">
        <h3 class="text-green-400 border-b border-green-700/50 pb-1 mb-3 font-bold uppercase tracking-wider">
          > THÀNH VIÊN
        </h3>
        
        <div class="space-y-2 max-h-64 overflow-y-auto">
          <div 
            v-for="member in guildMembers" 
            :key="member.id"
            class="border border-gray-600/30 bg-gray-800/30 p-2 flex justify-between items-center"
          >
            <div>
              <p class="text-white font-semibold">{{ member.name }}</p>
              <p class="text-xs text-gray-400">Lv.{{ member.level }} | {{ member.role }}</p>
            </div>
            <div class="text-xs text-gray-500">
              {{ member.online ? '[ ONLINE ]' : '[ OFFLINE ]' }}
            </div>
          </div>
        </div>
      </div>

      <div class="p-3 bg-gray-900/50 border border-gray-700 shadow-inner">
        <h3 class="text-yellow-400 border-b border-yellow-700/50 pb-1 mb-3 font-bold uppercase tracking-wider">
          > HÀNH ĐỘNG
        </h3>
        
        <div class="flex gap-2">
          <button 
            class="flex-1 px-2 py-1.5 border border-green-600/50 bg-green-900/30 text-green-400 hover:bg-green-900/50 transition-colors text-xs uppercase tracking-wider"
            @click="inviteMember"
            :disabled="isLoading"
          >
            [ MỜI THÀNH VIÊN ]
          </button>
          <button 
            class="flex-1 px-2 py-1.5 border border-red-600/50 bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-colors text-xs uppercase tracking-wider"
            @click="leaveGuild"
            :disabled="isLoading"
          >
            [ RỜI LIÊN MINH ]
          </button>
        </div>
      </div>
    </div>

    <div v-else class="p-3 bg-gray-900/50 border border-gray-700 shadow-inner">
      <h3 class="text-cyan-400 border-b border-cyan-700/50 pb-1 mb-3 font-bold uppercase tracking-wider">
        > TẠO HOẶC THAM GIA LIÊN MINH
      </h3>
      
      <div class="text-center py-8 space-y-4">
        <p class="text-gray-400 mb-4">[ BẠN CHƯA THAM GIA LIÊN MINH NÀO ]</p>
        
        <button 
          class="px-4 py-2 border border-cyan-600/50 bg-cyan-900/30 text-cyan-400 hover:bg-cyan-900/50 transition-colors text-sm uppercase tracking-wider"
          @click="createGuild"
          :disabled="isLoading"
        >
          [ TẠO LIÊN MINH MỚI ]
        </button>
        
        <p class="text-xs text-gray-500">Phí tạo: 10,000 Tinh Thạch</p>
        
        <div class="mt-6 pt-6 border-t border-gray-700">
          <h4 class="text-yellow-400 font-bold mb-2 uppercase">HƯỚNG DẪN:</h4>
          <ul class="text-xs text-gray-300 space-y-1 text-left">
            <li>> Liên minh cho phép người chơi hợp tác</li>
            <li>> Xây dựng căn cứ và phát triển cùng nhau</li>
            <li>> Tham gia chiến tranh liên minh để giành lãnh thổ</li>
            <li>> Chia sẻ tài nguyên và kinh nghiệm</li>
          </ul>
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

// Mock data
const guildInfo = ref(null)
const guildMembers = ref([])

async function createGuild() {
  const guildName = prompt('Nhập tên liên minh:')
  if (guildName) {
    await execute('guild/create', { name: guildName })
  }
}

async function inviteMember() {
  const playerName = prompt('Nhập tên người chơi:')
  if (playerName) {
    await execute('guild/invite', { targetName: playerName })
  }
}

async function leaveGuild() {
  if (confirm('Bạn có chắc muốn rời khỏi liên minh?')) {
    await execute('guild/leave')
  }
}

function openGuildBase() {
  execute('map/move', { targetZoneId: 'guild_base' })
}

function openGuildWar() {
  // To be implemented
  alert('Tính năng chiến tranh liên minh đang phát triển')
}
</script>
