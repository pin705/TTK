<template>
  <Teleport to="body">
    <div
      v-if="showDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      @click.self="close"
    >
      <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-2xl border-2 border-green-600/50 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="bg-gradient-to-r from-green-900/50 to-emerald-900/50 px-6 py-4 border-b border-green-700/50 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gradient-to-br from-green-700/40 to-emerald-700/40 rounded-full flex items-center justify-center border-2 border-green-600/50">
              <Icon name="lucide:user" class="h-6 w-6 text-green-300" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-green-300">{{ npcData?.name }}</h2>
              <p v-if="npcData?.role" class="text-xs text-gray-400">{{ npcData.role }}</p>
            </div>
          </div>
          <button
            class="text-gray-400 hover:text-white transition-colors"
            @click="close"
          >
            <Icon name="lucide:x" class="h-6 w-6" />
          </button>
        </div>

        <!-- Content -->
        <div class="flex-grow overflow-y-auto p-6 space-y-4">
          <!-- Greeting -->
          <div class="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div class="flex items-start gap-3">
              <Icon name="lucide:message-square" class="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p class="text-gray-300 leading-relaxed">{{ randomGreeting }}</p>
            </div>
          </div>

          <!-- Available Quests -->
          <div v-if="availableQuests.length > 0" class="space-y-2">
            <h3 class="text-yellow-400 font-semibold flex items-center gap-2">
              <Icon name="lucide:sparkles" class="h-5 w-5" />
              Nhiệm Vụ Mới
            </h3>
            <div
              v-for="questInfo in availableQuests"
              :key="questInfo.id"
              class="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4 hover:bg-yellow-900/30 transition-colors cursor-pointer"
              @click="showQuestDetails(questInfo.id, questInfo.template)"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="flex-grow">
                  <h4 class="text-yellow-300 font-semibold mb-1">{{ questInfo.template.title }}</h4>
                  <p class="text-sm text-gray-400 line-clamp-2">{{ questInfo.template.description }}</p>
                </div>
                <Icon name="lucide:chevron-right" class="h-5 w-5 text-yellow-400 flex-shrink-0" />
              </div>
            </div>
          </div>

          <!-- Completable Quests -->
          <div v-if="completableQuests.length > 0" class="space-y-2">
            <h3 class="text-green-400 font-semibold flex items-center gap-2">
              <Icon name="lucide:check-circle" class="h-5 w-5" />
              Hoàn Thành Nhiệm Vụ
            </h3>
            <div
              v-for="questInfo in completableQuests"
              :key="questInfo.id"
              class="bg-green-900/20 border border-green-700/50 rounded-lg p-4 hover:bg-green-900/30 transition-colors cursor-pointer"
              @click="claimQuest(questInfo.id)"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="flex-grow">
                  <h4 class="text-green-300 font-semibold mb-1">{{ questInfo.template.title }}</h4>
                  <p class="text-sm text-gray-400">Nhấp để nhận phần thưởng</p>
                </div>
                <Icon name="lucide:gift" class="h-5 w-5 text-green-400 flex-shrink-0 animate-bounce" />
              </div>
            </div>
          </div>

          <!-- No quests available -->
          <div v-if="availableQuests.length === 0 && completableQuests.length === 0" class="text-center py-4">
            <Icon name="lucide:inbox" class="h-12 w-12 mx-auto mb-2 text-gray-600" />
            <p class="text-sm text-gray-500 italic">Hiện tại không có nhiệm vụ nào</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 bg-gray-800/50 border-t border-gray-700 flex items-center justify-end gap-3">
          <button
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
            @click="close"
          >
            Tạm Biệt
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Quest Dialog -->
  <GameQuestDialog
    :quest-id="selectedQuestId"
    :quest="selectedQuest"
    @close="closeQuestDialog"
  />
</template>

<script setup lang="ts">
import { npcs, quests, type NpcId, type QuestId, type QuestTemplate } from '~~/shared/config'

const props = defineProps<{
  npcId: NpcId | null
}>()

const emit = defineEmits<{
  close: []
}>()

const playerStore = usePlayerStore()
const { execute, isLoading } = useGameAction()

const showDialog = computed(() => props.npcId !== null)

const npcData = computed(() => {
  if (!props.npcId) return null
  return npcs[props.npcId]
})

const randomGreeting = computed(() => {
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
  playerStore.character.activeQuests.forEach((q: any) => {
    const template = quests[q.questId as QuestId]
    if (template && q.status === 'completed') {
      const lastObjective = template.objectives[template.objectives.length - 1]
      if (lastObjective?.type === 'talk' && (lastObjective as any).npcId === props.npcId) {
        completable.push({ id: q.questId as QuestId, template })
      }
    }
  })
  
  return completable
})

// Quest dialog state
const selectedQuestId = ref<QuestId | null>(null)
const selectedQuest = ref<QuestTemplate | null>(null)

function showQuestDetails(questId: QuestId, quest: QuestTemplate) {
  selectedQuestId.value = questId
  selectedQuest.value = quest
}

function closeQuestDialog() {
  selectedQuestId.value = null
  selectedQuest.value = null
}

async function claimQuest(questId: QuestId) {
  await execute('quest/claim', { questId })
  // Don't close the NPC dialog, just refresh
}

function close() {
  emit('close')
}
</script>
