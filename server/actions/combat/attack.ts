import type { ActionHandler } from '../types'

export const attack: ActionHandler = async ({ character }) => {
  if (!character.inCombat || !character.combat?.monsterId)
    throw new Error('Bạn không ở trong trận chiến.')

  const monster = MonsterManager.getMonsterTemplate(character.combat.monsterId)
  if (!monster)
    throw new Error('Quái vật không còn tồn tại.')

  const combatLog = new CombatLog({ characterId: character._id, monsterName: monster.name })
  const turnLogs: string[] = []

  // === Lượt của người chơi ===
  const playerAttack = calculateDamage(character, monster)
  character.combat.monsterHp -= playerAttack.damage
  const playerLog = `Bạn tấn công, ${playerAttack.isCrit ? 'CHÍ MẠNG!' : ''} gây ${playerAttack.damage} sát thương.`
  turnLogs.push(playerLog)
  combatLog.turns.push({ turn: combatLog.turns.length + 1, actor: 'player', action: 'attack', description: playerLog })

  // === Xử lý quái vật bị hạ gục ===
  if (character.combat.monsterHp <= 0) {
    character.inCombat = false
    character.cultivation.exp += monster.expReward
    turnLogs.push(`Bạn đã đánh bại [${monster.name}]! Nhận được ${monster.expReward} EXP.`)

    const rewards: any[] = []
    monster.drops.forEach((drop) => {
      if (Math.random() < drop.dropChance) {
        const quantity = Math.floor(Math.random() * (drop.quantity[1] - drop.quantity[0] + 1)) + drop.quantity[0]
        addItemToInventory(character, drop.itemId, quantity)
        turnLogs.push(`Bạn nhận được ${quantity} x [${drop.itemId}].`)
        rewards.push({ itemId: drop.itemId, quantity })
      }
    })

    combatLog.isVictory = true
    combatLog.rewards = rewards
    await combatLog.save()

    return {
      log: turnLogs,
      updates: {
        character: {
          inCombat: false,
          combat: null,
          cultivation: character.cultivation,
          inventory: character.inventory
        }
      }
    }
  }

  // === Lượt của quái vật ===
  const monsterAttack = calculateDamage(monster, character)
  character.hp -= monsterAttack.damage
  const monsterLog = `[${monster.name}] tấn công, ${monsterAttack.isCrit ? 'CHÍ MẠNG!' : ''} bạn mất ${monsterAttack.damage} HP.`
  turnLogs.push(monsterLog)
  combatLog.turns.push({ turn: combatLog.turns.length + 1, actor: 'monster', action: 'attack', description: monsterLog })

  // === Xử lý người chơi bị hạ gục ===
  if (character.hp <= 0) {
    character.inCombat = false
    character.hp = Math.floor(character.hpMax * 0.1) // Hồi sinh với 10% HP
    character.cultivation.stateOfMind = Math.max(0.1, character.cultivation.stateOfMind - 0.2) // Giảm tâm cảnh
    turnLogs.push(`Bạn đã bị đánh bại! Tâm cảnh bất ổn.`)

    combatLog.isVictory = false
    await combatLog.save()

    return {
      log: turnLogs,
      updates: { character: { inCombat: false, combat: null, hp: character.hp, cultivation: character.cultivation } }
    }
  }

  await combatLog.save()
  return {
    log: turnLogs,
    updates: {
      character: { hp: character.hp, combat: character.combat }
    }
  }
}
