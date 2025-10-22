<template>
  <div v-if="playerStore.character" class="space-y-3">
    <div class="text-center">
      <h2 class="text-xl text-white font-bold">{{ playerStore.character.name }}</h2>
      <p class="text-yellow-400 text-sm">{{ playerStore.character.cultivationStage }}</p>
    </div>

    <div>
      <span class="text-sm text-red-400">HP</span>
      <div class="w-full bg-gray-700 rounded-full h-2.5">
        <div class="bg-red-600 h-2.5 rounded-full" :style="{ width: hpPercent + '%' }"></div>
      </div>
      <p class="text-xs text-right">{{ playerStore.character.hp }} / {{ playerStore.character.hpMax }}</p>
    </div>

    <div>
      <span class="text-sm text-blue-400">Năng Lượng</span>
      <div class="w-full bg-gray-700 rounded-full h-2.5">
        <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: energyPercent + '%' }"></div>
      </div>
      <p class="text-xs text-right">{{ playerStore.character.energy }} / {{ playerStore.character.energyMax }}</p>
    </div>

    <div class="text-center border-t border-green-700/50 pt-2">
        <p class="text-sm text-gray-400">Đang ở:</p>
        <p class="text-cyan-400">{{ mapStore.currentZone?.name }}</p>
     </div>
  </div>
</template>

<script setup lang="ts">
const playerStore = usePlayerStore();
const mapStore = useMapStore();

const hpPercent = computed(() => {
  if (!playerStore.character) return 0;
  return (playerStore.character.hp / playerStore.character.hpMax) * 100;
});
const energyPercent = computed(() => {
  if (!playerStore.character) return 0;
  return (playerStore.character.energy / playerStore.character.energyMax) * 100;
});
</script>
