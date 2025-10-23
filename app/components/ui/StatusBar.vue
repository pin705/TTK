<template>
  <div>
    <div class="flex justify-between items-center text-xs mb-0.5" :class="labelColorClass">
      <span class="font-semibold flex items-center">
        <Icon v-if="icon" :name="icon" class="mr-1 h-3.5 w-3.5" /> {{ label }}
      </span>
      <span class="font-mono">{{ displayCurrent }} / {{ displayMax }}</span>
    </div>
    <div class="w-full bg-gray-800/60 rounded h-2.5 relative overflow-hidden border border-gray-700/50 shadow-inner">
      <div
        class="h-full rounded transition-all duration-300 ease-in-out"
        :class="colorClass"
        :style="{ width: percent + '%' }"
      />
      <div class="absolute inset-0 bg-repeat bg-[length:100%_4px] opacity-10" style="background-image: linear-gradient(to bottom, rgba(0, 255, 255, 0.2) 1px, transparent 1px);" />
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  label: { type: String, required: true },
  icon: { type: String, default: '' },
  current: { type: Number, required: true },
  max: { type: Number, required: true },
  colorClass: { type: String, required: true }, // Class Tailwind cho màu thanh bar (VD: 'bg-red-600')
  labelColorClass: { type: String, default: 'text-gray-400' } // Class Tailwind cho màu label
})

// Tính toán phần trăm, chống lỗi chia cho 0
const percent = computed(() => {
  if (props.max <= 0) return 0
  return Math.max(0, Math.min(100, (props.current / props.max) * 100))
})

// Format số lớn (tùy chọn)
const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
}

const displayCurrent = computed(() => formatNumber(props.current))
const displayMax = computed(() => formatNumber(props.max))

</script>
