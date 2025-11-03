<template>
  <div
    v-if="npcsInZoneDetails.length > 0"
    class="p-3 bg-gray-900/50 rounded-lg border border-green-700/50 shadow-inner mt-3 space-y-3"
  >
    <h3 class="text-green-400 font-semibold flex items-center gap-2">
      <Icon
        name="lucide:users"
        class="h-4 w-4 text-green-500"
      />
      Nhân Vật Tương Tác
    </h3>

    <ul class="space-y-2">
      <li
        v-for="npc in npcsInZoneDetails"
        :key="npc.npcId"
        class="p-3 bg-gradient-to-r from-gray-800/60 to-gray-900/60 rounded-md border border-gray-700/80 flex items-center justify-between hover:border-green-600/70 hover:shadow-md transition-all duration-200 group"
      >
        <div class="flex items-center space-x-3 overflow-hidden">
          <!-- NPC Avatar/Icon -->
          <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-700/40 to-emerald-700/40 rounded-full flex items-center justify-center border-2 border-green-600/50">
            <Icon
              name="lucide:user"
              class="text-green-300 h-5 w-5"
            />
          </div>

          <!-- NPC Info -->
          <div class="flex-grow overflow-hidden">
            <span
              class="font-semibold text-green-300 group-hover:text-green-100 text-sm truncate block"
              :title="npc.name"
            >
              {{ npc.name }}
            </span>

            <!-- Quest Status Badge -->
            <div v-if="npc.hasCompletableQuest" class="mt-1">
              <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-green-900/50 border border-green-600/50 rounded-full text-xs text-green-400 animate-pulse">
                <Icon name="lucide:check-circle-2" class="h-3 w-3" />
                Có thể trả N.Vụ
              </span>
            </div>
            <div v-else-if="npc.hasAvailableQuest" class="mt-1">
              <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-900/50 border border-yellow-600/50 rounded-full text-xs text-yellow-400">
                <Icon name="lucide:sparkles" class="h-3 w-3" />
                Nhiệm vụ mới
              </span>
            </div>
            <span
              v-else
              class="text-xs text-gray-500 italic mt-1 block"
            >
              Có thể trò chuyện
            </span>
          </div>
        </div>

        <button
          class="bg-gradient-to-r from-blue-700/70 to-blue-800/70 hover:from-blue-600/70 hover:to-blue-700/70 px-3 py-2 rounded-md text-xs text-blue-100 flex-shrink-0 border border-blue-600/50 flex items-center gap-1.5 transition-all hover:scale-105 disabled:opacity-50"
          :disabled="isLoading"
          title="Nói chuyện"
          @click="talkToNpc(npc.npcId)"
        >
          <Icon
            name="lucide:message-circle"
            class="h-4 w-4"
          />
          <span class="hidden sm:inline font-medium">Nói Chuyện</span>
        </button>
      </li>
    </ul>
  </div>
  <div
    v-else
    class="p-3 bg-gray-900/50 rounded-lg border border-gray-700/50 mt-3 text-center"
  >
    <Icon
      name="lucide:user-x"
      class="h-8 w-8 mx-auto mb-2 text-gray-600"
    />
    <p class="text-sm text-gray-500 italic">Không có NPC nào trong khu vực này</p>
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
