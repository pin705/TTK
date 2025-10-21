<template>
  <div class="bg-black text-green-400 font-mono min-h-screen p-4 grid grid-cols-12 gap-4">
    <div class="col-span-3 space-y-4">
      <GamePlayerStatus class="border border-green-700/50 p-3 rounded-lg bg-gray-900/30 backdrop-blur-sm" />
      <GameInventoryPanel class="border border-blue-700/50 p-3 rounded-lg bg-gray-900/30 backdrop-blur-sm" />
    </div>

    <div class="col-span-6 space-y-4">
      <GameZoneInfo class="border border-cyan-500/50 p-3 rounded-lg bg-gray-900/30 backdrop-blur-sm" />
      <GameActionMenu class="border border-purple-500/50 p-3 rounded-lg bg-gray-900/30 backdrop-blur-sm" />
    </div>

    <div class="col-span-3">
      <GameLog class="border border-gray-600/50 p-3 rounded-lg h-full bg-gray-900/30 backdrop-blur-sm" />
    </div>
  </div>
</template>
