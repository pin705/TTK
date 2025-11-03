// server/api/character/create.post.ts
import { z } from 'zod'
import { races } from '~~/shared/config'

const bodySchema = z.object({
  name: z.string().min(3, 'Tên phải có ít nhất 3 ký tự').max(20, 'Tên không quá 20 ký tự'),
  race: z.enum(['human', 'mutant', 'esper', 'cyborg', 'beastkin', 'voidwalker']),
  class: z.enum(['Warrior', 'SpiritReader']).default('Warrior')
})

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user?.userId) {
    throw createError({ statusCode: 401, message: 'Chưa đăng nhập' })
  }

  // Kiểm tra xem user đã có nhân vật chưa
  const existingCharacter = await Character.findOne({ userId: session.user.userId })
  if (existingCharacter) {
    throw createError({ statusCode: 400, message: 'Bạn đã có nhân vật rồi' })
  }

  const body = await readValidatedBody(event, bodySchema.parse)

  // Get race config for base stats
  const raceConfig = races[body.race]

  // Bắt đầu tạo nhân vật với stats dựa theo chủng tộc
  const character = await Character.create({
    userId: session.user.userId,
    name: body.name,
    race: body.race,
    class: body.class,
    hp: raceConfig.baseStats.hp,
    hpMax: raceConfig.baseStats.hp,
    energy: raceConfig.baseStats.energy,
    energyMax: raceConfig.baseStats.energy,
    currentZoneId: raceConfig.startingZone,
    stats: {
      attack: raceConfig.baseStats.attack,
      defense: raceConfig.baseStats.defense,
      speed: raceConfig.baseStats.speed,
      spirit: raceConfig.baseStats.spirit,
      critChance: (raceConfig.racialBonuses as any)?.critChance || 0.05,
      critDamage: (raceConfig.racialBonuses as any)?.critDamage ? 1.5 + (raceConfig.racialBonuses as any).critDamage : 1.5,
      dodgeChance: (raceConfig.racialBonuses as any)?.dodgeChance || 0.05,
      resistance: (raceConfig.racialBonuses as any)?.resistance || 0
    },
    // Starter equipment set for beginners
    inventory: [
      { itemId: 'standard_combat_knife', quantity: 1 },
      { itemId: 'standard_combat_vest', quantity: 1 },
      { itemId: 'energy_solution', quantity: 3 }
    ],
    // Auto-assign the welcome tutorial quest
    activeQuests: [{
      questId: 'tutorial_welcome',
      status: 'active',
      startedAt: new Date(),
      objectives: [
        { type: 'explore', target: 'giang_nam_vo_quan_01', count: 1, current: 0 },
        { type: 'talk', target: 'vo_su_truong', count: 1, current: 0 }
      ]
    }]
  })

  await replaceUserSession(event, {
    ...session,
    character: {
      _id: character._id.toString(),
      name: character.name
    }
  })

  return { success: true }
})
