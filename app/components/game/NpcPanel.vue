<template>
  <div
    v-if="npcsInZoneDetails.length > 0"
    class="p-3 bg-gray-900/50 border border-green-700/50 shadow-inner mt-3 space-y-3 font-mono"
  >
    <h3 class="text-green-400 font-bold uppercase tracking-wider">
      > NHÂN VẬT TƯƠNG TÁC
    </h3>

    <ul class="space-y-2">
      <li
        v-for="npc in npcsInZoneDetails"
        :key="npc.npcId"
        class="p-2 bg-gradient-to-r from-gray-800/60 to-gray-900/60 border border-gray-700/80 flex items-center justify-between hover:border-green-600/70 transition-all duration-200"
      >
        <div class="flex items-center space-x-3 overflow-hidden">
          <!-- NPC Info -->
          <div class="flex-grow overflow-hidden">
            <span
              class="font-bold text-green-300 text-sm truncate block"
              :title="npc.name"
            >
              ▸ {{ npc.name }}
            </span>

            <!-- Quest Status Badge -->
            <div v-if="npc.hasCompletableQuest" class="mt-1">
              <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-green-900/50 border border-green-600/50 text-xs text-green-400">
                [ ✓ HOÀN THÀNH ]
              </span>
            </div>
            <div v-else-if="npc.hasAvailableQuest" class="mt-1">
              <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-900/50 border border-yellow-600/50 text-xs text-yellow-400">
                [ ! NHIỆM VỤ ]
              </span>
            </div>
            <span
              v-else
              class="text-xs text-gray-500 italic mt-1 block"
            >
              [ Trò chuyện ]
            </span>
          </div>
        </div>

        <button
          class="bg-gradient-to-r from-blue-700/70 to-blue-800/70 hover:from-blue-600/70 hover:to-blue-700/70 px-3 py-1.5 text-xs text-blue-100 flex-shrink-0 border border-blue-600/50 transition-all disabled:opacity-50 uppercase font-bold"
          :disabled="isLoading"
          @click="openNpcDialog(npc)"
        >
          [ NÓI ]
        </button>
      </li>
    </ul>
  </div>
  <div
    v-else
    class="p-3 bg-gray-900/50 border border-gray-700/50 mt-3 text-center font-mono"
  >
    <p class="text-sm text-gray-500 italic">[ KHÔNG CÓ NPC NÀO TRONG KHU VỰC NÀY ]</p>
  </div>

  <!-- NPC Dialog Modal -->
  <GameNpcDialog
    :is-open="showNpcDialog"
    :npc="selectedNpc"
    @close="showNpcDialog = false"
    @talk="handleTalk"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMapStore } from '~/stores/map'
import { usePlayerStore } from '~/stores/player'
import { useGameAction } from '~/composables/useGameAction'
import { npcs, quests, type NpcId, type QuestId } from '~~/shared/config' // Import configs

const { execute, isLoading } = useGameAction()
const mapStore = useMapStore()
const playerStore = usePlayerStore()

// Logic tính toán npcsInZoneDetails giữ nguyên như trước
const npcsInZoneDetails = computed(() => {
  const currentZoneNpcs = mapStore.currentZone?.npcs || []
  const character = playerStore.character
  if (!character) return []

  return currentZoneNpcs.map((zoneNpc) => {
    const npcData = npcs[zoneNpc.npcId as NpcId]
    if (!npcData) return null

    const hasAvailableQuest = Object.entries(quests).some(([id, quest]) => {
      const questId = id as QuestId
      console.log('character.level >= quest.requiredLevel', character.level, quest.requiredLevel)
      return quest.npcId === zoneNpc.npcId
        && (!quest.requiredLevel || character.level >= quest.requiredLevel) // Cần thêm character.level
        && !character.activeQuests.some(q => q.questId === questId)
        && (quest.isRepeatable || !character.completedQuests.includes(questId))
    })

    const hasCompletableQuest = character.activeQuests.some((q) => {
      const template = quests[q.questId as QuestId]
      if (q.status !== 'completed' || !template) return false
      const lastObjective = template.objectives[template.objectives.length - 1]
      return lastObjective?.type === 'talk' && lastObjective.npcId === zoneNpc.npcId
    })

    // Tooltip vẫn giữ lại cho desktop
    let questStatusTitle = npcData.name
    if (hasCompletableQuest) questStatusTitle = `${npcData.name} (Có nhiệm vụ để trả)`
    else if (hasAvailableQuest) questStatusTitle = `${npcData.name} (Có nhiệm vụ mới)`

    return {
      npcId: zoneNpc.npcId,
      name: npcData.name,
      hasAvailableQuest,
      hasCompletableQuest,
      questStatusTitle
    }
  }).filter(npc => npc !== null)
})

const showNpcDialog = ref(false)
const selectedNpc = ref(null)

function openNpcDialog(npc: any) {
  selectedNpc.value = npc
  showNpcDialog.value = true
}

async function handleTalk(npcId: string) {
  await execute('npc/talk', { npcId })
  showNpcDialog.value = false
}
</script>
