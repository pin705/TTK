<template>
  <div>
    <h1 class="text-3xl font-bold text-center text-green-400 animate-pulse">
      TINH KHÔNG ĐẠO LỘ
    </h1>

    <form v-if="mode === 'login'" class="mt-8 space-y-6" @submit.prevent="handleLogin">
      <div>
        <label for="email" class="text-sm font-medium text-gray-300">Email</label>
        <input id="email" v-model="form.email" type="email" required class="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-green-500 focus:border-green-500">
      </div>
      <div>
        <label for="password" class="text-sm font-medium text-gray-300">Mật khẩu</label>
        <input id="password" v-model="form.password" type="password" required class="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-green-500 focus:border-green-500">
      </div>
      <button type="submit" :disabled="isLoading" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
        <UiLoadingSpinner v-if="isLoading" />
        <span v-else>Đăng Nhập</span>
      </button>
    </form>

    <form v-if="mode === 'register'" class="mt-8 space-y-6" @submit.prevent="handleRegister">
      <div>
        <label for="email-reg" class="text-sm font-medium text-gray-300">Email</label>
        <input id="email-reg" v-model="form.email" type="email" required class="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-green-500 focus:border-green-500">
      </div>
      <div>
        <label for="password-reg" class="text-sm font-medium text-gray-300">Mật khẩu</label>
        <input id="password-reg" v-model="form.password" type="password" required class="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-green-500 focus:border-green-500">
      </div>
      <button type="submit" :disabled="isLoading" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
        <UiLoadingSpinner v-if="isLoading" />
        <span v-else>Đăng Ký</span>
      </button>
    </form>

    <div class="mt-6 text-center">
      <a href="#" class="text-sm text-purple-400 hover:underline" @click.prevent="toggleMode">
        {{ mode === 'login' ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập' }}
      </a>
    </div>

    <div v-if="errorMsg" class="mt-4 text-center text-red-500">
      {{ errorMsg }}
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
