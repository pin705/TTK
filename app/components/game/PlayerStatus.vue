<template>
  <div v-if="playerStore.character" class="space-y-2">
    <h2 class="text-lg text-green-300 border-b border-green-700/50 pb-1">
      [ Trạng Thái ]
    </h2>
    <p><strong>Nhân vật:</strong> <span class="text-white">{{ playerStore.character.name }}</span></p>
    <p><strong>HP:</strong> <span class="text-red-500">{{ playerStore.character.hp }} / {{ playerStore.character.hpMax }}</span></p>
    <p><strong>Năng lượng:</strong> <span class="text-blue-500">{{ playerStore.character.energy }} / {{ playerStore.character.energyMax }}</span></p>
    <p><strong>Cảnh giới:</strong> <span class="text-yellow-400">{{ playerStore.character.cultivationStage }}</span></p>
    <p><strong>Tu vi:</strong> <span class="text-purple-400">{{ playerStore.character.cultivationExp }} EXP</span></p>
  </div>
</template>

<script setup lang="ts">
const playerStore = usePlayerStore()
</script>
