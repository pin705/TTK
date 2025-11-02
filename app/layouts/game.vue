<template>
  <div class="bg-black text-green-400 min-h-screen flex flex-col">
    <!-- Top Navigation Bar -->
    <div class="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-cyan-700/50 px-4 py-2 flex items-center justify-between flex-shrink-0 shadow-lg">
      <div class="flex items-center gap-3">
        <Icon name="lucide:hexagon" class="h-6 w-6 text-cyan-400 animate-pulse" />
        <h1 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400 uppercase tracking-wider hidden sm:block">
          Tinh Không Đạo Lộ
        </h1>
      </div>
      
      <!-- Quick Stats -->
      <div v-if="playerStore.character" class="flex items-center gap-4 text-sm">
        <div class="flex items-center gap-1.5 px-2 py-1 bg-red-900/30 rounded border border-red-700/50">
          <Icon name="lucide:heart" class="h-4 w-4 text-red-500" />
          <span class="text-red-300 font-semibold">{{ playerStore.character.hp }}/{{ playerStore.character.hpMax }}</span>
        </div>
        <div class="flex items-center gap-1.5 px-2 py-1 bg-blue-900/30 rounded border border-blue-700/50">
          <Icon name="lucide:zap" class="h-4 w-4 text-blue-500" />
          <span class="text-blue-300 font-semibold">{{ playerStore.character.energy }}/{{ playerStore.character.energyMax }}</span>
        </div>
        <div class="hidden md:flex items-center gap-1.5 px-2 py-1 bg-cyan-900/30 rounded border border-cyan-700/50">
          <Icon name="lucide:gem" class="h-4 w-4 text-cyan-500" />
          <span class="text-cyan-300 font-semibold">{{ playerStore.character.resources?.energyCrystals || 0 }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <button 
          class="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          title="Cài đặt"
          @click="showSettings = true"
        >
          <Icon name="lucide:settings" class="h-5 w-5 text-gray-400 hover:text-gray-300" />
        </button>
        <button 
          class="p-2 hover:bg-red-700/50 rounded-lg transition-colors"
          title="Đăng xuất"
          @click="handleLogout"
        >
          <Icon name="lucide:log-out" class="h-5 w-5 text-red-400 hover:text-red-300" />
        </button>
      </div>
    </div>

    <!-- Settings Modal -->
    <GameSettingsModal :is-open="showSettings" @close="showSettings = false" />

    <!-- Main Game Area -->
    <div class="flex-grow overflow-hidden">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full p-4 overflow-hidden md:p-6 lg:p-8">
        <!-- Left Panel - Character Status -->
        <div class="col-span-1 lg:col-span-3 space-y-4 overflow-y-auto">
          <GameHeaderStatus class="border border-cyan-700/50 p-3 rounded-lg bg-gray-900/50 backdrop-blur-sm shadow-lg" />
        </div>

        <!-- Center Panel - Main Game View -->
        <div class="col-span-1 lg:col-span-6 overflow-hidden">
          <GameMainPanel />
        </div>

        <!-- Right Panel - Game Log & Commands -->
        <div class="col-span-1 lg:col-span-3 flex flex-col overflow-hidden">
          <GameLog class="border border-gray-600/50 p-3 rounded-lg flex-grow bg-gray-900/50 backdrop-blur-sm shadow-lg overflow-hidden" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const playerStore = usePlayerStore()
const showSettings = ref(false)

async function handleLogout() {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await navigateTo('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>
