import { getRequestHeader } from 'h3'
import { z } from 'zod'

function getRealIP(event) {
  const headers = event.node.req.headers
  return (
    headers['cf-connecting-ip'] // Cloudflare
    || headers['x-real-ip'] // NGINX
    || headers['x-forwarded-for']?.split(',')[0]?.trim()
    || event.node.req.socket?.remoteAddress
    || 'unknown'
  )
}

// Validate form
const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export default defineEventHandler(async (event) => {
  // const body = await readBody(event);
  const body = await readValidatedBody(event, bodySchema.parse)
  const { email, password, captchaToken } = body
  const ip = getRealIP(event)

  const ua = getRequestHeader(event, 'user-agent') || 'unknown'

  // 2. Rate limit theo IP – không quá 5 account mỗi giờ
  // const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  // const recentCount = await User.countDocuments({
  //   createdAt: { $gte: oneHourAgo },
  //   lastKnownIP: ip
  // })

  // if (recentCount > 5) {
  //   throw createError({
  //     statusCode: 429,
  //     message:
  //       '⏳ Quá nhiều tài khoản được tạo từ địa chỉ IP này. Vui lòng thử lại sau.'
  //   })
  // }

  // 3. Check nếu email đã tồn tại
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw createError({ statusCode: 400, message: '📧 Email đã tồn tại.' })
  }

  // 4. Check user-agent bất thường
  if (!ua || ua.includes('curl') || ua.includes('bot')) {
    throw createError({
      statusCode: 403,
      message: '🚫 Trình duyệt không hợp lệ.'
    })
  }

  // 5. Hash và lưu thông tin
  const hashedPassword = await hashPassword(password)
  const user = new User({
    email: email.trim(),
    password: hashedPassword,
    lastKnownIP: ip,
    userAgent: ua
  })

  const newUser = await user.save()

  // 6. Tạo nhân vật mặc định nếu chưa có
  let exists = await Character.findOne({ userId: newUser._id })
  // if (!exists) {
  //   // Tìm khu vực khởi đầu bằng ID định danh

  //   const startZone = ZoneManager.getStartZone()
  //   if (!startZone)
  //     throw createError({ statusCode: 500, message: 'Lỗi hệ thống: Không tìm thấy khu vực khởi đầu. Vui lòng chạy seed data.' })

  //   exists = await Character.create({
  //     userId: newUser._id,
  //     name: 'Người chơi',
  //     currentZoneId: startZone.zoneId // Gán _id của khu vực khởi đầu
  //   })
  // }

  await setUserSession(event, {
    user: {
      email
    },
    character: exists,
    loggedInAt: Date.now()
  })

  return true
})
