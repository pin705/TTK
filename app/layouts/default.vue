<template>
  <div class="bg-black text-green-400 min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Animated background effect -->
    <div class="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-black to-blue-900/10 animate-pulse" style="animation-duration: 4s;"></div>
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/5 via-transparent to-transparent"></div>
    
    <!-- Content -->
    <div class="w-full max-w-md relative z-10">
      <div class="bg-gray-900/80 border-2 border-cyan-700/50 rounded-xl backdrop-blur-sm shadow-2xl p-8">
        <slot />
      </div>
    </div>
  </div>
</template>
