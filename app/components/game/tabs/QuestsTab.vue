<template>
  <div
    v-if="playerStore.character"
    class="space-y-4"
  >
    <h3 class="text-lime-400 border-b border-lime-700/50 pb-1">
      Nhiệm Vụ Đang Nhận
    </h3>
    <div
      v-if="!playerStore.character.activeQuests.length"
      class="text-gray-500"
    >
      Bạn chưa nhận nhiệm vụ nào.
    </div>
    <div
      v-for="quest in activeQuestsDetails"
      :key="quest.questId"
      class="p-2 bg-gray-900/50 rounded"
    >
      <p class="font-bold text-white">
        {{ quest.title }}
      </p>
      <ul class="pl-4 text-sm mt-1">
        <li
          v-for="(obj, i) in quest.objectives"
          :key="i"
        >
          - {{ obj.description }}: {{ obj.current }} / {{ obj.count }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { quests } from '~~/shared/config'

const playerStore = usePlayerStore()

const activeQuestsDetails = computed(() => {
  return playerStore.character?.activeQuests.map((q) => {
    const questTemplate = quests[q.questId as keyof typeof quests]
    return {
      ...q,
      title: questTemplate.title,
      objectives: q.objectives.map((obj, i) => ({
        ...obj,
        description: questTemplate.objectives[i].description
      }))
    }
  }) || []
})
</script>
