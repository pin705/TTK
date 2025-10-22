import { z } from 'zod'
import { actions } from '../actions'

const actionSchema = z.object({
  action: z.string().regex(/^[a-zA-Z0-9]+\/[a-zA-Z0-9]+$/, 'Hành động không hợp lệ'),
  payload: z.any().optional()
})

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const characterId = session?.character?._id
  if (!characterId)
    throw createError({ statusCode: 401, message: 'Yêu cầu nhân vật để thực hiện hành động' })

  const body = await readValidatedBody(event, actionSchema.parse)

  const handler = actions[body.action]
  if (!handler)
    throw createError({ statusCode: 404, message: `Hành động '${body.action}' không tồn tại.` })

  try {
    const character = await Character.findById(characterId)
    if (!character)
      throw createError({ statusCode: 404, message: 'Không tìm thấy nhân vật' })

    // 1. Thực thi handler để lấy kết quả
    const result = await handler({
      character,
      payload: body.payload
    })

    if (result.log) {
      // 1. Chuẩn hóa `result.log` thành một mảng
      const logsToProcess = Array.isArray(result.log) ? result.log : [result.log]

      // 2. Chỉ ghi log nếu mảng có nội dung
      if (logsToProcess.length > 0) {
        await Logger.add(character._id.toString(), logsToProcess)
      }
    }

    // 3. Lưu lại thay đổi của nhân vật (nếu có)
    await character.save()

    return result
  } catch (error: any) {
    // Ghi lại lỗi vào log của người chơi
    await Logger.add(characterId.toString(), [{ message: error.message || 'Hành động thất bại', type: 'error' }])

    // Ném lại lỗi để client xử lý
    throw createError({ statusCode: 400, message: error.message || 'Hành động thất bại' })
  }
})
