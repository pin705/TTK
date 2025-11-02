<template>
  <div class="relative inline-block">
    <div
      @mouseenter="showTooltip = true"
      @mouseleave="showTooltip = false"
    >
      <slot />
    </div>
    
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="showTooltip && text"
        class="absolute z-50 px-3 py-2 text-sm bg-gray-900 text-gray-100 rounded-lg shadow-lg border border-gray-700 whitespace-nowrap pointer-events-none"
        :class="positionClasses"
      >
        {{ text }}
        <div class="absolute w-2 h-2 bg-gray-900 border-gray-700 transform rotate-45" :class="arrowClasses"></div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}>()

const showTooltip = ref(false)

const positionClasses = computed(() => {
  switch (props.position) {
    case 'bottom':
      return 'top-full left-1/2 -translate-x-1/2 mt-2'
    case 'left':
      return 'right-full top-1/2 -translate-y-1/2 mr-2'
    case 'right':
      return 'left-full top-1/2 -translate-y-1/2 ml-2'
    default: // top
      return 'bottom-full left-1/2 -translate-x-1/2 mb-2'
  }
})

const arrowClasses = computed(() => {
  switch (props.position) {
    case 'bottom':
      return 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-t border-l'
    case 'left':
      return 'left-full top-1/2 -translate-y-1/2 -ml-1 border-t border-r'
    case 'right':
      return 'right-full top-1/2 -translate-y-1/2 -mr-1 border-b border-l'
    default: // top
      return 'top-full left-1/2 -translate-x-1/2 -mt-1 border-b border-r'
  }
})
</script>
