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
          class="h-20 w-20 rounded-full border-2 border-green-500 object-cover"
        >
        <label
          for="avatar-upload"
          class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <span class="text-xs text-white">Thay đổi</span>
          <UiLoadingSpinner
            v-if="isUploading"
            class="h-5 w-5 text-white"
          />
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
          {{ playerStore.character.cultivationStage }}
        </p>
      </div>
    </div>

    <div class="space-y-3 mt-4">
      <div>
        <div class="flex justify-between text-xs text-red-400">
          <span>HP</span>
          <span>{{ playerStore.character.hp }} / {{ playerStore.character.hpMax }}</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2.5 mt-1">
          <div
            class="bg-red-600 h-2.5 rounded-full transition-all duration-500"
            :style="{ width: hpPercent + '%' }"
          />
        </div>
      </div>

      <div>
        <div class="flex justify-between text-xs text-blue-400">
          <span>Năng Lượng</span>
          <span>{{ playerStore.character.energy }} / {{ playerStore.character.energyMax }}</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2.5 mt-1">
          <div
            class="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
            :style="{ width: energyPercent + '%' }"
          />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3 text-center mt-4 border-t border-green-700/50 pt-3">
      <div>
        <p class="text-gray-400 text-xs">
          Tấn Công
        </p>
        <p class="text-white font-semibold">
          {{ playerStore.character.stats?.attack || 0 }}
        </p>
      </div>
      <div>
        <p class="text-gray-400 text-xs">
          Phòng Thủ
        </p>
        <p class="text-white font-semibold">
          {{ playerStore.character.stats?.defense || 0 }}
        </p>
      </div>
      <div>
        <p class="text-gray-400 text-xs">
          Tốc Độ
        </p>
        <p class="text-white font-semibold">
          {{ playerStore.character.stats?.speed || 0 }}
        </p>
      </div>
    </div>

    <div class="text-center border-t border-green-700/50 pt-2 mt-3">
      <p class="text-sm text-gray-400">
        Đang ở:
      </p>
      <p class="text-cyan-400">
        {{ mapStore.currentZone?.name }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const playerStore = usePlayerStore()
const mapStore = useMapStore()
const { addLog } = useGameLog()
const { upload, isLoading: isUploading } = useAvatarUploader()

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

  // Kiểm tra kích thước file (ví dụ: < 2MB)
  if (file.size > 2 * 1024 * 1024) {
    addLog('Lỗi: Kích thước file không được vượt quá 2MB.', 'error')
    return
  }

  const result = await upload(file)
  if (result.error) {
    addLog(`Lỗi: ${result.error}`, 'error')
  } else {
    addLog('Cập nhật avatar thành công!', 'success')
  }
}
</script>
