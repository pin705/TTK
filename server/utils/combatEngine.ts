interface Actor {
  stats: { attack: number, defense: number, critChance: number, critDamage: number, resistance: number }
  hp: number
  effects: any[]
}

export function calculateDamage(attacker: Actor, defender: Actor, weaponMultiplier = 1.0, skillPower = 0) {
  const isCrit = Math.random() < attacker.stats.critChance
  const critFactor = isCrit ? attacker.stats.critDamage : 1
  const rawDamage = (attacker.stats.attack * weaponMultiplier + skillPower) * critFactor
  const finalDamage = Math.max(1, rawDamage - (defender.stats.defense + defender.stats.resistance))

  return {
    damage: Math.floor(finalDamage),
    isCrit
  }
}
