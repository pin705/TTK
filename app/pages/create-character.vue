<template>
  <div class="min-h-screen bg-black text-green-400 flex items-center justify-center p-4">
    <div class="w-full max-w-2xl">
      <div class="bg-gray-900/80 border-2 border-cyan-700/50 rounded-xl backdrop-blur-sm shadow-2xl p-8 space-y-6">
        <div class="text-center space-y-2">
          <h1 class="text-4xl font-bold text-cyan-400 uppercase tracking-wider animate-pulse">
            Tạo Nhân Vật
          </h1>
          <p class="text-gray-400 text-sm">
            Hãy tạo nhân vật của bạn để bắt đầu hành trình trong thế giới hậu tận thế
          </p>
        </div>

        <form class="space-y-6" @submit.prevent="handleCreateCharacter">
          <!-- Character Name -->
          <div class="space-y-2">
            <label for="character-name" class="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Icon name="lucide:user" class="h-4 w-4 text-cyan-500" />
              Tên Nhân Vật
            </label>
            <input 
              id="character-name" 
              v-model="characterName" 
              type="text" 
              required 
              minlength="3"
              maxlength="20"
              placeholder="Nhập tên nhân vật (3-20 ký tự)"
              class="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            >
            <p class="text-xs text-gray-500">
              Tên sẽ hiển thị công khai và không thể thay đổi sau này
            </p>
          </div>

          <!-- Race Selection -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Icon name="lucide:users" class="h-4 w-4 text-cyan-500" />
              Chủng Tộc (Không thể thay đổi)
            </label>
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="race in raceOptions"
                :key="race.id"
                type="button"
                :class="[
                  'p-3 rounded-lg border-2 text-left transition-all',
                  selectedRace === race.id
                    ? 'border-cyan-500 bg-cyan-900/30'
                    : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                ]"
                @click="selectedRace = race.id"
              >
                <div class="font-semibold text-white">{{ race.name }}</div>
                <div class="text-xs text-gray-400 mt-1 line-clamp-2">{{ race.description }}</div>
              </button>
            </div>
          </div>

          <!-- Character Preview -->
          <div class="p-6 bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-lg border border-gray-700 space-y-4">
            <h3 class="text-lg font-semibold text-yellow-400 flex items-center gap-2">
              <Icon name="lucide:sparkles" class="h-5 w-5" />
              Thông Tin Ban Đầu - {{ races[selectedRace].nameVi }}
            </h3>
            
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="space-y-1">
                <p class="text-gray-400">Sinh Lực:</p>
                <p class="text-red-400 font-semibold">{{ races[selectedRace].baseStats.hp }} / {{ races[selectedRace].baseStats.hp }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-gray-400">Năng Lượng:</p>
                <p class="text-blue-400 font-semibold">{{ races[selectedRace].baseStats.energy }} / {{ races[selectedRace].baseStats.energy }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-gray-400">Tấn Công:</p>
                <p class="text-orange-400 font-semibold">{{ races[selectedRace].baseStats.attack }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-gray-400">Phòng Thủ:</p>
                <p class="text-green-400 font-semibold">{{ races[selectedRace].baseStats.defense }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-gray-400">Tốc Độ:</p>
                <p class="text-cyan-400 font-semibold">{{ races[selectedRace].baseStats.speed }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-gray-400">Tinh Thần:</p>
                <p class="text-purple-400 font-semibold">{{ races[selectedRace].baseStats.spirit }}</p>
              </div>
            </div>

            <div class="pt-4 border-t border-gray-700 space-y-2">
              <p class="text-xs text-gray-400">
                <Icon name="lucide:info" class="inline h-3 w-3 mr-1" />
                Bạn sẽ bắt đầu tại Khu Dân Cư - một nơi an toàn trong căn cứ
              </p>
              <p class="text-xs text-gray-400">
                <Icon name="lucide:zap" class="inline h-3 w-3 mr-1" />
                Thu thập Tinh Thể Năng Lượng để phát triển và tiến hóa
              </p>
              <p class="text-xs text-gray-400">
                <Icon name="lucide:sword" class="inline h-3 w-3 mr-1" />
                Chiến đấu với quái vật để tăng trưởng và nhận phần thưởng
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4">
            <button
              type="button"
              class="flex-1 px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 rounded-lg text-gray-300 font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              @click="goBack"
            >
              <Icon name="lucide:arrow-left" class="h-5 w-5" />
              Quay Lại
            </button>
            <button
              type="submit"
              :disabled="isLoading || !characterName || characterName.length < 3 || !selectedRace"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-2 border-cyan-500 rounded-lg text-white font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              <UiLoadingSpinner v-if="isLoading" class="h-5 w-5" />
              <Icon v-else name="lucide:rocket" class="h-5 w-5" />
              <span>{{ isLoading ? 'Đang Tạo...' : 'Bắt Đầu Phiêu Lưu' }}</span>
            </button>
          </div>

          <!-- Error Message -->
          <div v-if="errorMsg" class="p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-400 text-sm flex items-start gap-2">
            <Icon name="lucide:alert-circle" class="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{{ errorMsg }}</span>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { races, type RaceId } from '~~/shared/config'

definePageMeta({
  layout: false
})

const characterName = ref('')
const selectedRace = ref<RaceId>('human')
const isLoading = ref(false)
const errorMsg = ref('')

// Get race options from the races config
const raceOptions = Object.entries(races).map(([id, config]) => ({
  id: id as RaceId,
  name: config.nameVi,
  description: config.description,
  config
}))

async function handleCreateCharacter() {
  if (!characterName.value || characterName.value.length < 3) {
    errorMsg.value = 'Tên nhân vật phải có ít nhất 3 ký tự'
    return
  }

  if (!selectedRace.value) {
    errorMsg.value = 'Vui lòng chọn chủng tộc'
    return
  }

  isLoading.value = true
  errorMsg.value = ''

  try {
    const response = await $fetch('/api/character/create', {
      method: 'POST',
      body: { 
        name: characterName.value,
        race: selectedRace.value
      }
    })

    if (response.success) {
      // Redirect to game
      await navigateTo('/play')
    }
  } catch (error: any) {
    errorMsg.value = error.data?.message || 'Có lỗi xảy ra khi tạo nhân vật'
  } finally {
    isLoading.value = false
  }
}

function goBack() {
  navigateTo('/')
}
</script>
