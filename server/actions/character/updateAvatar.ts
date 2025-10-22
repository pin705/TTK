import { z } from 'zod'
import type { ActionHandler } from '../types'

const updateAvatarPayloadSchema = z.object({
  avatarUrl: z.string().url('URL avatar không hợp lệ')
})

export const updateAvatar: ActionHandler = async ({ character, payload }) => {
  const { avatarUrl } = updateAvatarPayloadSchema.parse(payload)

  character.avatar = avatarUrl

  // Action này không cần trả về log, chỉ cần cập nhật
  return {
    log: [],
    updates: {
      character: { avatar: character.avatar }
    }
  }
}
