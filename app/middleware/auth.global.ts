export default defineNuxtRouteMiddleware(async (to, from) => {
  // Lấy phiên của người dùng. `useUserSession` đến từ `nuxt-auth-utils`.
  const { loggedIn } = useUserSession()
  console.log('Auth middleware: session=', loggedIn.value)

  // Các trang không yêu cầu đăng nhập
  const publicRoutes = ['/']

  // Nếu người dùng chưa đăng nhập VÀ trang hiện tại không phải là trang công khai
  if (!loggedIn.value && !publicRoutes.includes(to.path)) {
    // Chuyển hướng về trang đăng nhập
    return navigateTo('/')
  }

  // Nếu người dùng đã đăng nhập VÀ đang ở trang đăng nhập
  if (loggedIn.value && to.path === '/') {
    // Chuyển hướng vào game
    return navigateTo('/play')
  }
})
