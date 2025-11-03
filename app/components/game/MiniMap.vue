<template>
  <div class="p-3 bg-gray-900/50 border border-gray-700 shadow-inner font-mono">
    <div class="flex justify-between items-center mb-2">
      <h3 class="text-cyan-400 font-bold uppercase tracking-wider text-sm">
        > BẢN ĐỒ
      </h3>
      <button 
        @click="toggleExpanded"
        class="px-2 py-1 border border-cyan-600/50 text-cyan-400 hover:bg-cyan-900/30 transition-colors text-xs uppercase"
      >
        {{ expanded ? '[ THU GỌN ]' : '[ MỞ RỘNG ]' }}
      </button>
    </div>

    <div v-if="!expanded" class="text-xs text-gray-400">
      <p>Vị trí hiện tại: <span class="text-cyan-300 font-bold">{{ currentZone?.name }}</span></p>
    </div>

    <div v-else class="space-y-3">
      <!-- Current Zone Info -->
      <div class="border border-cyan-600/30 bg-cyan-900/10 p-2 text-xs">
        <p class="text-cyan-300 font-bold mb-1">[ VỊ TRÍ HIỆN TẠI ]</p>
        <p class="text-white">{{ currentZone?.name }}</p>
        <p class="text-gray-400">Cấp đề nghị: {{ currentZone?.recommendedLevel || '?' }}</p>
      </div>

      <!-- Nearby Zones -->
      <div class="space-y-1">
        <p class="text-yellow-400 font-bold text-xs uppercase">KHU VỰC LÂN CẬN:</p>
        <div 
          v-for="zone in nearbyZones" 
          :key="zone.id"
          class="border border-gray-600/30 bg-gray-800/30 p-2 flex justify-between items-center text-xs hover:bg-gray-800/50 transition-colors"
        >
          <div>
            <p class="text-white font-semibold">{{ zone.name }}</p>
            <p class="text-gray-400">
              Cấp: {{ zone.recommendedLevel }}
              <span v-if="zone.requiresLevel && playerStore.character && playerStore.character.level < zone.requiresLevel" class="text-red-400">
                (Yêu cầu Lv.{{ zone.requiresLevel }})
              </span>
            </p>
          </div>
          <button 
            v-if="!zone.requiresLevel || (playerStore.character && playerStore.character.level >= zone.requiresLevel)"
            @click="teleportTo(zone.id)"
            class="px-2 py-1 border border-green-600/50 bg-green-900/30 text-green-400 hover:bg-green-900/50 transition-colors uppercase"
            :disabled="isLoading"
          >
            [ ĐI ]
          </button>
          <span v-else class="text-red-400 uppercase text-[10px]">[ KHÓA ]</span>
        </div>
      </div>

      <!-- Entities in Current Zone -->
      <div class="space-y-2">
        <!-- Monsters -->
        <div v-if="monstersInZone.length > 0">
          <p class="text-red-400 font-bold text-xs uppercase mb-1">QUÁI VẬT:</p>
          <div class="space-y-1">
            <div 
              v-for="monster in monstersInZone" 
              :key="monster.id"
              class="border border-red-600/30 bg-red-900/10 p-1.5 flex justify-between items-center text-xs"
            >
              <span class="text-red-300">{{ monster.name }} <span class="text-gray-400">(x{{ monster.count }})</span></span>
              <span class="text-gray-400 text-[10px]">Lv.{{ monster.level }}</span>
            </div>
          </div>
        </div>

        <!-- Bosses -->
        <div v-if="bossesInZone.length > 0">
          <p class="text-orange-400 font-bold text-xs uppercase mb-1 animate-pulse">✦ BOSS:</p>
          <div class="space-y-1">
            <div 
              v-for="boss in bossesInZone" 
              :key="boss.id"
              class="border border-orange-600/50 bg-orange-900/20 p-1.5 text-xs animate-pulse"
            >
              <p class="text-orange-300 font-bold">{{ boss.name }}</p>
              <p class="text-gray-400 text-[10px]">Lv.{{ boss.level }} | HP: {{ boss.hp }}</p>
            </div>
          </div>
        </div>

        <!-- NPCs -->
        <div v-if="npcsInZone.length > 0">
          <p class="text-green-400 font-bold text-xs uppercase mb-1">NPC:</p>
          <div class="space-y-1">
            <div 
              v-for="npc in npcsInZone" 
              :key="npc.id"
              class="border border-green-600/30 bg-green-900/10 p-1.5 flex justify-between items-center text-xs"
            >
              <span class="text-green-300">{{ npc.name }}</span>
              <span v-if="npc.hasQuest" class="text-yellow-400 text-[10px]">[ NHIỆM VỤ ]</span>
            </div>
          </div>
        </div>

        <!-- Resources -->
        <div v-if="resourcesInZone.length > 0">
          <p class="text-blue-400 font-bold text-xs uppercase mb-1">TÀI NGUYÊN:</p>
          <div class="grid grid-cols-2 gap-1">
            <div 
              v-for="resource in resourcesInZone" 
              :key="resource.id"
              class="border border-blue-600/30 bg-blue-900/10 p-1 text-xs text-blue-300"
            >
              {{ resource.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameAction } from '~/composables/useGameAction'
import { usePlayerStore } from '~/stores/player'
import { useMapStore } from '~/stores/map'

const { execute, isLoading } = useGameAction()
const playerStore = usePlayerStore()
const mapStore = useMapStore()

const expanded = ref(false)

const currentZone = computed(() => mapStore.currentZone)

// Mock data - in reality these would come from the store/API
const nearbyZones = ref([
  { id: 'zone_2', name: 'Hoang Dã Cấp 2', recommendedLevel: 5, requiresLevel: 5 },
  { id: 'zone_3', name: 'Rừng Sâu', recommendedLevel: 10, requiresLevel: 8 },
  { id: 'city_1', name: 'Thành Phố Giang Nam', recommendedLevel: 1 }
])

const monstersInZone = computed(() => {
  if (!currentZone.value?.monsters) return []
  return currentZone.value.monsters.map((m: any) => ({
    id: m.monsterId,
    name: m.name || m.monsterId,
    level: m.level || 1,
    count: m.quantity || 1
  }))
})

const bossesInZone = ref([])

const npcsInZone = computed(() => {
  if (!currentZone.value?.npcs) return []
  return currentZone.value.npcs.map((npc: any) => ({
    id: npc.npcId,
    name: npc.name || npc.npcId,
    hasQuest: npc.questAvailable || false
  }))
})

const resourcesInZone = ref([])

function toggleExpanded() {
  expanded.value = !expanded.value
}

async function teleportTo(zoneId: string) {
  if (confirm(`Dịch chuyển đến khu vực này? (Tốn 100 Tinh Thạch)`)) {
    await execute('map/teleport', { targetZoneId: zoneId })
  }
}
</script>
