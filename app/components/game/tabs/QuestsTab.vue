<template>
  <div
    v-if="playerStore.character"
    class="space-y-3 text-sm font-mono"
  >
    <h3 class="text-lime-400 border-b border-lime-700/50 pb-1 font-bold uppercase tracking-wider">
      > NHIỆM VỤ HIỆN TẠI
    </h3>
    <div
      v-if="!activeQuestsDetails.length"
      class="text-gray-500 italic px-2 text-center py-4 border border-gray-700/50"
    >
      [ CHƯA CÓ NHIỆM VỤ ]<br />
      <span class="text-xs">Thử nói chuyện với NPC xem sao</span>
    </div>

    <div
      v-for="quest in activeQuestsDetails"
      :key="quest.questId"
      class="p-3 bg-gradient-to-br from-gray-900/70 to-gray-800/70 border-2 shadow-lg space-y-2 transition-all"
      :class="quest.status === 'completed' ? 'border-green-600/70 bg-green-900/10' : 'border-gray-700/80'"
    >
      <div class="flex justify-between items-start gap-3">
        <div class="flex-grow">
          <div class="flex items-center gap-2 mb-1">
            <span
              :class="questTypeColor(quest.type)"
              class="text-xs font-bold px-2 py-0.5 border uppercase"
              :style="{ borderColor: 'currentColor', backgroundColor: 'rgba(0,0,0,0.3)' }"
            >[ {{ questTypeText(quest.type) }} ]</span>
            <span class="font-bold text-white">{{ quest.title }}</span>
          </div>
          <p
            v-if="quest.giverName"
            class="text-xs text-gray-400"
          >
            > Người giao: {{ quest.giverName }}
          </p>
        </div>
        <button
          v-if="quest.status === 'completed'"
          class="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-3 py-2 text-xs font-bold border-2 border-green-500 shadow-lg transition-all uppercase tracking-wider"
          :disabled="isLoading"
          :title="`Trả nhiệm vụ cho ${quest.turnInNpcName || 'NPC'}`"
          @click="claimQuest(quest.questId)"
        >
          [ HOÀN THÀNH ]
        </button>
      </div>

      <p class="text-sm text-gray-300 leading-relaxed italic">
        {{ quest.description }}
      </p>

      <div class="pt-2 border-t border-gray-700/50">
        <p class="text-xs text-gray-400 mb-2 font-bold uppercase">TIẾN ĐỘ:</p>
        <ul class="space-y-1">
          <li
            v-for="(obj, i) in quest.objectives"
            :key="i"
            class="flex items-center justify-between p-2 text-xs"
            :class="obj.current >= obj.count ? 'bg-green-900/30 border border-green-700/50' : 'bg-gray-800/50 border border-gray-700/50'"
          >
            <div class="flex items-center gap-2 flex-grow">
              <span
                class="flex-shrink-0 font-bold"
                :class="obj.current >= obj.count ? 'text-green-400' : 'text-gray-400'"
              >
                {{ objectivePrefix(obj.type) }}
              </span>
              <span
                :class="obj.current >= obj.count ? 'text-green-300 font-medium' : 'text-gray-300'"
              >
                {{ obj.description }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span
                class="font-mono font-semibold"
                :class="obj.current >= obj.count ? 'text-green-400' : 'text-gray-400'"
              >
                {{ obj.current }}/{{ obj.count }}
              </span>
              <span
                v-if="obj.current >= obj.count"
                class="text-green-500 font-bold"
              >
                ✓
              </span>
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
function objectivePrefix(type: string): string {
  switch (type) {
    case 'kill': return '⚔'
    case 'gather': return '◆'
    case 'talk': return '▸'
    case 'explore': return '◎'
    default: return '•'
  }
}

// --- Hành động ---
async function claimQuest(questId: string) {
  await execute('quest/claim', { questId })
}
</script>
