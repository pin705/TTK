import type { ActionHandler } from '../types'

// Logic cho tu luyện bị động (idle)
export const cultivate: ActionHandler = async ({ character }) => {
  const now = new Date()
  const lastTick = new Date(character.lastCultivateTick)
  const secondsPassed = Math.floor((now.getTime() - lastTick.getTime()) / 1000)

  if (secondsPassed < 5) // Giới hạn 5 giây một lần để tránh spam
    return { log: '', updates: {} }

  // Mỗi 5 giây nhận 1 EXP (ví dụ)
  const expGained = Math.floor(secondsPassed / 5)
  if (expGained > 0) {
    character.cultivationExp += expGained
    character.lastCultivateTick = now
  }

  return {
    log: `Bạn nhận được ${expGained} điểm tu vi.`,
    updates: {
      character: {
        cultivationExp: character.cultivationExp,
        lastCultivateTick: character.lastCultivateTick,
      },
    },
  }
}
