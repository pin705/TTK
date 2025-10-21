<template>
  <div v-if="mapStore.currentZone" class="space-y-3">
    <h2 class="text-xl text-cyan-400 animate-pulse">
      [ Zone: {{ mapStore.currentZone.name }} ]
    </h2>
    <p class="text-gray-300 whitespace-pre-wrap">
      {{ mapStore.currentZone.description }}
    </p>

    <div>
      <h3 class="text-red-500">[Quái vật]</h3>
      <p v-if="!mapStore.currentZone.monsters?.length" class="pl-4 text-gray-500">
        Không có mối nguy hiểm nào.
      </p>
      <ul v-else class="pl-4">
        <li>👾 <span class="text-red-400">Robot Bảo Trì rỉ sét</span> (Cấp 1)</li>
      </ul>
    </div>

    <div>
      <h3 class="text-yellow-400">[Tài nguyên]</h3>
      <p v-if="!mapStore.currentZone.resources?.length" class="pl-4 text-gray-500">
        Không có tài nguyên nào.
      </p>
      <ul v-else class="pl-4">
        <li v-for="resource in mapStore.currentZone.resources" :key="resource.itemId">
          ⚙️ Phát hiện tín hiệu của <span class="text-yellow-300">[{{ resource.itemId }}]</span>.
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const mapStore = useMapStore()
</script>
