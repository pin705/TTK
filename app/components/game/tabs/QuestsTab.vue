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
      class="p-4 bg-gradient-to-br from-gray-900/70 to-gray-800/70 rounded-lg border-2 shadow-lg space-y-3 transition-all hover:shadow-xl"
      :class="quest.status === 'completed' ? 'border-green-600/70 bg-green-900/10' : 'border-gray-700/80'"
    >
      <div class="flex justify-between items-start gap-3">
        <div class="flex-grow">
          <div class="flex items-center gap-2 mb-1">
            <span
              :class="questTypeColor(quest.type)"
              class="text-xs font-bold px-2 py-0.5 rounded border"
              :style="{ borderColor: 'currentColor', backgroundColor: 'rgba(0,0,0,0.3)' }"
            >{{ questTypeText(quest.type) }}</span>
            <span class="font-bold text-white text-base">{{ quest.title }}</span>
          </div>
          <p
            v-if="quest.giverName"
            class="text-xs text-gray-400 flex items-center gap-1"
          >
            <Icon name="lucide:user" class="h-3 w-3" />
            Người giao: {{ quest.giverName }}
          </p>
        </div>
        <button
          v-if="quest.status === 'completed'"
          class="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-3 py-2 rounded-md text-xs font-semibold border-2 border-green-500 animate-pulse shadow-lg flex items-center gap-1.5 transition-all hover:scale-105"
          :disabled="isLoading"
          :title="`Trả nhiệm vụ cho ${quest.turnInNpcName || 'NPC'}`"
          @click="claimQuest(quest.questId)"
        >
          <Icon name="lucide:gift" class="h-4 w-4" />
          Hoàn Thành
        </button>
      </div>

      <p class="text-sm text-gray-300 leading-relaxed italic">
        {{ quest.description }}
      </p>

      <div class="pt-2 border-t border-gray-700/50">
        <p class="text-xs text-gray-400 mb-2 font-semibold">Tiến độ:</p>
        <ul class="space-y-2">
          <li
            v-for="(obj, i) in quest.objectives"
            :key="i"
            class="flex items-center justify-between p-2 rounded-md"
            :class="obj.current >= obj.count ? 'bg-green-900/30 border border-green-700/50' : 'bg-gray-800/50 border border-gray-700/50'"
          >
            <div class="flex items-center gap-2 flex-grow">
              <Icon
                :name="objectiveIcon(obj.type)"
                class="h-4 w-4 flex-shrink-0"
                :class="obj.current >= obj.count ? 'text-green-400' : 'text-gray-400'"
              />
              <span
                class="text-sm"
                :class="obj.current >= obj.count ? 'text-green-300 font-medium' : 'text-gray-300'"
              >
                {{ obj.description }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span
                class="font-mono text-sm font-semibold"
                :class="obj.current >= obj.count ? 'text-green-400' : 'text-gray-400'"
              >
                {{ obj.current }} / {{ obj.count }}
              </span>
              <Icon
                v-if="obj.current >= obj.count"
                name="lucide:check-circle-2"
                class="h-5 w-5 text-green-500"
              />
            </div>
          </li>
        </ul>
      </div>

      <div v-if="quest.turnInNpcName && quest.status === 'completed'" class="pt-2 flex items-center gap-2 text-xs text-green-400">
        <Icon name="lucide:arrow-right" class="h-3 w-3" />
        <span>Quay lại gặp <strong>{{ quest.turnInNpcName }}</strong> để nhận thưởng</span>
      </div>
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
