<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="close"
      >
        <Transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="isOpen"
            class="bg-gray-900 border-2 border-cyan-700/50 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            <!-- Header -->
            <div class="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
              <h2 class="text-2xl font-bold text-cyan-400 flex items-center gap-2">
                <Icon name="lucide:settings" class="h-6 w-6" />
                Cài Đặt
              </h2>
              <button
                class="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                @click="close"
              >
                <Icon name="lucide:x" class="h-5 w-5 text-gray-400 hover:text-gray-300" />
              </button>
            </div>

            <!-- Content -->
            <div class="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
              <!-- Game Settings -->
              <section class="space-y-4">
                <h3 class="text-lg font-semibold text-yellow-400 flex items-center gap-2">
                  <Icon name="lucide:gamepad-2" class="h-5 w-5" />
                  Game
                </h3>
                <div class="space-y-3">
                  <SettingToggle
                    label="Tự động thu thập tài nguyên"
                    description="Tự động thu thập khi đi qua khu vực có tài nguyên"
                    :value="settings.autoGather"
                    @update="settings.autoGather = $event"
                  />
                  <SettingToggle
                    label="Hiển thị thông báo combat log"
                    description="Hiển thị chi tiết từng đòn đánh trong combat"
                    :value="settings.showCombatLog"
                    @update="settings.showCombatLog = $event"
                  />
                  <SettingToggle
                    label="Xác nhận hành động quan trọng"
                    description="Yêu cầu xác nhận khi thực hiện hành động không thể hoàn tác"
                    :value="settings.confirmActions"
                    @update="settings.confirmActions = $event"
                  />
                </div>
              </section>

              <!-- Display Settings -->
              <section class="space-y-4">
                <h3 class="text-lg font-semibold text-blue-400 flex items-center gap-2">
                  <Icon name="lucide:monitor" class="h-5 w-5" />
                  Hiển Thị
                </h3>
                <div class="space-y-3">
                  <SettingToggle
                    label="Chế độ tối"
                    description="Giao diện tối (đang bật mặc định)"
                    :value="settings.darkMode"
                    @update="settings.darkMode = $event"
                  />
                  <SettingToggle
                    label="Hiệu ứng động"
                    description="Hiển thị các hiệu ứng và hoạt ảnh"
                    :value="settings.animations"
                    @update="settings.animations = $event"
                  />
                  <SettingToggle
                    label="Hiển thị FPS"
                    description="Hiển thị số khung hình/giây"
                    :value="settings.showFps"
                    @update="settings.showFps = $event"
                  />
                </div>
              </section>

              <!-- Audio Settings -->
              <section class="space-y-4">
                <h3 class="text-lg font-semibold text-purple-400 flex items-center gap-2">
                  <Icon name="lucide:volume-2" class="h-5 w-5" />
                  Âm Thanh
                </h3>
                <div class="space-y-3">
                  <SettingToggle
                    label="Âm thanh game"
                    description="Bật/tắt tất cả âm thanh"
                    :value="settings.soundEnabled"
                    @update="settings.soundEnabled = $event"
                  />
                  <div class="space-y-2">
                    <label class="text-sm text-gray-300">Âm lượng nhạc nền</label>
                    <input
                      v-model="settings.musicVolume"
                      type="range"
                      min="0"
                      max="100"
                      class="w-full"
                    >
                    <p class="text-xs text-gray-500">{{ settings.musicVolume }}%</p>
                  </div>
                  <div class="space-y-2">
                    <label class="text-sm text-gray-300">Âm lượng hiệu ứng</label>
                    <input
                      v-model="settings.sfxVolume"
                      type="range"
                      min="0"
                      max="100"
                      class="w-full"
                    >
                    <p class="text-xs text-gray-500">{{ settings.sfxVolume }}%</p>
                  </div>
                </div>
              </section>

              <!-- Keyboard Shortcuts -->
              <section class="space-y-4">
                <h3 class="text-lg font-semibold text-green-400 flex items-center gap-2">
                  <Icon name="lucide:keyboard" class="h-5 w-5" />
                  Phím Tắt
                </h3>
                <div class="grid grid-cols-2 gap-2 text-sm">
                  <div class="flex items-center justify-between p-2 bg-gray-800/60 rounded">
                    <span class="text-gray-300">Mở bản đồ</span>
                    <kbd class="px-2 py-1 bg-gray-700 rounded text-cyan-400 font-mono">M</kbd>
                  </div>
                  <div class="flex items-center justify-between p-2 bg-gray-800/60 rounded">
                    <span class="text-gray-300">Mở túi đồ</span>
                    <kbd class="px-2 py-1 bg-gray-700 rounded text-cyan-400 font-mono">I</kbd>
                  </div>
                  <div class="flex items-center justify-between p-2 bg-gray-800/60 rounded">
                    <span class="text-gray-300">Nhiệm vụ</span>
                    <kbd class="px-2 py-1 bg-gray-700 rounded text-cyan-400 font-mono">Q</kbd>
                  </div>
                  <div class="flex items-center justify-between p-2 bg-gray-800/60 rounded">
                    <span class="text-gray-300">Nhân vật</span>
                    <kbd class="px-2 py-1 bg-gray-700 rounded text-cyan-400 font-mono">C</kbd>
                  </div>
                </div>
              </section>
            </div>

            <!-- Footer -->
            <div class="bg-gray-800/50 px-6 py-4 border-t border-gray-700 flex justify-between items-center">
              <button
                class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                @click="resetSettings"
              >
                Đặt Lại Mặc Định
              </button>
              <button
                class="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg transition-all"
                @click="saveAndClose"
              >
                Lưu & Đóng
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const settings = reactive({
  autoGather: false,
  showCombatLog: true,
  confirmActions: true,
  darkMode: true,
  animations: true,
  showFps: false,
  soundEnabled: true,
  musicVolume: 50,
  sfxVolume: 70
})

function close() {
  emit('close')
}

function saveAndClose() {
  // TODO: Save settings to localStorage or server
  console.log('Saving settings:', settings)
  close()
}

function resetSettings() {
  settings.autoGather = false
  settings.showCombatLog = true
  settings.confirmActions = true
  settings.darkMode = true
  settings.animations = true
  settings.showFps = false
  settings.soundEnabled = true
  settings.musicVolume = 50
  settings.sfxVolume = 70
}
</script>

<script setup lang="ts">
// Setting Toggle Component (inline)
</script>
