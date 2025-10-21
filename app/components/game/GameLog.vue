<template>
  <div class="h-full flex flex-col">
    <h2 class="text-lg text-gray-400 border-b border-gray-600/50 pb-1 mb-2">
      [ Log Hệ Thống ]
    </h2>
    <div class="flex-grow overflow-y-auto space-y-1 pr-2">
      <p v-for="(log, index) in logs" :key="index" :class="log.type === 'error' ? 'text-red-500' : 'text-gray-300'">
        > {{ log.message }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { logs } = useGameLog()
</script>
