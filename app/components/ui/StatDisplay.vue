<template>
  <div>
    <p class="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider flex items-center justify-center gap-1" :title="label">
       <Icon v-if="icon" :name="icon" class="h-3 w-3 -mt-px"/> {{ label }}
    </p>
    <p class="text-white font-semibold text-sm md:text-base">
      {{ value }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  icon: { type: String, default: '' },
  value: { type: [String, Number], required: true },
  label: { type: String, required: true },
})
</script>
