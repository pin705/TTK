<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="visible"
      class="fixed top-4 right-4 z-50 max-w-sm"
    >
      <div
        class="p-4 rounded-lg shadow-lg border backdrop-blur-sm flex items-start gap-3"
        :class="toastClasses"
      >
        <Icon :name="icon" class="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div class="flex-grow">
          <p v-if="title" class="font-semibold mb-1">{{ title }}</p>
          <p class="text-sm">{{ message }}</p>
        </div>
        <button
          class="flex-shrink-0 hover:opacity-70 transition-opacity"
          @click="close"
        >
          <Icon name="lucide:x" class="h-4 w-4" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
}>()

const visible = ref(true)
let timeout: ReturnType<typeof setTimeout>

const toastClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-900/90 border-green-600 text-green-100'
    case 'error':
      return 'bg-red-900/90 border-red-600 text-red-100'
    case 'warning':
      return 'bg-yellow-900/90 border-yellow-600 text-yellow-100'
    default:
      return 'bg-blue-900/90 border-blue-600 text-blue-100'
  }
})

const icon = computed(() => {
  switch (props.type) {
    case 'success':
      return 'lucide:check-circle'
    case 'error':
      return 'lucide:alert-circle'
    case 'warning':
      return 'lucide:alert-triangle'
    default:
      return 'lucide:info'
  }
})

function close() {
  visible.value = false
  clearTimeout(timeout)
}

onMounted(() => {
  if (props.duration && props.duration > 0) {
    timeout = setTimeout(close, props.duration)
  }
})

onUnmounted(() => {
  clearTimeout(timeout)
})
</script>
