<template>
  <div 
    v-if="isOpen && npc" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono"
    @click.self="close"
  >
    <div class="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border-2 border-green-600/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
      <!-- Header -->
      <div class="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-b-2 border-green-600/50 p-4">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-xl font-bold text-green-300 uppercase tracking-wider">
              > {{ npcData?.name || 'NPC' }}
            </h2>
            <p class="text-sm text-gray-400 mt-1">
              {{ npcData?.title || 'Nhân vật tương tác' }}
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
        <!-- NPC Portrait (text-based) -->
        <div class="border-2 border-green-600/30 bg-green-900/10 p-4 text-center">
          <div class="text-6xl mb-2">{{ npcData?.avatar || '👤' }}</div>
          <p class="text-gray-400 text-xs italic">{{ npcData?.description || 'Nhân vật trong game' }}</p>
        </div>

        <!-- Dialog Text -->
        <div class="border border-green-600/30 bg-gray-800/50 p-4 min-h-[150px]">
          <p class="text-green-200 leading-relaxed">
            {{ dialogText }}
          </p>
        </div>

        <!-- Quest Status -->
        <div v-if="npc.hasCompletableQuest" class="border border-green-600/50 bg-green-900/20 p-3">
          <p class="text-green-400 font-bold mb-2">[ ✓ NHIỆM VỤ HOÀN THÀNH ]</p>
          <p class="text-gray-300 text-sm">Bạn đã hoàn thành nhiệm vụ! Hãy trả lại cho NPC để nhận phần thưởng.</p>
        </div>

        <div v-else-if="npc.hasAvailableQuest" class="border border-yellow-600/50 bg-yellow-900/20 p-3">
          <p class="text-yellow-400 font-bold mb-2">[ ! NHIỆM VỤ MỚI ]</p>
          <p class="text-gray-300 text-sm">NPC này có nhiệm vụ mới cho bạn. Hãy nói chuyện để nhận nhiệm vụ.</p>
        </div>

        <!-- Actions -->
        <div class="space-y-2">
          <button 
            @click="handleTalk"
            class="w-full px-4 py-3 border-2 border-green-600/50 bg-green-900/30 text-green-400 hover:bg-green-900/50 hover:border-green-500 transition-colors uppercase font-bold tracking-wider"
            :disabled="isLoading"
          >
            [ NÓI CHUYỆN ]
          </button>

          <div class="grid grid-cols-2 gap-2">
            <button 
              class="px-3 py-2 border border-blue-600/50 bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 transition-colors uppercase font-bold text-sm"
              @click="handleTrade"
              :disabled="!npcData?.canTrade"
            >
              [ MUA BÁN ]
            </button>
            <button 
              class="px-3 py-2 border border-purple-600/50 bg-purple-900/30 text-purple-400 hover:bg-purple-900/50 transition-colors uppercase font-bold text-sm"
              @click="handleServices"
              :disabled="!npcData?.hasServices"
            >
              [ DỊCH VỤ ]
            </button>
          </div>

          <button 
            @click="close"
            class="w-full px-4 py-2 border border-gray-600/50 bg-gray-800/30 text-gray-400 hover:bg-gray-700/50 hover:border-gray-500 transition-colors uppercase font-bold tracking-wider"
          >
            [ RỜI ĐI ]
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameAction } from '~/composables/useGameAction'
import { npcs, type NpcId } from '~~/shared/config'

interface NpcDialogProps {
  isOpen: boolean
  npc: any
}

const props = defineProps<NpcDialogProps>()
const emit = defineEmits(['close', 'talk'])

const { execute, isLoading } = useGameAction()

const npcData = computed(() => {
  if (!props.npc) return null
  return npcs[props.npc.npcId as NpcId]
})

const dialogText = computed(() => {
  if (!npcData.value) return 'Xin chào, lữ khách!'
  
  if (props.npc.hasCompletableQuest) {
    return npcData.value.questCompleteDialogue || 'Bạn đã hoàn thành nhiệm vụ xuất sắc!'
  }
  
  if (props.npc.hasAvailableQuest) {
    return npcData.value.questAvailableDialogue || 'Tôi có một nhiệm vụ cho bạn...'
  }
  
  return npcData.value.defaultDialogue || 'Xin chào! Có gì tôi có thể giúp bạn?'
})

function close() {
  emit('close')
}

function handleTalk() {
  emit('talk', props.npc.npcId)
}

function handleTrade() {
  // To be implemented - open trade interface
  alert('Tính năng mua bán đang phát triển')
  close()
}

function handleServices() {
  // To be implemented - open services interface
  alert('Dịch vụ đang phát triển')
  close()
}
</script>
