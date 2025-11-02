<template>
  <div class="bg-gradient-to-br from-gray-950 via-cultivation-gold-950/20 to-gray-950 min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Animated background effects -->
    <div class="absolute inset-0 bg-cultivation-pattern opacity-30"></div>
    <div class="absolute inset-0 bg-gradient-to-br from-cultivation-gold-900/10 via-transparent to-cultivation-mystic-900/10 animate-pulse" style="animation-duration: 8s;"></div>
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cultivation-gold-800/10 via-transparent to-transparent"></div>
    
    <!-- Decorative corner ornaments -->
    <div class="absolute top-4 left-4 w-20 h-20 border-t-2 border-l-2 border-cultivation-gold-500/30 rounded-tl-lg"></div>
    <div class="absolute top-4 right-4 w-20 h-20 border-t-2 border-r-2 border-cultivation-gold-500/30 rounded-tr-lg"></div>
    <div class="absolute bottom-4 left-4 w-20 h-20 border-b-2 border-l-2 border-cultivation-gold-500/30 rounded-bl-lg"></div>
    <div class="absolute bottom-4 right-4 w-20 h-20 border-b-2 border-r-2 border-cultivation-gold-500/30 rounded-br-lg"></div>
    
    <!-- Content -->
    <div class="w-full max-w-md relative z-10">
      <div class="bg-gradient-to-br from-gray-900/90 via-gray-900/85 to-gray-800/90 border-2 border-cultivation-gold-600/40 rounded-xl backdrop-blur-md shadow-2xl p-8 relative overflow-hidden">
        <!-- Inner glow effect -->
        <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-cultivation-gold-500/5 via-transparent to-cultivation-mystic-500/5 pointer-events-none"></div>
        <div class="relative z-10">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
