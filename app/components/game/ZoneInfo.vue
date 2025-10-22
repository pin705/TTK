<template>
  <div v-if="mapStore.currentZone" class="space-y-3">
    <div>
      <h3 class="text-red-500">[Quái vật]</h3>
      <p v-if="!mapStore.currentZone.monsters?.length" class="pl-4 text-gray-500">
        Không có mối nguy hiểm nào.
      </p>
      <ul v-else class="pl-4 space-y-2">
        <li v-for="monsterEntry in mapStore.currentZone.monsters" :key="monsterEntry.monsterId._id" class="flex items-center justify-between">
          <span>👾 <span class="text-red-400">{{ monsterEntry.monsterId.name }}</span> (Cấp {{ monsterEntry.monsterId.level }})</span>
          <button
            class="bg-red-800/50 hover:bg-red-700/50 px-3 py-1 rounded text-xs"
            :disabled="isLoading"
            @click="initiateCombat(monsterEntry.monsterId._id)"
          >
            Tấn công
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const mapStore = useMapStore()
const { execute, isLoading } = useGameAction()

async function initiateCombat(monsterId: string) {
  await execute('combat/initiate', { monsterId })
}
</script>
