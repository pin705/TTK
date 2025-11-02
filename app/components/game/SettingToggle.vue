<template>
  <div class="flex items-center justify-between p-3 bg-gray-800/40 rounded-lg hover:bg-gray-800/60 transition-colors">
    <div class="flex-grow pr-4">
      <p class="text-sm font-medium text-gray-200">{{ label }}</p>
      <p v-if="description" class="text-xs text-gray-500 mt-0.5">{{ description }}</p>
    </div>
    <button
      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900"
      :class="value ? 'bg-cyan-600' : 'bg-gray-600'"
      @click="toggle"
    >
      <span
        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
        :class="value ? 'translate-x-6' : 'translate-x-1'"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string
  description?: string
  value: boolean
}>()

const emit = defineEmits<{
  update: [value: boolean]
}>()

function toggle() {
  emit('update', !props.value)
}
</script>
