<template>
  <div class="fixed inset-0 bg-black z-50 flex items-center justify-center">
    <div class="text-center space-y-6">
      <!-- Animated Logo/Icon -->
      <div class="relative">
        <Icon 
          name="lucide:hexagon" 
          class="h-24 w-24 text-cyan-400 mx-auto animate-pulse"
        />
        <div class="absolute inset-0 flex items-center justify-center">
          <Icon 
            name="lucide:dna" 
            class="h-12 w-12 text-purple-400 animate-spin"
            style="animation-duration: 3s;"
          />
        </div>
      </div>

      <!-- Title -->
      <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-green-400 to-blue-400 uppercase tracking-wider">
        Tinh Không Đạo Lộ
      </h1>

      <!-- Loading Text -->
      <div class="space-y-2">
        <p class="text-gray-400 text-sm">{{ message }}</p>
        <UiLoadingSpinner class="h-8 w-8 mx-auto" />
      </div>

      <!-- Progress Bar (optional) -->
      <div v-if="showProgress" class="w-64 mx-auto">
        <div class="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
          <div 
            class="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300"
            :style="{ width: `${progress}%` }"
          />
        </div>
        <p class="text-xs text-gray-500 mt-1">{{ progress }}%</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string
  showProgress?: boolean
  progress?: number
}>()
</script>
