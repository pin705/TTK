import type { LogType } from '~~/server/utils/logger'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const characterId = session?.character?._id
  if (!characterId) {
    throw createError({ statusCode: 401, message: 'Yêu cầu đăng nhập' })
  }

  const rawLogs = await Logger.get(characterId.toString())

  // Parse chuỗi log thành object để client dễ xử lý
  return rawLogs.map((log) => {
    const parts = log.split('|')
    const timestamp = parts[0]
    const type = (parts[1] as LogType) || 'default'
    const message = parts.slice(2).join('|') // Logic này vẫn đúng để xử lý message có chứa '|'

    return {
      timestamp,
      type,
      message
    }
  })
})
