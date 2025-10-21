<template>
  <div v-if="playerStore.character" class="space-y-2">
    <h2 class="text-lg text-blue-300 border-b border-blue-700/50 pb-1">
      [ Túi Đồ ]
    </h2>
    <div v-if="!playerStore.character.inventory.length" class="text-gray-500">
      Túi đồ trống.
    </div>
    <ul v-else class="space-y-1">
      <li v-for="item in playerStore.character.inventory" :key="item.itemId">
        <span class="text-cyan-400">{{ item.itemId }}</span> x {{ item.quantity }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const playerStore = usePlayerStore()
</script>
