<template>
  <Teleport to="body">
    <div
      v-if="showDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      @click.self="close"
    >
      <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-2xl border-2 border-cyan-600/50 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 px-6 py-4 border-b border-cyan-700/50 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <Icon name="lucide:scroll-text" class="h-6 w-6 text-cyan-400" />
            <h2 class="text-xl font-bold text-cyan-300">{{ quest?.title }}</h2>
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
          <!-- Quest Description -->
          <div class="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <p class="text-gray-300 leading-relaxed">{{ quest?.description }}</p>
          </div>

          <!-- Quest Requirements -->
          <div v-if="quest?.requiredLevel" class="flex items-center gap-2 text-sm text-gray-400">
            <Icon name="lucide:star" class="h-4 w-4 text-yellow-400" />
            <span>Yêu cầu: Level {{ quest.requiredLevel }}</span>
          </div>

          <!-- Quest Objectives -->
          <div class="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h3 class="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
              <Icon name="lucide:check-square" class="h-5 w-5" />
              Mục Tiêu
            </h3>
            <ul class="space-y-2">
              <li
                v-for="(objective, index) in quest?.objectives"
                :key="index"
                class="flex items-start gap-2 text-sm text-gray-300"
              >
                <Icon name="lucide:chevron-right" class="h-4 w-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                <span>{{ formatObjective(objective) }}</span>
              </li>
            </ul>
          </div>

          <!-- Quest Rewards -->
          <div v-if="quest?.rewards" class="bg-gray-800/50 rounded-lg p-4 border border-yellow-700/50">
            <h3 class="text-yellow-400 font-semibold mb-3 flex items-center gap-2">
              <Icon name="lucide:gift" class="h-5 w-5" />
              Phần Thưởng
            </h3>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div v-if="quest.rewards.exp" class="flex items-center gap-2 text-purple-400">
                <Icon name="lucide:sparkles" class="h-4 w-4" />
                <span>+{{ quest.rewards.exp }} EXP</span>
              </div>
              <div v-if="quest.rewards.reputation" class="flex items-center gap-2 text-blue-400">
                <Icon name="lucide:star" class="h-4 w-4" />
                <span>+{{ quest.rewards.reputation }} Danh Vọng</span>
              </div>
              <div v-if="quest.rewards.items && quest.rewards.items.length > 0" class="col-span-2">
                <div class="flex flex-wrap gap-2 mt-2">
                  <div
                    v-for="item in quest.rewards.items"
                    :key="item.itemId"
                    class="flex items-center gap-1 bg-gray-700/50 px-2 py-1 rounded text-xs text-gray-300"
                  >
                    <Icon name="lucide:box" class="h-3 w-3" />
                    <span>{{ getItemName(item.itemId) }} x{{ item.quantity }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Already accepted or completed message -->
          <div v-if="alreadyAccepted" class="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-3 text-yellow-300 text-sm flex items-center gap-2">
            <Icon name="lucide:alert-circle" class="h-5 w-5" />
            <span>Bạn đã nhận nhiệm vụ này rồi.</span>
          </div>
          <div v-else-if="alreadyCompleted" class="bg-green-900/30 border border-green-700/50 rounded-lg p-3 text-green-300 text-sm flex items-center gap-2">
            <Icon name="lucide:check-circle" class="h-5 w-5" />
            <span>Bạn đã hoàn thành nhiệm vụ này.</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 bg-gray-800/50 border-t border-gray-700 flex items-center justify-end gap-3">
          <button
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
            @click="close"
          >
            Đóng
          </button>
          <button
            v-if="!alreadyAccepted && !alreadyCompleted && canAccept"
            class="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-md font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            :disabled="isLoading"
            @click="acceptQuest"
          >
            <Icon name="lucide:check" class="h-5 w-5" />
            Nhận Nhiệm Vụ
          </button>
          <div v-else-if="!canAccept" class="text-sm text-red-400 flex items-center gap-2">
            <Icon name="lucide:alert-triangle" class="h-4 w-4" />
            <span>Chưa đủ điều kiện</span>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { items, type ItemId, type QuestId, type QuestTemplate, type QuestObjective } from '~~/shared/config'

const props = defineProps<{
  questId: QuestId | null
  quest: QuestTemplate | null
}>()

const emit = defineEmits<{
  close: []
}>()

const playerStore = usePlayerStore()
const { execute, isLoading } = useGameAction()

const showDialog = computed(() => props.questId !== null && props.quest !== null)

const alreadyAccepted = computed(() => {
  if (!props.questId || !playerStore.character?.activeQuests) return false
  return playerStore.character.activeQuests.some(q => q.questId === props.questId)
})

const alreadyCompleted = computed(() => {
  if (!props.questId || !playerStore.character?.completedQuests) return false
  return playerStore.character.completedQuests.includes(props.questId)
})

const canAccept = computed(() => {
  if (!props.quest || !playerStore.character) return false
  if (props.quest.requiredLevel && playerStore.character.level < props.quest.requiredLevel) {
    return false
  }
  return true
})

function formatObjective(objective: QuestObjective): string {
  const count = (objective as any).count || 1
  
  switch (objective.type) {
    case 'kill':
      return `Tiêu diệt ${count} ${objective.monsterId}`
    case 'gather':
      return `Thu thập ${count} ${getItemName(objective.itemId)}`
    case 'talk':
      return `Nói chuyện với ${objective.npcId}`
    case 'explore':
      return `Khám phá khu vực ${objective.zoneId}`
    default:
      return objective.type
  }
}

function getItemName(itemId: string): string {
  const item = items[itemId as ItemId]
  return item?.name || itemId
}

async function acceptQuest() {
  if (!props.questId) return
  
  await execute('quest/accept', { questId: props.questId })
  close()
}

function close() {
  emit('close')
}
</script>
