<template>
  <div class="space-y-6">
    <!-- Title with animated effect -->
    <div class="text-center space-y-2">
      <h1 class="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-green-400 to-blue-400 animate-pulse uppercase tracking-wider">
        Tinh Không Đạo Lộ
      </h1>
      <p class="text-sm text-gray-400">
        {{ mode === 'login' ? 'Hành trình tiến hóa trong thế giới hậu tận thế' : 'Bắt đầu cuộc phiêu lưu của bạn' }}
      </p>
    </div>

    <!-- Login Form -->
    <form v-if="mode === 'login'" class="space-y-5" @submit.prevent="handleLogin">
      <div class="space-y-2">
        <label for="email" class="text-sm font-medium text-gray-300 flex items-center gap-2">
          <Icon name="lucide:mail" class="h-4 w-4 text-cyan-500" />
          Email
        </label>
        <input 
          id="email" 
          v-model="form.email" 
          type="email" 
          required 
          autocomplete="email"
          placeholder="example@email.com"
          class="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
        >
      </div>
      <div class="space-y-2">
        <label for="password" class="text-sm font-medium text-gray-300 flex items-center gap-2">
          <Icon name="lucide:lock" class="h-4 w-4 text-cyan-500" />
          Mật khẩu
        </label>
        <input 
          id="password" 
          v-model="form.password" 
          type="password" 
          required 
          autocomplete="current-password"
          placeholder="••••••••"
          class="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
        >
      </div>
      <button 
        type="submit" 
        :disabled="isLoading" 
        class="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-2 border-cyan-500 rounded-lg text-white font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        <UiLoadingSpinner v-if="isLoading" class="h-5 w-5" />
        <Icon v-else name="lucide:log-in" class="h-5 w-5" />
        <span>{{ isLoading ? 'Đang Đăng Nhập...' : 'Đăng Nhập' }}</span>
      </button>
    </form>

    <!-- Register Form -->
    <form v-if="mode === 'register'" class="space-y-5" @submit.prevent="handleRegister">
      <div class="space-y-2">
        <label for="email-reg" class="text-sm font-medium text-gray-300 flex items-center gap-2">
          <Icon name="lucide:mail" class="h-4 w-4 text-cyan-500" />
          Email
        </label>
        <input 
          id="email-reg" 
          v-model="form.email" 
          type="email" 
          required 
          autocomplete="email"
          placeholder="example@email.com"
          class="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
        >
      </div>
      <div class="space-y-2">
        <label for="password-reg" class="text-sm font-medium text-gray-300 flex items-center gap-2">
          <Icon name="lucide:lock" class="h-4 w-4 text-cyan-500" />
          Mật khẩu
        </label>
        <input 
          id="password-reg" 
          v-model="form.password" 
          type="password" 
          required 
          autocomplete="new-password"
          placeholder="••••••••"
          class="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
        >
        <p class="text-xs text-gray-500">Mật khẩu phải có ít nhất 6 ký tự</p>
      </div>
      <button 
        type="submit" 
        :disabled="isLoading" 
        class="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 border-2 border-green-500 rounded-lg text-white font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        <UiLoadingSpinner v-if="isLoading" class="h-5 w-5" />
        <Icon v-else name="lucide:user-plus" class="h-5 w-5" />
        <span>{{ isLoading ? 'Đang Đăng Ký...' : 'Đăng Ký Ngay' }}</span>
      </button>
    </form>

    <!-- Toggle Mode -->
    <div class="text-center pt-4 border-t border-gray-700">
      <a 
        href="#" 
        class="text-sm text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1" 
        @click.prevent="toggleMode"
      >
        <Icon name="lucide:repeat" class="h-4 w-4" />
        {{ mode === 'login' ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập' }}
      </a>
    </div>

    <!-- Error Message -->
    <div v-if="errorMsg" class="p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-400 text-sm flex items-start gap-2">
      <Icon name="lucide:alert-circle" class="h-5 w-5 flex-shrink-0 mt-0.5" />
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
