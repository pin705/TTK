<template>
  <div class="bg-black text-green-400 font-mono min-h-screen p-2 md:p-4">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 h-screen">
      <div class="col-span-1 lg:col-span-3 space-y-4">
        <GameHeaderStatus class="border border-green-700/50 p-3 rounded-lg bg-gray-900/30 backdrop-blur-sm" />
      </div>

      <div class="col-span-1 lg:col-span-6">
        <GameMainPanel />
      </div>

      <div class="col-span-1 lg:col-span-3 flex flex-col">
        <GameLog class="border border-gray-600/50 p-3 rounded-lg flex-grow bg-gray-900/30 backdrop-blur-sm" />
      </div>
    </div>
  </div>
</template>
