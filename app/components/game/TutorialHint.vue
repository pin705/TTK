<template>
  <div v-if="showHint" class="fixed top-20 right-4 z-50 max-w-md animate-slide-in-right">
    <div class="bg-gradient-to-br from-cyan-900/95 to-blue-900/95 border-2 border-cyan-500/70 rounded-lg shadow-2xl p-4 backdrop-blur-sm">
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0">
          <Icon name="lucide:lightbulb" class="h-6 w-6 text-yellow-400 animate-pulse" />
        </div>
        <div class="flex-grow">
          <h3 class="text-cyan-300 font-bold text-sm mb-1 flex items-center gap-2">
            <Icon name="lucide:info" class="h-4 w-4" />
            Hướng Dẫn
          </h3>
          <p class="text-gray-200 text-sm leading-relaxed">
            {{ currentHint }}
          </p>
          <div v-if="currentQuestObjective" class="mt-2 pt-2 border-t border-cyan-700/50">
            <p class="text-xs text-cyan-400 font-semibold mb-1">Mục Tiêu Hiện Tại:</p>
            <p class="text-xs text-gray-300">{{ currentQuestObjective }}</p>
          </div>
        </div>
        <button 
          @click="dismissHint"
          class="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
          title="Đóng hướng dẫn"
        >
          <Icon name="lucide:x" class="h-5 w-5" />
        </button>
      </div>
      <div class="mt-3 flex items-center justify-between">
        <button 
          @click="prevHint"
          :disabled="currentHintIndex === 0"
          class="text-xs px-2 py-1 bg-gray-700/50 hover:bg-gray-600/50 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Icon name="lucide:chevron-left" class="h-4 w-4" />
        </button>
        <div class="text-xs text-gray-400">
          {{ currentHintIndex + 1 }} / {{ hints.length }}
        </div>
        <button 
          @click="nextHint"
          :disabled="currentHintIndex === hints.length - 1"
          class="text-xs px-2 py-1 bg-gray-700/50 hover:bg-gray-600/50 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Icon name="lucide:chevron-right" class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '~/stores/player'

const playerStore = usePlayerStore()

const showHint = ref(false) // Start with false, will be set based on quest
const currentHintIndex = ref(0)

// Track dismissed tutorial quests in localStorage
const dismissedTutorials = ref<string[]>([])

onMounted(() => {
  // Load dismissed tutorials from localStorage
  const stored = localStorage.getItem('dismissedTutorials')
  if (stored) {
    try {
      dismissedTutorials.value = JSON.parse(stored)
    } catch (e) {
      dismissedTutorials.value = []
    }
  }
})

// Tutorial hints based on active quest
const hints = computed(() => {
  const character = playerStore.character
  if (!character?.activeQuests || character.activeQuests.length === 0) {
    return []
  }

  const tutorialQuest = character.activeQuests.find((q: any) => 
    q.questId.startsWith('tutorial_')
  )

  if (!tutorialQuest) return []
  
  // Check if this tutorial has been dismissed
  if (dismissedTutorials.value.includes(tutorialQuest.questId)) {
    return []
  }

  switch (tutorialQuest.questId) {
    case 'tutorial_welcome':
      return [
        'Chào mừng đến với Tinh Không Đạo Lộ! Đây là thế giới hậu tận thế đầy nguy hiểm.',
        'Hãy di chuyển đến Võ Quán Cực Hạn để gặp Võ Sư Trương.',
        'Sử dụng nút "Di Chuyển" hoặc nhấp vào khu vực trên bản đồ để di chuyển.',
        'Võ Sư Trương sẽ hướng dẫn bạn các bước tiếp theo.'
      ]
    case 'tutorial_first_combat':
      return [
        'Đã đến lúc học cách chiến đấu! Hãy ra ngoài Hoang Dã.',
        'Tại Hoang Dã, bạn sẽ gặp quái thú như Lợn Rừng Nanh Máu.',
        'Nhấp vào quái thú hoặc sử dụng lệnh "attack" để bắt đầu chiến đấu.',
        'Sau khi chiến thắng, bạn sẽ nhận được kinh nghiệm và tài nguyên.'
      ]
    case 'tutorial_gather_resources':
      return [
        'Tài nguyên rất quan trọng để sinh tồn và phát triển.',
        'Sau mỗi trận chiến, bạn có thể nhận được Da Thú, Xương, và các vật liệu khác.',
        'Mở tab "Túi Đồ" để xem tất cả tài nguyên đã thu thập.',
        'Bạn có thể bán tài nguyên hoặc dùng để chế tạo trang bị.'
      ]
    default:
      return []
  }
})

const currentHint = computed(() => hints.value[currentHintIndex.value] || '')

const currentQuestObjective = computed(() => {
  const character = playerStore.character
  if (!character?.activeQuests) return null

  const tutorialQuest = character.activeQuests.find((q: any) => 
    q.questId.startsWith('tutorial_')
  )
  if (!tutorialQuest || !tutorialQuest.objectives || tutorialQuest.objectives.length === 0) return null

  // Find first incomplete objective
  const incompleteObj = tutorialQuest.objectives.find((obj: any) => obj.current < obj.count)
  if (!incompleteObj) return null

  const typeLabels: Record<string, string> = {
    kill: 'Hạ gục',
    gather: 'Thu thập',
    talk: 'Nói chuyện với',
    explore: 'Khám phá'
  }
  const label = typeLabels[incompleteObj.type] || incompleteObj.type
  return `${label} ${incompleteObj.target} (${incompleteObj.current}/${incompleteObj.count})`
})

function nextHint() {
  if (currentHintIndex.value < hints.value.length - 1) {
    currentHintIndex.value++
  }
}

function prevHint() {
  if (currentHintIndex.value > 0) {
    currentHintIndex.value--
  }
}

function dismissHint() {
  showHint.value = false
  
  // Save dismissal for current tutorial quest
  const character = playerStore.character
  if (character?.activeQuests) {
    const tutorialQuest = character.activeQuests.find((q: any) => 
      q.questId.startsWith('tutorial_')
    )
    if (tutorialQuest && !dismissedTutorials.value.includes(tutorialQuest.questId)) {
      dismissedTutorials.value.push(tutorialQuest.questId)
      localStorage.setItem('dismissedTutorials', JSON.stringify(dismissedTutorials.value))
    }
  }
}

// Auto-show hint when quest changes
watch(() => playerStore.character?.activeQuests, (newQuests, oldQuests) => {
  if (hints.value.length > 0) {
    // Check if we have a new tutorial quest that hasn't been dismissed
    const tutorialQuest = newQuests?.find((q: any) => q.questId.startsWith('tutorial_'))
    if (tutorialQuest && !dismissedTutorials.value.includes(tutorialQuest.questId)) {
      showHint.value = true
      currentHintIndex.value = 0
    }
  } else {
    showHint.value = false
  }
}, { deep: true, immediate: true })
</script>

<style scoped>
@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in-right {
  animation: slide-in-right 0.5s ease-out;
}
</style>
