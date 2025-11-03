// Guild War Declaration (Feature 2)
import type { ActionHandler } from '../types'
import { Guild } from '~/server/models/guild.model'
import { gameSettings } from '~/shared/config/gameSettings'

export const declareWar: ActionHandler = async (character, payload, log) => {
  const { targetGuildId } = payload as { targetGuildId: string }

  // Validate character is in a guild
  if (!character.guildId) {
    log('SYSTEM', 'Bạn phải gia nhập bang hội trước.')
    return { success: false }
  }

  // Get character's guild
  const guild = await Guild.findById(character.guildId)
  if (!guild) {
    log('SYSTEM', 'Không tìm thấy bang hội của bạn.')
    return { success: false }
  }

  // Check if character is guild owner
  if (guild.owner.toString() !== character._id.toString()) {
    log('SYSTEM', 'Chỉ bang chủ mới có thể tuyên chiến.')
    return { success: false }
  }

  // Get target guild
  const targetGuild = await Guild.findById(targetGuildId)
  if (!targetGuild) {
    log('SYSTEM', 'Không tìm thấy bang hội mục tiêu.')
    return { success: false }
  }

  // Check if own guild
  if (guild._id.toString() === targetGuildId) {
    log('SYSTEM', 'Không thể tuyên chiến với chính mình.')
    return { success: false }
  }

  // Check war cooldown
  if (guild.lastWarTime) {
    const timeSinceLastWar = Date.now() - guild.lastWarTime.getTime()
    if (timeSinceLastWar < gameSettings.guild.warCooldown * 1000) {
      const remainingTime = Math.ceil((gameSettings.guild.warCooldown * 1000 - timeSinceLastWar) / 1000 / 60)
      log('SYSTEM', `Bang hội phải chờ ${remainingTime} phút nữa mới có thể tuyên chiến.`)
      return { success: false }
    }
  }

  // Check resources
  if (guild.resources < gameSettings.guild.warDeclarationCost) {
    log('SYSTEM', `Cần ${gameSettings.guild.warDeclarationCost} Tinh Thể Năng Lượng để tuyên chiến.`)
    return { success: false }
  }

  // Deduct resources
  guild.resources -= gameSettings.guild.warDeclarationCost
  guild.lastWarTime = new Date()
  
  // Create war entry
  guild.activeWars = guild.activeWars || []
  guild.activeWars.push({
    targetGuildId: targetGuild._id,
    startTime: new Date(),
    endTime: new Date(Date.now() + gameSettings.guild.warDuration * 1000),
    attackerScore: 0,
    defenderScore: 0
  })

  await guild.save()

  // Notify target guild
  targetGuild.activeWars = targetGuild.activeWars || []
  targetGuild.activeWars.push({
    targetGuildId: guild._id,
    startTime: new Date(),
    endTime: new Date(Date.now() + gameSettings.guild.warDuration * 1000),
    attackerScore: 0,
    defenderScore: 0,
    isDefender: true
  })
  await targetGuild.save()

  log('GUILD_WAR', `[${guild.name}] đã tuyên chiến với [${targetGuild.name}]!`)
  log('GUILD_WAR', `Chiến tranh sẽ kéo dài ${gameSettings.guild.warDuration / 3600} giờ.`)
  log('SYSTEM', `Đã tiêu tốn ${gameSettings.guild.warDeclarationCost} Tinh Thể Năng Lượng.`)

  return { success: true }
}
