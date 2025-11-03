<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="close">
        <div class="relative w-full max-w-2xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-2xl border border-gray-700" @click.stop>
          <div class="p-6">
      <!-- NPC Header -->
      <div class="flex items-center gap-4 mb-4 pb-4 border-b border-gray-700">
        <div class="w-16 h-16 bg-gradient-to-br from-green-700/40 to-emerald-700/40 rounded-full flex items-center justify-center border-2 border-green-600/50">
          <Icon name="lucide:user" class="text-green-300 h-8 w-8" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-green-300">{{ npcData?.name }}</h2>
          <p class="text-sm text-gray-400">{{ npcData?.title || 'NPC' }}</p>
        </div>
      </div>

      <!-- Dialog Content -->
      <div class="space-y-4 mb-6">
        <!-- Greeting -->
        <div v-if="dialogState === 'greeting'" class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <p class="text-gray-200 italic">"{{ currentGreeting }}"</p>
        </div>

        <!-- Available Quests -->
        <div v-if="availableQuests.length > 0" class="space-y-2">
          <h3 class="text-yellow-400 font-semibold flex items-center gap-2">
            <Icon name="lucide:scroll" class="h-4 w-4" />
            Nhiệm Vụ Mới
          </h3>
          <div
            v-for="quest in availableQuests"
            :key="quest.id"
            class="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3 hover:border-yellow-500/50 transition-colors"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1">
                <h4 class="font-semibold text-yellow-300 mb-1">{{ quest.template.title }}</h4>
                <p class="text-sm text-gray-400">{{ quest.template.description }}</p>
                <div v-if="quest.template.rewards" class="mt-2 text-xs text-gray-500">
                  Phần thưởng: {{ formatRewards(quest.template.rewards) }}
                </div>
              </div>
              <button
                @click="acceptQuest(quest.id)"
                :disabled="isLoading"
                class="bg-yellow-600/80 hover:bg-yellow-500/80 px-3 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 flex-shrink-0"
              >
                Nhận
              </button>
            </div>
          </div>
        </div>

        <!-- Completable Quests -->
        <div v-if="completableQuests.length > 0" class="space-y-2">
          <h3 class="text-green-400 font-semibold flex items-center gap-2">
            <Icon name="lucide:check-circle-2" class="h-4 w-4" />
            Trả Nhiệm Vụ
          </h3>
          <div
            v-for="quest in completableQuests"
            :key="quest.id"
            class="bg-green-900/20 border border-green-600/30 rounded-lg p-3 hover:border-green-500/50 transition-colors"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1">
                <h4 class="font-semibold text-green-300 mb-1">{{ quest.template.title }}</h4>
                <p class="text-sm text-gray-400">Nhiệm vụ đã hoàn thành!</p>
                <div v-if="quest.template.rewards" class="mt-2 text-xs text-gray-500">
                  Phần thưởng: {{ formatRewards(quest.template.rewards) }}
                </div>
              </div>
              <button
                @click="claimQuest(quest.id)"
                :disabled="isLoading"
                class="bg-green-600/80 hover:bg-green-500/80 px-3 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 flex-shrink-0"
              >
                Nhận Thưởng
              </button>
            </div>
          </div>
        </div>

        <!-- No quests message -->
        <div v-if="availableQuests.length === 0 && completableQuests.length === 0" class="text-center py-4">
          <p class="text-gray-500 italic text-sm">Không có nhiệm vụ nào.</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3">
        <button
          @click="close"
          class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
        >
          Đóng
        </button>
      </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { usePlayerStore } from '~/stores/player'
import { useGameAction } from '~/composables/useGameAction'
import { npcs, quests, type NpcId, type QuestId, type QuestTemplate } from '~~/shared/config'

const props = defineProps<{
  npcId: NpcId | null
}>()

const emit = defineEmits<{
  close: []
}>()

const playerStore = usePlayerStore()
const { execute, isLoading } = useGameAction()

const isOpen = ref(false)
const dialogState = ref<'greeting' | 'quests'>('greeting')

const npcData = computed(() => {
  if (!props.npcId) return null
  return npcs[props.npcId]
})

const currentGreeting = computed(() => {
  if (!npcData.value?.dialogues?.greeting) return 'Xin chào!'
  const greetings = npcData.value.dialogues.greeting
  return greetings[Math.floor(Math.random() * greetings.length)]
})

const availableQuests = computed(() => {
  if (!props.npcId || !playerStore.character) return []
  
  const available: { id: QuestId, template: QuestTemplate }[] = []
  Object.entries(quests).forEach(([id, quest]) => {
    const questId = id as QuestId
    if (quest.npcId === props.npcId
      && (!quest.requiredLevel || playerStore.character!.level >= quest.requiredLevel)
      && !playerStore.character!.activeQuests.some(q => q.questId === questId)
      && (quest.isRepeatable || !playerStore.character!.completedQuests.includes(questId))
    ) {
      available.push({ id: questId, template: quest })
    }
  })
  return available
})

const completableQuests = computed(() => {
  if (!props.npcId || !playerStore.character) return []
  
  const completable: { id: QuestId, template: QuestTemplate }[] = []
  playerStore.character.activeQuests.forEach((q) => {
    const template = quests[q.questId as QuestId]
    if (template && q.status === 'completed') {
      const lastObjective = template.objectives[template.objectives.length - 1]
      if (lastObjective?.type === 'talk' && lastObjective.npcId === props.npcId) {
        completable.push({ id: q.questId as QuestId, template })
      }
    }
  })
  return completable
})

function formatRewards(rewards: any) {
  const parts = []
  if (rewards.exp) parts.push(`${rewards.exp} EXP`)
  if (rewards.items) {
    rewards.items.forEach((item: any) => {
      parts.push(`${item.quantity}x ${item.itemId}`)
    })
  }
  return parts.join(', ') || 'Không có'
}

async function acceptQuest(questId: QuestId) {
  try {
    await execute('quest/accept', { questId })
  } catch (error) {
    console.error('Failed to accept quest:', error)
  }
}

async function claimQuest(questId: QuestId) {
  try {
    await execute('quest/claim', { questId })
  } catch (error) {
    console.error('Failed to claim quest:', error)
  }
}

function close() {
  isOpen.value = false
  emit('close')
}

// Watch for npcId changes to open/close modal
watch(() => props.npcId, (newId) => {
  isOpen.value = !!newId
  if (newId) {
    dialogState.value = 'greeting'
  }
}, { immediate: true })
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.2s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
}
</style>
