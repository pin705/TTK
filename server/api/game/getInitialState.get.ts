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

  const currentZoneData = ZoneManager.getZone(character.currentZoneId as any)
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

  // Check for tutorial quests and provide hints
  const tutorialHints: string[] = []
  if (character.activeQuests && character.activeQuests.length > 0) {
    const activeTutorialQuest = character.activeQuests.find(q => 
      q.questId.startsWith('tutorial_')
    )
    
    if (activeTutorialQuest) {
      // Add contextual hints based on current tutorial quest
      if (activeTutorialQuest.questId === 'tutorial_welcome') {
        tutorialHints.push('[Hướng dẫn] Chào mừng đến với Tinh Không Đạo Lộ! Hãy di chuyển đến Võ Quán để gặp Võ Sư Trương.')
        tutorialHints.push('[Gợi ý] Sử dụng lệnh "move" hoặc nhấp vào khu vực trên bản đồ để di chuyển.')
      } else if (activeTutorialQuest.questId === 'tutorial_first_combat') {
        tutorialHints.push('[Hướng dẫn] Hãy di chuyển ra Hoang Dã để bắt đầu chiến đấu với quái thú.')
        tutorialHints.push('[Gợi ý] Sử dụng lệnh "attack" để tấn công quái vật.')
      } else if (activeTutorialQuest.questId === 'tutorial_gather_resources') {
        tutorialHints.push('[Hướng dẫn] Sau khi đánh bại quái thú, bạn sẽ nhận được tài nguyên tự động.')
        tutorialHints.push('[Gợi ý] Kiểm tra túi đồ (Inventory) để xem tài nguyên đã thu thập.')
      }
    }
  }

  return {
    character,
    currentZone,
    tutorialHints
  }
})
