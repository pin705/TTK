export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const characterId = session?.character?._id
  if (!characterId) {
    throw createError({ statusCode: 401, message: 'Yêu cầu nhân vật để thực hiện hành động' })
  }

  const character = await Character.findById(characterId)
    .lean()

  if (!character)
    throw createError({ statusCode: 404, statusMessage: 'Character not found' })

  const currentZone = await Zone.findById(character.currentZoneId)
    .populate('monsters.monsterId')
    .lean()

  if (!currentZone)
    throw createError({ statusCode: 404, statusMessage: 'Zone not found' })

  return {
    character,
    currentZone,
  }
})
