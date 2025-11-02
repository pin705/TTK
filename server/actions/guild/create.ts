import type { ActionHandler } from '../types'
import { Guild } from '../../models/guild.model'

export const create: ActionHandler = async ({ character, payload }) => {
  const { name } = payload as { name: string }
  
  if (!name || name.length < 3 || name.length > 30) {
    throw new Error('Tên guild phải từ 3-30 ký tự')
  }
  
  // Check if character already in a guild
  if (character.guildId) {
    throw new Error('Bạn đã có guild rồi')
  }
  
  // Check if guild name already exists
  const existingGuild = await Guild.findOne({ name })
  if (existingGuild) {
    throw new Error('Tên guild đã tồn tại')
  }
  
  // Check credits (cost to create guild)
  const requiredCost = 10000
  if (!character.resources?.energyCrystals || character.resources.energyCrystals < requiredCost) {
    throw new Error(`Cần ${requiredCost} Tinh Thể Năng Lượng để tạo guild`)
  }
  
  // Create guild
  const guild = await Guild.create({
    name,
    ownerId: character._id,
    members: [character._id],
    baseZoneId: `guild_base_${character._id}` // Unique guild base zone
  })
  
  // Update character
  character.guildId = guild._id as any
  character.resources.energyCrystals -= requiredCost
  
  return {
    log: [
      { type: 'system', message: `[HỆ THỐNG]: Tạo guild [${name}] thành công!` },
      { type: 'system', message: `[HỆ THỐNG]: Tiêu hao ${requiredCost} Tinh Thể Năng Lượng.` }
    ],
    updates: {
      guildId: guild._id,
      'resources.energyCrystals': character.resources.energyCrystals
    }
  }
}
