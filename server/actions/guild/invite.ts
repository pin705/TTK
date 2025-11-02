import type { ActionHandler } from '../types'
import { Guild } from '../../models/guild.model'
import { Character } from '../../models/character.model'

export const invite: ActionHandler = async ({ character, payload }) => {
  const { targetCharacterId } = payload as { targetCharacterId: string }
  
  if (!character.guildId) {
    throw new Error('Bạn không có guild')
  }
  
  const guild = await Guild.findById(character.guildId)
  if (!guild) {
    throw new Error('Guild không tồn tại')
  }
  
  // Only owner can invite
  if (guild.ownerId.toString() !== character._id.toString()) {
    throw new Error('Chỉ chủ guild mới có thể mời thành viên')
  }
  
  const targetCharacter = await Character.findById(targetCharacterId)
  if (!targetCharacter) {
    throw new Error('Không tìm thấy người chơi')
  }
  
  if (targetCharacter.guildId) {
    throw new Error('Người chơi đã có guild')
  }
  
  // Add member to guild
  guild.members.push(targetCharacter._id as any)
  await guild.save()
  
  targetCharacter.guildId = guild._id as any
  await targetCharacter.save()
  
  return {
    log: [
      { type: 'guild', message: `[GUILD]: [${targetCharacter.name}] đã tham gia guild!` }
    ],
    updates: {}
  }
}
