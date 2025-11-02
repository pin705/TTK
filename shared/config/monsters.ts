export const monsters = {
  // Cấp Thú Binh - Sơ Cấp (Beast Soldier - Low)
  bloodfang_boar: {
    name: 'Nanh Máu Lợn Rừng', level: 1, expReward: 15,
    tier: 'beast_soldier_low' as const,
    drops: [
      { itemId: 'monster_hide_low', chance: 0.8, quantity: [1, 2] }, 
      { itemId: 'monster_bone_low', chance: 0.5, quantity: [1, 3] },
      { itemId: 'energy_crystal', chance: 0.3, quantity: [1, 2] }
    ],
    stats: {
      hp: 50,
      attack: 2,
      defense: 3,
      critChance: 0.1,
      critDamage: 1.5,
      resistance: 2
    }
  },
  // Cấp Thú Binh - Trung Cấp (Beast Soldier - Mid)
  horned_wolf: {
    name: 'Thiết Giáp Sói Sừng', level: 2, expReward: 25,
    tier: 'beast_soldier_mid' as const,
    drops: [
      { itemId: 'monster_hide_low', chance: 0.7, quantity: [1, 1] }, 
      { itemId: 'monster_tendon_low', chance: 0.2, quantity: [1, 1] },
      { itemId: 'energy_crystal', chance: 0.4, quantity: [2, 3] }
    ],
    stats: {
      hp: 120,
      attack: 18,
      defense: 8,
      critChance: 0.12,
      critDamage: 1.6,
      resistance: 3
    }
  },
  // Cấp Thú Binh - Cao Cấp (Beast Soldier - High)
  shadow_cat: {
    name: 'Ảnh Miêu', level: 4, expReward: 40,
    tier: 'beast_soldier_high' as const,
    drops: [
      { itemId: 'monster_tendon_low', chance: 0.3, quantity: [1, 2] },
      { itemId: 'energy_crystal', chance: 0.5, quantity: [3, 5] }
    ],
    stats: {
      hp: 150,
      attack: 25,
      defense: 10,
      critChance: 0.15,
      critDamage: 1.7,
      resistance: 5
    }
  },

  // Cấp Thú Tướng - Sơ Cấp (Beast General - Low)
  iron_fist_ape: {
    name: 'Thiết Quyền Viên Hầu', level: 7, expReward: 120,
    tier: 'beast_general_low' as const,
    drops: [
      { itemId: 'monster_tendon_mid', chance: 0.5, quantity: [2, 3] }, 
      { itemId: 'blue_gold_ore', chance: 0.1, quantity: [1, 1] },
      { itemId: 'energy_crystal', chance: 0.7, quantity: [5, 8] },
      { itemId: 'cosmic_herb_low', chance: 0.1, quantity: [1, 1] }
    ],
    stats: {
      hp: 500,
      attack: 55,
      defense: 30,
      critChance: 0.18,
      critDamage: 1.8,
      resistance: 15
    }
  },
  // Cấp Thú Tướng - Trung Cấp (Beast General - Mid)
  silvermoon_mastiff: {
    name: 'Ngân Nguyệt Ngao', level: 9, expReward: 200,
    tier: 'beast_general_mid' as const,
    drops: [
      { itemId: 'monster_hide_mid', chance: 0.9, quantity: [3, 5] }, 
      { itemId: 'life_essence_low', chance: 0.05, quantity: [1, 1] },
      { itemId: 'energy_crystal', chance: 0.8, quantity: [8, 12] },
      { itemId: 'cosmic_herb_mid', chance: 0.05, quantity: [1, 1] }
    ],
    stats: {
      hp: 800,
      attack: 70,
      defense: 45,
      critChance: 0.2,
      critDamage: 1.9,
      resistance: 20
    }
  },

  // Cấp Vương (King Rank)
  armored_tiger: {
    name: 'Giáp Sắt Mãnh Hổ (Vương Cấp)', level: 12, expReward: 500,
    tier: 'beast_king' as const,
    drops: [
      { itemId: 'kele_metal_fragment', chance: 0.1, quantity: [1, 1] }, 
      { itemId: 'life_essence_low', chance: 0.2, quantity: [1, 2] },
      { itemId: 'energy_crystal', chance: 1.0, quantity: [15, 25] },
      { itemId: 'cosmic_herb_mid', chance: 0.2, quantity: [1, 2] },
      { itemId: 'gene_solution_basic', chance: 0.05, quantity: [1, 1] }
    ],
    stats: {
      hp: 1500,
      attack: 100,
      defense: 60,
      critChance: 0.22,
      critDamage: 2.0,
      resistance: 25
    }
  }
} as const

export type MonsterId = keyof typeof monsters
export type MonsterTier = 'beast_soldier_low' | 'beast_soldier_mid' | 'beast_soldier_high' | 'beast_general_low' | 'beast_general_mid' | 'beast_general_high' | 'beast_king'
