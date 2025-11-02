export default defineNuxtRouteMiddleware(async (to, from) => {
  // Lấy phiên của người dùng. `useUserSession` đến từ `nuxt-auth-utils`.
  const { loggedIn, user } = useUserSession()
  console.log('Auth middleware: session=', loggedIn.value)

  // Các trang không yêu cầu đăng nhập
  const publicRoutes = ['/', '/create-character']

  // Nếu người dùng chưa đăng nhập VÀ trang hiện tại không phải là trang công khai
  if (!loggedIn.value && !publicRoutes.includes(to.path)) {
    // Chuyển hướng về trang đăng nhập
    return navigateTo('/')
  }

  // Nếu người dùng đã đăng nhập
  if (loggedIn.value) {
    // Nếu đang ở trang đăng nhập, kiểm tra xem có nhân vật chưa
    if (to.path === '/') {
      // Kiểm tra xem có nhân vật chưa
      try {
        const character = await $fetch('/api/character/me')
        if (character) {
          // Có nhân vật rồi, vào game
          return navigateTo('/play')
        } else {
          // Chưa có nhân vật, đi tạo
          return navigateTo('/create-character')
        }
      } catch (error) {
        // Chưa có nhân vật, đi tạo
        return navigateTo('/create-character')
      }
    }

    // Nếu đang cố vào game nhưng chưa có nhân vật
    if (to.path === '/play') {
      try {
        const character = await $fetch('/api/character/me')
        if (!character) {
          return navigateTo('/create-character')
        }
      } catch (error) {
        return navigateTo('/create-character')
      }
    }
  }
})
