<template>
  <div
    v-if="mapStore.currentZone"
    class="space-y-4"
  >
    <div>
      <h2 class="text-xl text-cyan-400">
        [ {{ mapStore.currentZone.name }} ]
      </h2>
      <p class="text-sm text-gray-300 mt-1 whitespace-pre-wrap">
        {{ mapStore.currentZone.description }}
      </p>
    </div>

    <div>
      <h3 class="text-red-500 font-semibold">
        [Sinh Vật Nguy Hiểm]
      </h3>
      <p
        v-if="!mapStore.currentZone.monsters?.length"
        class="pl-2 text-sm text-gray-500 italic"
      >
        - Môi trường an toàn -
      </p>
      <ul
        v-else
        class="space-y-3 mt-2"
      >
        <li
          v-for="monster in mapStore.currentZone.monsters"
          :key="monster.id"
          class="p-2 bg-gray-900/50 rounded border border-gray-700 flex items-center justify-between"
        >
          <div class="flex-grow pr-4">
            <div class="flex justify-between items-baseline">
              <span class="font-semibold text-red-400">{{ monster.name }}</span>
              <span class="text-xs text-gray-400">Cấp {{ monster.level }}</span>
            </div>
            <div class="w-full bg-red-900/50 rounded-full h-1.5 mt-1">
              <div
                class="bg-red-500 h-1.5 rounded-full"
                :style="{ width: `${(monster.hp / monster.maxHp) * 100}%` }"
              />
            </div>
          </div>
          <button
            class="bg-red-800/50 hover:bg-red-700/50 px-3 py-1 rounded text-xs text-white flex-shrink-0"
            :disabled="isLoading"
            @click="initiateCombat(monster.id)"
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
