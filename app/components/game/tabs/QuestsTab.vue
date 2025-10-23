<template>
  <div
    v-if="playerStore.character"
    class="space-y-4 text-sm"
  >
    <h3 class="text-lime-400 border-b border-lime-700/50 pb-1 font-semibold flex items-center">
      <Icon
        name="lucide:scroll-text"
        class="mr-2 h-4 w-4 text-lime-500"
      /> Nhiệm Vụ Hiện Tại
    </h3>
    <div
      v-if="!activeQuestsDetails.length"
      class="text-gray-500 italic px-2"
    >
      <Icon
        name="lucide:folder-open"
        class="inline-block mr-1 h-4 w-4"
      /> Bạn chưa nhận nhiệm vụ nào. Thử nói chuyện với NPC xem sao.
    </div>

    <div
      v-for="quest in activeQuestsDetails"
      :key="quest.questId"
      class="p-3 bg-gray-900/60 rounded-lg border border-gray-700/80 shadow-inner space-y-1"
    >
      <div class="flex justify-between items-start">
        <div>
          <span
            :class="questTypeColor(quest.type)"
            class="text-xs font-bold mr-1"
          >[{{ questTypeText(quest.type) }}]</span>
          <span class="font-semibold text-white">{{ quest.title }}</span>
          <span
            v-if="quest.giverName"
            class="text-xs text-gray-400 ml-1"
          >(Từ: {{ quest.giverName }})</span>
        </div>
        <button
          v-if="quest.status === 'completed'"
          class="bg-green-600/50 hover:bg-green-500/60 text-green-100 px-2 py-0.5 rounded text-xs border border-green-500/50 animate-pulse"
          :disabled="isLoading"
          :title="`Trả nhiệm vụ cho ${quest.turnInNpcName || 'NPC'}`"
        >
          @click="claimQuest(quest.questId)"
          >
          <Icon
            name="lucide:gift"
            class="inline-block mr-1 h-3 w-3"
          /> Hoàn Thành
          <span
            v-if="quest.turnInNpcName"
            class="text-gray-300 text-[10px]"
          >({{ quest.turnInNpcName }})</span>
        </button>
      </div>
      <p class="text-xs text-gray-400 italic pl-1">
        {{ quest.description }}
      </p>
      <ul class="pl-3 text-xs space-y-0.5 pt-1">
        <li
          v-for="(obj, i) in quest.objectives"
          :key="i"
          :class="obj.current >= obj.count ? 'text-green-400' : 'text-gray-300'"
        >
          <Icon
            :name="objectiveIcon(obj.type)"
            class="inline-block mr-1 h-3.5 w-3.5 -mt-px"
            :class="obj.current >= obj.count ? 'text-green-500' : 'text-gray-500'"
          />
          {{ obj.description }}:
          <span class="font-mono ml-1">{{ obj.current }} / {{ obj.count }}</span>
          <Icon
            v-if="obj.current >= obj.count"
            name="lucide:check-circle"
            class="inline-block ml-1 h-3.5 w-3.5 text-green-500"
          />
        </li>
      </ul>
    </div>
  </div>
  <div
    v-else
    class="p-3 text-center text-gray-500 italic"
  >
    Đang tải dữ liệu nhiệm vụ...
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '~/stores/player'
import { npcs, quests, type NpcId, type QuestId, type QuestType } from '~~/shared/config' // Import thêm QuestType
import { Icon } from '#components'
import { useGameAction } from '~/composables/useGameAction'

const playerStore = usePlayerStore()
const { execute, isLoading } = useGameAction()

const activeQuestsDetails = computed(() => {
  return playerStore.character?.activeQuests.map((q) => {
    const questTemplate = quests[q.questId as QuestId]
    if (!questTemplate) return null // Bỏ qua nếu template không tồn tại
    const giverName = questTemplate.npcId ? npcs[questTemplate.npcId as NpcId]?.name : null
    // Lấy tên NPC trả (từ mục tiêu cuối cùng nếu là 'talk')
    let turnInNpcName: string | null = null
    const lastObjective = questTemplate.objectives[questTemplate.objectives.length - 1]
    if (lastObjective?.type === 'talk') {
      turnInNpcName = npcs[lastObjective.npcId as NpcId]?.name || null
    }

    return {
      ...q,
      title: questTemplate.title,
      giverName,
      turnInNpcName,
      description: questTemplate.description,
      type: questTemplate.type,
      objectives: q.objectives.map((obj, i) => ({
        ...obj,
        description: questTemplate.objectives[i]?.description || 'Mục tiêu không xác định' // Thêm fallback
      }))
    }
  }).filter(Boolean) || [] // Lọc bỏ các quest null
})

// --- Hàm tiện ích hiển thị ---
function questTypeText(type: QuestType): string {
  switch (type) {
    case 'main': return 'Chính Tuyến'
    case 'side': return 'Nhiệm Vụ Phụ'
    case 'daily': return 'Hàng Ngày'
    default: return 'Khác'
  }
}
function questTypeColor(type: QuestType): string {
  switch (type) {
    case 'main': return 'text-yellow-400'
    case 'side': return 'text-blue-400'
    case 'daily': return 'text-green-400'
    default: return 'text-gray-400'
  }
}
function objectiveIcon(type: string): string {
  switch (type) {
    case 'kill': return 'lucide:swords'
    case 'gather': return 'lucide:hand-coins'
    case 'talk': return 'lucide:message-circle'
    case 'explore': return 'lucide:map'
    default: return 'lucide:radio-tower'
  }
}

// --- Hành động ---
async function claimQuest(questId: string) {
  await execute('quest/claim', { questId })
}
</script>
