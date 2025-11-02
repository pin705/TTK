import type { ActionHandler } from '../types'
import { items } from '../../../shared/config/items'

export const spiritAttack: ActionHandler = async ({ character, payload }) => {
  if (character.class !== 'SpiritReader') {
    throw new Error('Chỉ Niệm Sư mới có thể sử dụng tấn công tinh thần')
  }
  
  if (!character.combat || !character.inCombat) {
    throw new Error('Bạn không trong trạng thái chiến đấu')
  }
  
  // Check if equipped spirit weapon
  const weaponId = character.equipment.weapon
  if (!weaponId) {
    throw new Error('Cần trang bị vũ khí tinh thần')
  }
  
  const weapon = items[weaponId as keyof typeof items]
  if (!weapon || weapon.type !== 'spirit_weapon') {
    throw new Error('Vũ khí không phải loại tinh thần')
  }
  
  // Calculate damage based on spirit stat
  const baseDamage = character.stats.spirit + (weapon.stats?.spirit || 0)
  const damage = Math.floor(baseDamage * (0.8 + Math.random() * 0.4))
  
  const logs: { type: string; message: string }[] = []
  
  // Check if weapon has AoE capability
  const aoeTargets = (weapon.stats as any)?.aoe || 1
  
  if (aoeTargets > 1) {
    logs.push({ type: 'combat', message: `[CHIẾN ĐẤU]: ${aoeTargets} phi đao của bạn xé toạc không khí!` })
    
    // For simplicity, attack the same monster multiple times (in real game, would be multiple monsters)
    for (let i = 0; i < aoeTargets; i++) {
      const singleDamage = Math.floor(damage * 0.7) // AoE has reduced damage
      character.combat.monsterHp = Math.max(0, character.combat.monsterHp - singleDamage)
      logs.push({ type: 'combat', message: `[CHIẾN ĐẤU]: Gây ${singleDamage} sát thương cho [${character.combat.monsterName}].` })
    }
  } else {
    character.combat.monsterHp = Math.max(0, character.combat.monsterHp - damage)
    logs.push({ type: 'combat', message: `[CHIẾN ĐẤU]: Bạn tung niệm lực tấn công [${character.combat.monsterName}], gây ${damage} sát thương!` })
  }
  
  // Consume spirit energy
  const spiritCost = 10 // TODO: Move to gameSettings if needed
  character.energy = Math.max(0, character.energy - spiritCost)
  logs.push({ type: 'system', message: `[HỆ THỐNG]: Tiêu hao ${spiritCost} Niệm Lực.` })
  
  // Check if monster defeated
  if (character.combat.monsterHp <= 0) {
    logs.push({ type: 'combat', message: `[CHIẾN ĐẤU]: [${character.combat.monsterName}] đã bị tiêu diệt!` })
    character.combat = null
    character.inCombat = false
  }
  
  return {
    log: logs,
    updates: {
      combat: character.combat,
      inCombat: character.inCombat,
      energy: character.energy
    }
  }
}
