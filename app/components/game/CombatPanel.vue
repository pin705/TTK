<template>
  <div
    v-if="playerStore.character?.inCombat"
    class="space-y-3"
  >
    <h2 class="text-2xl text-red-400 animate-pulse text-center">
      !!! CHIẾN ĐẤU !!!
    </h2>

    <div class="text-center">
      <p class="text-lg text-red-300">
        {{ playerStore.character.combat.monsterName }}
      </p>
      <p>HP: <span class="text-white">{{ playerStore.character.combat.monsterHp }}</span></p>
    </div>

    <div class="text-center mt-4">
      <p>HP CỦA BẠN: <span class="text-green-300">{{ playerStore.character.hp }} / {{ playerStore.character.hpMax }}</span></p>
    </div>

    <div class="flex justify-center gap-4 pt-4">
      <button
        class="bg-red-800 hover:bg-red-700 px-6 py-2 rounded-lg text-lg"
        :disabled="isLoading"
        @click="performAttack"
      >
        Tấn Công
      </button>
      <button class="bg-gray-700 px-6 py-2 rounded-lg text-lg opacity-50 cursor-not-allowed">
        Kỹ Năng
      </button>
      <button class="bg-blue-800 hover:bg-blue-700 px-6 py-2 rounded-lg text-lg">
        Bỏ Chạy
      </button>
    </div>
    <p
      v-if="isLoading"
      class="text-sm text-center text-gray-400 animate-pulse"
    >
      Đang xử lý...
    </p>
  </div>
</template>

<script setup lang="ts">
const playerStore = usePlayerStore()
const { execute, isLoading } = useGameAction()

async function performAttack() {
  await execute('combat/attack')
}
</script>
