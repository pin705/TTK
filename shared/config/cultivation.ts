export const realms = {
  // Học Đồ
  apprentice_low: {
    level: 10, name: 'Học Đồ Cấp Thấp', expRequired: 100,
    breakthrough: { baseSuccessChance: 1.0 }, statGains: { hpMax: 20, energyMax: 50, attack: 2, defense: 1 }
  },
  apprentice_mid: {
    level: 20, name: 'Học Đồ Cấp Trung', expRequired: 300,
    breakthrough: { baseSuccessChance: 1.0 }, statGains: { hpMax: 30, energyMax: 100, attack: 3, defense: 1 }
  },
  apprentice_high: {
    level: 30, name: 'Học Đồ Cấp Cao', expRequired: 800,
    breakthrough: { baseSuccessChance: 0.95 }, statGains: { hpMax: 50, energyMax: 150, attack: 5, defense: 3 }
  },

  // Võ Giả
  fighter_low: {
    level: 40, name: 'Võ Giả Cấp Thấp', expRequired: 2000,
    breakthrough: { baseSuccessChance: 0.85, failurePenalty: { expLossPercent: 0.15 } },
    statGains: { hpMax: 100, energyMax: 300, attack: 10, defense: 5 }
  },
  fighter_mid: {
    level: 50, name: 'Võ Giả Cấp Trung', expRequired: 5000,
    breakthrough: { baseSuccessChance: 0.75, failurePenalty: { expLossPercent: 0.20 } },
    statGains: { hpMax: 150, energyMax: 500, attack: 15, defense: 10 }
  },
  fighter_high: {
    level: 60, name: 'Võ Giả Cấp Cao', expRequired: 12000,
    breakthrough: { baseSuccessChance: 0.65, failurePenalty: { expLossPercent: 0.25 } },
    statGains: { hpMax: 250, energyMax: 800, attack: 25, defense: 15 }
  },

  // Chiến Tướng
  warlord_low: {
    level: 70, name: 'Chiến Tướng Cấp Thấp', expRequired: 30000,
    breakthrough: { baseSuccessChance: 0.50, failurePenalty: { expLossPercent: 0.30 } },
    statGains: { hpMax: 500, energyMax: 1500, attack: 50, defense: 30 }
  }
} as const

export type RealmId = keyof typeof realms

// === EVOLUTION RANKS (Gene-based System) ===
export const evolutionRanks = {
  // Học Đồ (Apprentice) - Levels 1-9
  apprentice_1: { name: 'Học Đồ Cấp 1', geneEnergyRequired: 50, statGains: { hpMax: 10, energyMax: 20, attack: 1, defense: 1 } },
  apprentice_2: { name: 'Học Đồ Cấp 2', geneEnergyRequired: 100, statGains: { hpMax: 10, energyMax: 20, attack: 1, defense: 1 } },
  apprentice_3: { name: 'Học Đồ Cấp 3', geneEnergyRequired: 150, statGains: { hpMax: 10, energyMax: 20, attack: 1, defense: 1 } },
  apprentice_4: { name: 'Học Đồ Cấp 4', geneEnergyRequired: 200, statGains: { hpMax: 10, energyMax: 20, attack: 1, defense: 1 } },
  apprentice_5: { name: 'Học Đồ Cấp 5', geneEnergyRequired: 250, statGains: { hpMax: 10, energyMax: 20, attack: 1, defense: 1 } },
  apprentice_6: { name: 'Học Đồ Cấp 6', geneEnergyRequired: 300, statGains: { hpMax: 10, energyMax: 20, attack: 1, defense: 1 } },
  apprentice_7: { name: 'Học Đồ Cấp 7', geneEnergyRequired: 400, statGains: { hpMax: 10, energyMax: 20, attack: 1, defense: 1 } },
  apprentice_8: { name: 'Học Đồ Cấp 8', geneEnergyRequired: 500, statGains: { hpMax: 10, energyMax: 20, attack: 1, defense: 1 } },
  apprentice_9: { name: 'Học Đồ Cấp 9', geneEnergyRequired: 600, statGains: { hpMax: 10, energyMax: 20, attack: 1, defense: 1 }, 
    breakthrough: { requiresItem: 'gene_solution_basic', baseSuccessChance: 0.95, failurePenalty: { geneIntegrityLoss: 5 } } },
  
  // Chiến Sĩ (Soldier)
  soldier_low: { name: 'Chiến Sĩ Sơ Cấp', geneEnergyRequired: 1500, statGains: { hpMax: 50, energyMax: 100, attack: 5, defense: 3 } },
  soldier_mid: { name: 'Chiến Sĩ Trung Cấp', geneEnergyRequired: 3000, statGains: { hpMax: 80, energyMax: 150, attack: 8, defense: 5 } },
  soldier_high: { name: 'Chiến Sĩ Cao Cấp', geneEnergyRequired: 5000, statGains: { hpMax: 120, energyMax: 200, attack: 12, defense: 8 },
    breakthrough: { requiresItem: 'gene_solution_advanced', baseSuccessChance: 0.85, failurePenalty: { geneIntegrityLoss: 10 } } },
  
  // Chiến Tướng (General)
  general_low: { name: 'Chiến Tướng Sơ Cấp', geneEnergyRequired: 10000, statGains: { hpMax: 200, energyMax: 400, attack: 20, defense: 15 } },
  general_mid: { name: 'Chiến Tướng Trung Cấp', geneEnergyRequired: 20000, statGains: { hpMax: 300, energyMax: 600, attack: 30, defense: 20 } },
  general_high: { name: 'Chiến Tướng Cao Cấp', geneEnergyRequired: 40000, statGains: { hpMax: 500, energyMax: 1000, attack: 50, defense: 30 },
    breakthrough: { requiresItem: 'gene_solution_elite', baseSuccessChance: 0.70, failurePenalty: { geneIntegrityLoss: 15 } } },
  
  // Chiến Thần (Wargod)
  wargod: { name: 'Chiến Thần', geneEnergyRequired: 80000, statGains: { hpMax: 1000, energyMax: 2000, attack: 100, defense: 60 },
    breakthrough: { requiresItem: 'gene_solution_legendary', baseSuccessChance: 0.50, failurePenalty: { geneIntegrityLoss: 20 } } },
  
  // Hành Tinh Cấp (Planetary) - Space travel unlocked
  planetary_low: { name: 'Hành Tinh Cấp Sơ Cấp', geneEnergyRequired: 150000, statGains: { hpMax: 2000, energyMax: 4000, attack: 200, defense: 120 } },
} as const

export type EvolutionRankId = keyof typeof evolutionRanks
