<template>
  <div 
    class="p-2 rounded-md border transition-all cursor-pointer"
    :class="moduleId ? 'bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-purple-600/60 hover:border-purple-500' : 'bg-gray-800/60 border-gray-700/80 hover:border-gray-600'"
  >
    <div class="text-center space-y-1">
      <Icon 
        :name="slotIcon" 
        class="h-6 w-6 mx-auto"
        :class="moduleId ? 'text-purple-400' : 'text-gray-600'"
      />
      <p class="text-[10px] text-gray-400 uppercase font-semibold">{{ slotName }}</p>
      <p v-if="moduleId" class="text-xs text-purple-300 font-medium">
        {{ moduleName }}
      </p>
      <p v-else class="text-xs text-gray-600 italic">
        Trống
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { items, type ItemId } from '~~/shared/config'

const props = defineProps<{
  slotName: string
  moduleId?: string | null
  slotType: 'cultivation' | 'combat' | 'survival'
}>()

const slotIcon = computed(() => {
  switch (props.slotType) {
    case 'cultivation': return 'lucide:brain'
    case 'combat': return 'lucide:sword'
    case 'survival': return 'lucide:shield'
    default: return 'lucide:cpu'
  }
})

const moduleName = computed(() => {
  if (!props.moduleId) return ''
  const item = items[props.moduleId as ItemId]
  return item?.name || props.moduleId
})
</script>
