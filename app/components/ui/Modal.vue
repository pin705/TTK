<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm" @click.self="close">
    <div class="bg-gray-900 border border-purple-600 rounded-lg shadow-xl p-6 w-full max-w-md">
      <div class="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
        <h3 class="text-xl font-bold text-purple-400">
          <slot name="header">
            Thông Báo
          </slot>
        </h3>
        <button class="text-gray-400 hover:text-white" @click="close">
          &times;
        </button>
      </div>
      <div>
        <slot />
      </div>
      <div class="mt-6 text-right">
        <slot name="footer">
          <button class="bg-purple-800 hover:bg-purple-700 px-4 py-2 rounded" @click="close">
            Đóng
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false)
}
</script>
