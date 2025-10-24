<template>
  <div
    v-if="npcsInZoneDetails.length > 0"
    class="border-t border-cyan-700/30 pt-3 mt-3"
  >
    <h3 class="text-green-400 font-semibold mb-2 flex items-center gap-1.5 text-base">
      <Icon
        name="lucide:users"
        class="h-4 w-4 text-green-500"
      /> [ Nhân Vật Tương Tác ]
    </h3>

    <ul class="space-y-2">
      <li
        v-for="npc in npcsInZoneDetails"
        :key="npc.npcId"
        class="p-2 bg-gray-800/60 rounded-md border border-gray-700/80 flex items-center justify-between hover:border-green-600/70 transition-colors duration-200 group"
      >
        <div class="flex items-center space-x-3 overflow-hidden">
          <span class="flex-shrink-0 w-6 text-center">
            <Icon
              name="lucide:user"
              class="text-gray-400 h-5 w-5"
            />
          </span>

          <div class="flex-grow overflow-hidden">
            <span
              class="font-medium text-green-300 group-hover:text-green-100 text-sm truncate block"
              :title="npc.name"
            >
              {{ npc.name }}
            </span>
            <span
              v-if="npc.hasCompletableQuest"
              class="text-xs text-green-400 flex items-center gap-1 animate-pulse"
              title="Có nhiệm vụ để trả"
            >
              <Icon
                name="lucide:check-circle"
                class="h-3.5 w-3.5"
              /> Có thể trả N.Vụ
            </span>
            <span
              v-else-if="npc.hasAvailableQuest"
              class="text-xs text-yellow-400 flex items-center gap-1"
              title="Có nhiệm vụ mới"
            >
              <Icon
                name="lucide:message-square-plus"
                class="h-3.5 w-3.5"
              /> Nhiệm vụ mới
            </span>
            <span
              v-else
              class="text-xs text-gray-500 italic"
            >
              (Không có nhiệm vụ)
            </span>
          </div>
        </div>

        <button
          class="bg-blue-800/60 hover:bg-blue-700/70 px-2.5 py-1 rounded text-xs text-blue-100 flex-shrink-0 border border-blue-700/50 flex items-center gap-1 transition-all"
          :disabled="isLoading"
          title="Nói chuyện"
          @click="talkToNpc(npc.npcId)"
        >
          <Icon
            name="lucide:message-circle"
            class="h-3.5 w-3.5"
          />
          <span class="hidden sm:inline">Nói</span>
        </button>
      </li>
    </ul>
  </div>
  <div
    v-else
    class="border-t border-cyan-700/30 pt-3 mt-3 text-sm text-gray-500 italic px-2"
  >
    <Icon
      name="lucide:user-x"
      class="inline-block mr-1 h-4 w-4"
    /> Không có NPC nào trong khu vực này.
  </div>
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

async function talkToNpc(npcId: string) { await execute('npc/talk', { npcId }) }
</script>
