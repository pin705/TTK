<template>
  <div
    v-if="playerStore.character"
    class="p-3"
  >
    <div class="flex items-center space-x-4">
      <div class="relative group">
        <img
          :src="playerStore.character.avatar || '/default-avatar.png'"
          alt="Avatar"
          class="h-20 w-20 rounded-full border-2 object-cover"
          :class="isWounded ? 'border-red-600 grayscale-[50%]' : 'border-green-500'"
        >
        <label
          for="avatar-upload"
          class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <UiLoadingSpinner
            v-if="isUploading"
            class="h-6 w-6 text-white"
          />
          <span
            v-else
            class="text-xs text-white"
          >Thay đổi</span>
        </label>
        <input
          id="avatar-upload"
          type="file"
          class="hidden"
          accept="image/png, image/jpeg, image/gif"
          @change="handleAvatarChange"
        >
      </div>
      <div>
        <h2 class="text-xl text-white font-bold">
          {{ playerStore.character.name }}
        </h2>
        <p class="text-yellow-400 text-sm">
          {{ playerStore.character.realm }}
        </p>
        <p
          v-if="isWounded"
          class="text-red-500 text-xs font-semibold animate-pulse mt-1"
        >
          <Icon
            name="lucide:heart-crack"
            class="inline-block mr-1"
          /> Trọng Thương
        </p>
      </div>
    </div>

    <div class="space-y-3 mt-4">
      <div>
        <div
          class="flex justify-between text-xs"
          :class="isWounded ? 'text-red-500' : 'text-red-400'"
        >
          <span>HP</span>
          <span>{{ playerStore.character.hp }} / {{ playerStore.character.hpMax }}</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2.5 mt-1 relative overflow-hidden border border-gray-600">
          <div
            class="h-full rounded-full transition-all duration-500"
            :class="isWounded ? 'bg-red-700' : 'bg-red-600'"
            :style="{ width: hpPercent + '%' }"
          />
        </div>
      </div>
      <div>
        <div class="flex justify-between text-xs text-blue-400">
          <span>Năng Lượng</span>
          <span>{{ playerStore.character.energy }} / {{ playerStore.character.energyMax }}</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2.5 mt-1 relative overflow-hidden border border-gray-600">
          <div
            class="bg-blue-600 h-full rounded-full transition-all duration-500"
            :style="{ width: energyPercent + '%' }"
          />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3 text-center mt-4 border-t border-green-700/50 pt-3" />

    <div class="text-center border-t border-green-700/50 pt-2 mt-3">
      <p class="text-sm text-gray-400">
        Đang ở:
      </p>
      <p class="text-cyan-400">
        {{ mapStore.currentZone?.name }}
      </p>
    </div>

    <p
      v-if="uploadError"
      class="text-xs text-red-500 mt-2 text-center"
    >
      {{ uploadError }}
    </p>
  </div>
</template>

<script setup lang="ts">
const playerStore = usePlayerStore()
const mapStore = useMapStore()
const { addLog } = useGameLog()
const { upload, isLoading: isUploading, error: uploadError } = useAvatarUploader()

// Computed property để kiểm tra trạng thái Trọng Thương
const isWounded = computed(() => {
  return playerStore.character?.effects?.some(e => e.effectId === 'heavy_wound' && (!e.expiresAt || new Date(e.expiresAt) > new Date())) || false
})

const hpPercent = computed(() => {
  if (!playerStore.character) return 0
  return (playerStore.character.hp / playerStore.character.hpMax) * 100
})
const energyPercent = computed(() => {
  if (!playerStore.character) return 0
  return (playerStore.character.energy / playerStore.character.energyMax) * 100
})

async function handleAvatarChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  const file = input.files[0]

  // Chỉ gọi composable upload, addLog sẽ được gọi bên trong nếu có lỗi
  const result = await upload(file)
  if (!result?.error) {
    addLog('Cập nhật avatar thành công!', 'success')
  }
  input.value = '' // Reset input
}
</script>
