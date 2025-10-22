export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const characterId = session?.character?._id
  if (!characterId) {
    throw createError({ statusCode: 401, message: 'Yêu cầu nhân vật để thực hiện hành động' })
  }

  console.log('Fetching initial state for character:', characterId)
  const character = await Character.findById(characterId)
    .lean()

  if (!character)
    throw createError({ statusCode: 404, statusMessage: 'Character not found' })

  const currentZoneData = ZoneManager.getZone(character.currentZoneId)
  if (!currentZoneData)
    throw createError({ statusCode: 404, statusMessage: `Khu vực '${character.currentZoneId}' không tồn tại.` })

  // Populate thông tin quái vật từ config
  const populatedMonsters = (currentZoneData.monsters || []).map(entry => ({
    ...entry,
    monsterData: MonsterManager.getMonsterTemplate(entry.monsterId)
  }))

  const currentZone = {
    ...currentZoneData,
    monsters: populatedMonsters
  }

  if (!currentZone)
    throw createError({ statusCode: 404, statusMessage: 'Zone not found' })

  return {
    character,
    currentZone
  }
})
