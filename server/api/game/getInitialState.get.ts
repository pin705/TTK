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

  const currentZoneData = ZoneManager.getZone(character.currentZoneId)
  if (!currentZoneData)
    throw createError({ statusCode: 404, statusMessage: `Khu vực '${character.currentZoneId}' không tồn tại.` })

  const activeMonsters = await MonsterEngine.getMonstersInZone(character.currentZoneId)

  const currentZone = {
    ...currentZoneData,
    zoneId: character.currentZoneId,
    monsters: activeMonsters
  }

  if (!currentZone)
    throw createError({ statusCode: 404, statusMessage: 'Zone not found' })

  return {
    character,
    currentZone
  }
})
