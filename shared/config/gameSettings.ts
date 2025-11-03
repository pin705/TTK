// Game Settings and Constants

export const gameSettings = {
  // Guild System
  guild: {
    creationCost: 10000, // Energy Crystals
    maxMembers: 50,
    // Guild War System (Feature 2)
    warDeclarationCost: 50000, // Cost to declare war
    warDuration: 7200, // 2 hours in seconds
    warCooldown: 86400, // 24 hours cooldown between wars
    territoryControlReward: 10000, // Energy crystals per territory controlled
    warVictoryReward: 100000, // Bonus for winning guild war
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
    // Pet Breeding (Feature 7)
    breedingCooldown: 86400, // 24 hours between breedings
    breedingSuccessRate: 0.7, // 70% success rate
    evolutionSuccessRate: 0.8, // 80% success rate with evolution stone
    maxPetLevel: 100,
    petExpPerLevel: 1000, // Base exp needed per level
  },

  // Space Travel
  ship: {
    fuelCosts: {
      Moon: 20,
      Mars: 50,
      AsteroidBelt: 40,
      Earth: 30,
      Jupiter: 80,
      Saturn: 100,
      DeepSpace: 120,
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

  // Transformation System (Feature 3)
  transformation: {
    baseDuration: 300, // 5 minutes base duration
    cooldown: 1800, // 30 minutes cooldown
    energyCost: 200, // Energy cost to transform
    statMultiplier: 1.5, // 50% stat increase while transformed
  },

  // Housing System (Feature 8)
  housing: {
    baseBuildingCost: 100000, // Energy crystals to unlock housing
    upgradeBaseCost: 50000, // Base cost for upgrades
    maxRooms: 10, // Max rooms in a house
    furnitureBuffDuration: 3600, // 1 hour buff from furniture
  },
} as const

export type GameSettings = typeof gameSettings
