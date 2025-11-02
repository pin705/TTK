// Racial Skill System
import type { ActionContext } from '../types'
import { races } from '~/shared/config/races'

interface RacialSkillPayload {
  skillId: string
}

export async function useRacialSkill(context: ActionContext, payload: RacialSkillPayload) {
  const { character } = context
  const logs: string[] = []

  // Get character's race
  const race = character.race
  if (!race) {
    logs.push('[ERROR]: Không tìm thấy thông tin chủng tộc.')
    return
  }

  const raceConfig = races[race as keyof typeof races]
  if (!raceConfig) {
    logs.push('[ERROR]: Chủng tộc không hợp lệ.')
    return
  }

  // Find the skill
  const skill = raceConfig.innateSkills.find(s => s.id === payload.skillId)
  if (!skill) {
    logs.push('[ERROR]: Kỹ năng không tồn tại.')
    return
  }

  // Check if it's a passive skill (can't be manually activated)
  if (skill.type === 'passive') {
    logs.push('[INFO]: Kỹ năng bị động không thể kích hoạt thủ công.')
    return
  }

  // Check energy cost
  if (skill.energyCost && character.energy < skill.energyCost) {
    logs.push(`[ERROR]: Không đủ năng lượng. Cần ${skill.energyCost} năng lượng.`)
    return
  }

  // Consume energy
  if (skill.energyCost) {
    character.energy -= skill.energyCost
    logs.push(`[SYSTEM]: Tiêu hao ${skill.energyCost} năng lượng.`)
  }

  // Execute skill effect
  logs.push(`[SKILL]: Kích hoạt [${skill.name}]!`)
  logs.push(`[INFO]: ${skill.description}`)

  // Apply effects based on skill
  switch (payload.skillId) {
    case 'human_willpower':
      // Heal 30% HP and add defense buff
      const healAmount = Math.floor(character.hpMax * 0.3)
      character.hp = Math.min(character.hp + healAmount, character.hpMax)
      logs.push(`[HEAL]: Hồi phục ${healAmount} HP.`)
      
      // Add temporary defense buff (would need effect system to track duration)
      if (!character.effects) {
        character.effects = []
      }
      character.effects.push({
        effectId: 'human_willpower_buff',
        name: 'Ý Chí Sắt Đá',
        durationTurns: 30,
        expiresAt: new Date(Date.now() + 30000) // 30 seconds
      })
      logs.push('[BUFF]: Tăng 20% phòng thủ trong 30 giây.')
      break

    case 'mutant_rage':
      // Add rage buff (increased damage, reduced defense)
      if (!character.effects) {
        character.effects = []
      }
      character.effects.push({
        effectId: 'mutant_rage',
        name: 'Cuồng Nộ',
        durationTurns: 20,
        expiresAt: new Date(Date.now() + 20000) // 20 seconds
      })
      logs.push('[BUFF]: Tăng 50% sát thương nhưng giảm 20% phòng thủ trong 20 giây!')
      break

    case 'esper_telekinesis':
      // Spirit AoE attack (would need combat system integration)
      if (character.inCombat && character.combat) {
        const damage = Math.floor(character.stats.spirit * 1.5)
        logs.push(`[COMBAT]: Phóng ra 5 làn sóng niệm lực!`)
        logs.push(`[COMBAT]: Gây ${damage} sát thương tinh thần!`)
        
        // Apply damage to current enemy (simplified)
        if (character.combat.monsterHp) {
          character.combat.monsterHp = Math.max(0, character.combat.monsterHp - damage)
        }
      } else {
        logs.push('[INFO]: Chỉ có thể sử dụng kỹ năng này trong chiến đấu.')
      }
      break

    case 'cyborg_overload':
      // Boost all modules
      if (!character.effects) {
        character.effects = []
      }
      character.effects.push({
        effectId: 'cyborg_overload',
        name: 'Quá Tải Hệ Thống',
        durationTurns: 25,
        expiresAt: new Date(Date.now() + 25000) // 25 seconds
      })
      logs.push('[BUFF]: Tất cả module hoạt động ở 130% công suất trong 25 giây!')
      break

    case 'beastkin_hunt':
      // Hunt mode - speed and damage boost
      if (!character.effects) {
        character.effects = []
      }
      character.effects.push({
        effectId: 'beastkin_hunt',
        name: 'Bản Năng Săn Mồi',
        durationTurns: 15,
        expiresAt: new Date(Date.now() + 15000) // 15 seconds
      })
      logs.push('[BUFF]: Tăng 40% tốc độ và 25% sát thương trong 15 giây!')
      break

    case 'voidwalker_strike':
      // Assassinate attack
      if (character.inCombat && character.combat) {
        const baseDamage = character.stats.attack * 3.0 // 300% damage
        const defense = 0 // Ignore 50% defense (simplified)
        const damage = Math.floor(baseDamage)
        
        logs.push(`[COMBAT]: [Nhất Kích Tất Sát]!`)
        logs.push(`[COMBAT]: Gây ${damage} sát thương chí mạng và bỏ qua phòng thủ!`)
        
        if (character.combat.monsterHp) {
          character.combat.monsterHp = Math.max(0, character.combat.monsterHp - damage)
        }
      } else {
        logs.push('[INFO]: Chỉ có thể sử dụng kỹ năng này trong chiến đấu.')
      }
      break

    default:
      logs.push('[ERROR]: Kỹ năng chưa được triển khai.')
  }

  return { logs }
}
