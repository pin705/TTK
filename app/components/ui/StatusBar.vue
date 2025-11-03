<template>
  <div>
    <div class="flex justify-between items-center text-xs mb-1 font-mono" :class="labelColorClass">
      <span class="font-bold uppercase tracking-wider">
        {{ label }}:
      </span>
      <span class="font-mono font-semibold">{{ displayCurrent }} / {{ displayMax }}</span>
    </div>
    <div class="w-full bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 rounded-lg h-3 relative overflow-hidden border-2 border-gray-700/50 shadow-inner">
      <div
        class="h-full transition-all duration-500 ease-out relative"
        :class="colorClass"
        :style="{ width: percent + '%' }"
      >
        <!-- Shimmer effect on bar -->
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
      </div>
      <!-- Inner glow effect -->
      <div class="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  label: { type: String, required: true },
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
