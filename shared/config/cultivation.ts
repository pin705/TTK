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
