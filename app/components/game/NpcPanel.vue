<template>
  <div
    v-if="npcsInZoneDetails.length > 0"
    class="border-t border-cyan-700/30 pt-3 mt-3"
  >
    <h3 class="text-green-400 font-semibold mb-2 flex items-center gap-1.5">
      <Icon
        name="lucide:users"
        class="h-4 w-4 text-green-500"
      /> [ Nhân Vật Tương Tác ]
    </h3>
    <ul class="space-y-2 grid grid-cols-3">
      <li
        v-for="npc in npcsInZoneDetails"
        :key="npc.npcId"
        class="p-2 bg-gray-800/60 rounded border border-gray-700/80 flex items-center justify-between hover:border-green-600/70 transition-colors duration-200 group"
      >
        <div class="flex items-center">
          <span class="mr-2 text-lg flex-shrink-0 w-5 text-center">

            <div
             v-if="npc.hasCompletableQuest">
 <Icon
              name="lucide:check-circle"
              class="text-green-400 animate-pulse"
              title="Có nhiệm vụ để trả"
            />
            Có nhiệm vụ để trả
            </div>

            <div v-else-if="npc.hasAvailableQuest">
              <Icon
                name="lucide:message-square-plus"
                class="text-yellow-400"
                title="Có nhiệm vụ mới"
              />
              Có nhiệm vụ mới
            </div>
            <!-- <Icon
              v-else
              name="lucide:user"
              class="text-gray-500"
              title="NPC thông thường"
            /> -->
          </span>
          <span class="font-medium text-green-300 group-hover:text-green-200">{{ npc.name }}</span>
        </div>
        <button
          class="bg-blue-800/60 hover:bg-blue-700/70 px-3 py-1 rounded text-xs text-blue-100 flex-shrink-0 border border-blue-700/50"
          :disabled="isLoading"
          title="Nói chuyện"
          @click="talkToNpc(npc.npcId)"
        >
          <Icon name="lucide:message-circle" />
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useMapStore } from '~/stores/map'
import { usePlayerStore } from '~/stores/player'
import { useGameAction } from '~/composables/useGameAction'
import { npcs, quests, type NpcId, type QuestId } from '~~/shared/config' // Import configs
import { Icon } from '#components'

const { execute, isLoading } = useGameAction()
const mapStore = useMapStore()
const playerStore = usePlayerStore()

// Lấy thông tin chi tiết NPC và trạng thái quest của họ
const npcsInZoneDetails = computed(() => {
  const currentZoneNpcs = mapStore.currentZone?.npcs || []
  const character = playerStore.character
  if (!character) return []

  return currentZoneNpcs.map((zoneNpc) => {
    const npcData = npcs[zoneNpc.npcId as NpcId]
    if (!npcData) return null

    // Kiểm tra có nhiệm vụ mới không
    const hasAvailableQuest = Object.entries(quests).some(([id, quest]) => {
      const questId = id as QuestId
      console.log('character.level >= quest.requiredLevel', character.level, quest.requiredLevel)
      return quest.npcId === zoneNpc.npcId
        && (!quest.requiredLevel || character.level >= quest.requiredLevel) // Cần thêm character.level
        && !character.activeQuests.some(q => q.questId === questId)
        && (quest.isRepeatable || !character.completedQuests.includes(questId))
    })

    // Kiểm tra có nhiệm vụ để trả không
    const hasCompletableQuest = character.activeQuests.some((q) => {
      const template = quests[q.questId as QuestId]
      if (q.status !== 'completed' || !template) return false
      const lastObjective = template.objectives[template.objectives.length - 1]
      return lastObjective?.type === 'talk' && lastObjective.npcId === zoneNpc.npcId
    })

    return {
      npcId: zoneNpc.npcId,
      name: npcData.name,
      hasAvailableQuest,
      hasCompletableQuest
    }
  }).filter(Boolean) // Lọc bỏ NPC không tìm thấy data
})

async function talkToNpc(npcId: string) {
  await execute('npc/talk', { npcId })
}
</script>
