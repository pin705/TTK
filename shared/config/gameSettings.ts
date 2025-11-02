// Game Settings and Constants

export const gameSettings = {
  // Guild System
  guild: {
    creationCost: 10000, // Energy Crystals
    maxMembers: 50,
  },

  // Market System
  market: {
    transactionTaxRate: 0.05, // 5% tax
  },

  // Crafting System
  crafting: {
    researchSuccessRate: 0.5, // 50% base success rate
  },

  // Pet System
  pet: {
    baseTameRate: 0.5, // 50% base taming success rate
    tameRingRequired: true, // Requires slave ring item
    spiritReaderOnly: true, // Only Spirit Readers can tame beasts
  },

  // Space Travel
  ship: {
    fuelCosts: {
      Moon: 20,
      Mars: 50,
      AsteroidBelt: 40,
      Earth: 30,
    },
    randomEventChance: 0.2, // 20% chance of random events
    energyStormChance: 0.1, // 10% of events are energy storms
    pirateChance: 0.1, // 10% of events are space pirates
    energyStormFuelLoss: 0.3, // 30% fuel loss from energy storms
    pirateHpDamage: 0.2, // 20% HP damage from space pirates
  },

  // Module System
  module: {
    maxSlots: 3,
    energyShieldCost: 50,
    energyShieldPower: 100,
  },

  // Class System
  class: {
    spiritAttackEnergyCost: 10,
  },
} as const

export type GameSettings = typeof gameSettings
