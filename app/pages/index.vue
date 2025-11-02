<template>
  <div class="space-y-6">
    <!-- Title with animated effect -->
    <div class="text-center space-y-3 relative">
      <div class="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-cultivation-gold-500/50 to-transparent"></div>
      <h1 class="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cultivation-gold-300 via-cultivation-gold-200 to-cultivation-jade-300 animate-pulse uppercase tracking-widest drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]">
        Tinh Không Đạo Lộ
      </h1>
      <p class="text-sm text-cultivation-gold-400/80 font-medium">
        {{ mode === 'login' ? 'Hành trình tiến hóa trong thế giới hậu tận thế' : 'Bắt đầu cuộc phiêu lưu của bạn' }}
      </p>
      <div class="flex items-center justify-center gap-2 text-xs text-cultivation-gold-600">
        <div class="w-8 h-px bg-gradient-to-r from-transparent to-cultivation-gold-600"></div>
        <Icon name="lucide:sparkles" class="h-3 w-3" />
        <div class="w-8 h-px bg-gradient-to-l from-transparent to-cultivation-gold-600"></div>
      </div>
    </div>

    <!-- Login Form -->
    <form v-if="mode === 'login'" class="space-y-5" @submit.prevent="handleLogin">
      <div class="space-y-2">
        <label for="email" class="text-sm font-semibold text-cultivation-gold-300 flex items-center gap-2 uppercase tracking-wide">
          <Icon name="lucide:mail" class="h-4 w-4 text-cultivation-gold-400" />
          Email
        </label>
        <input 
          id="email" 
          v-model="form.email" 
          type="email" 
          required 
          autocomplete="email"
          placeholder="example@email.com"
          class="w-full px-4 py-3 bg-gray-800/60 border-2 border-cultivation-gold-700/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cultivation-gold-500/50 focus:border-cultivation-gold-500/60 transition-all backdrop-blur-sm"
        >
      </div>
      <div class="space-y-2">
        <label for="password" class="text-sm font-semibold text-cultivation-gold-300 flex items-center gap-2 uppercase tracking-wide">
          <Icon name="lucide:lock" class="h-4 w-4 text-cultivation-gold-400" />
          Mật khẩu
        </label>
        <input 
          id="password" 
          v-model="form.password" 
          type="password" 
          required 
          autocomplete="current-password"
          placeholder="••••••••"
          class="w-full px-4 py-3 bg-gray-800/60 border-2 border-cultivation-gold-700/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cultivation-gold-500/50 focus:border-cultivation-gold-500/60 transition-all backdrop-blur-sm"
        >
      </div>
      <button 
        type="submit" 
        :disabled="isLoading" 
        class="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-br from-cultivation-gold-600 via-cultivation-gold-700 to-cultivation-gold-800 hover:from-cultivation-gold-500 hover:via-cultivation-gold-600 hover:to-cultivation-gold-700 border-2 border-cultivation-gold-500/60 rounded-lg text-white font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-cultivation-gold-500/50 transform hover:scale-[1.02] active:scale-95 relative overflow-hidden group"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer"></div>
        <UiLoadingSpinner v-if="isLoading" class="h-5 w-5 relative z-10" />
        <Icon v-else name="lucide:log-in" class="h-5 w-5 relative z-10" />
        <span class="relative z-10">{{ isLoading ? 'Đang Đăng Nhập...' : 'Đăng Nhập' }}</span>
      </button>
    </form>

    <!-- Register Form -->
    <form v-if="mode === 'register'" class="space-y-5" @submit.prevent="handleRegister">
      <div class="space-y-2">
        <label for="email-reg" class="text-sm font-semibold text-cultivation-gold-300 flex items-center gap-2 uppercase tracking-wide">
          <Icon name="lucide:mail" class="h-4 w-4 text-cultivation-gold-400" />
          Email
        </label>
        <input 
          id="email-reg" 
          v-model="form.email" 
          type="email" 
          required 
          autocomplete="email"
          placeholder="example@email.com"
          class="w-full px-4 py-3 bg-gray-800/60 border-2 border-cultivation-gold-700/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cultivation-gold-500/50 focus:border-cultivation-gold-500/60 transition-all backdrop-blur-sm"
        >
      </div>
      <div class="space-y-2">
        <label for="password-reg" class="text-sm font-semibold text-cultivation-gold-300 flex items-center gap-2 uppercase tracking-wide">
          <Icon name="lucide:lock" class="h-4 w-4 text-cultivation-gold-400" />
          Mật khẩu
        </label>
        <input 
          id="password-reg" 
          v-model="form.password" 
          type="password" 
          required 
          autocomplete="new-password"
          placeholder="••••••••"
          class="w-full px-4 py-3 bg-gray-800/60 border-2 border-cultivation-gold-700/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cultivation-gold-500/50 focus:border-cultivation-gold-500/60 transition-all backdrop-blur-sm"
        >
        <p class="text-xs text-cultivation-gold-500/70">Mật khẩu phải có ít nhất 6 ký tự</p>
      </div>
      <button 
        type="submit" 
        :disabled="isLoading" 
        class="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-br from-cultivation-jade-600 via-cultivation-jade-700 to-cultivation-jade-800 hover:from-cultivation-jade-500 hover:via-cultivation-jade-600 hover:to-cultivation-jade-700 border-2 border-cultivation-jade-500/60 rounded-lg text-white font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-cultivation-jade-500/50 transform hover:scale-[1.02] active:scale-95 relative overflow-hidden group"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer"></div>
        <UiLoadingSpinner v-if="isLoading" class="h-5 w-5 relative z-10" />
        <Icon v-else name="lucide:user-plus" class="h-5 w-5 relative z-10" />
        <span class="relative z-10">{{ isLoading ? 'Đang Đăng Ký...' : 'Đăng Ký Ngay' }}</span>
      </button>
    </form>

    <!-- Toggle Mode -->
    <div class="text-center pt-4 border-t-2 border-cultivation-gold-700/30 relative">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-cultivation-gold-500/50 to-transparent"></div>
      <a 
        href="#" 
        class="text-sm text-cultivation-gold-400 hover:text-cultivation-gold-300 transition-all inline-flex items-center gap-2 font-medium hover:scale-105 transform" 
        @click.prevent="toggleMode"
      >
        <Icon name="lucide:repeat" class="h-4 w-4" />
        {{ mode === 'login' ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập' }}
      </a>
    </div>

    <!-- Error Message -->
    <div v-if="errorMsg" class="p-4 bg-gradient-to-r from-red-900/40 to-red-950/40 border-2 border-red-600/60 rounded-lg text-red-300 text-sm flex items-start gap-2 backdrop-blur-sm">
      <Icon name="lucide:alert-circle" class="h-5 w-5 flex-shrink-0 mt-0.5 text-red-400" />
      <span>{{ errorMsg }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const mode = ref<'login' | 'register'>('login')
const isLoading = ref(false)
const errorMsg = ref('')

const form = reactive({
  email: '',
  password: '',
})

const { fetch: fetchSession } = useUserSession()

async function handleLogin() {
  isLoading.value = true
  errorMsg.value = ''
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: form.email, password: form.password },
    })
    await fetchSession() // Lấy lại session mới
    await navigateTo('/play') // Chuyển hướng vào game
  }
  catch (error: any) {
    errorMsg.value = error.data?.message || 'Đăng nhập thất bại.'
  }
  finally {
    isLoading.value = false
  }
}

async function handleRegister() {
  isLoading.value = true
  errorMsg.value = ''
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: { email: form.email, password: form.password },
    })
    // Tự động đăng nhập sau khi đăng ký thành công
    await handleLogin()
  }
  catch (error: any) {
    errorMsg.value = error.data?.message || 'Đăng ký thất bại.'
  }
  finally {
    isLoading.value = false
  }
}

function toggleMode() {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  errorMsg.value = ''
  form.email = ''
  form.password = ''
}
</script>
