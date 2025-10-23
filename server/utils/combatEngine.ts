interface Actor {
  stats: { attack: number, defense: number, critChance: number, critDamage: number, resistance: number }
  hp: number
  effects: any[]
}

export function calculateDamage(attacker: Actor, defender: Actor, weaponMultiplier = 1.0, skillPower = 0) {
  const isCrit = Math.random() < (attacker.stats.critChance || 0)
  const critFactor = isCrit ? (attacker.stats.critDamage || 1) : 1
  const attack = attacker.stats.attack || 0
  const defense = defender.stats.defense || 0
  const resistance = defender.stats.resistance || 0

  const rawDamage = (attack * weaponMultiplier + skillPower) * critFactor
  const finalDamage = Math.max(1, rawDamage - (defense + resistance))
  return {
    damage: Math.floor(finalDamage),
    isCrit
  }
}
