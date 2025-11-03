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
      { itemId: 'gene_solution_basic', chance: 0.05, quantity: [1, 1] },
      // Epic equipment drops
      { itemId: 'tiger_king_fang_blade', chance: 0.02, quantity: [1, 1] },
      { itemId: 'beast_king_crown', chance: 0.01, quantity: [1, 1] }
    ],
    stats: {
      hp: 1500,
      attack: 100,
      defense: 60,
      critChance: 0.22,
      critDamage: 2.0,
      resistance: 25
    }
  },

  // === NEW MONSTERS - EXPANDED CONTENT ===
  
  // Forest/Jungle Monsters (Hoang Da 0203)
  venomous_spider: {
    name: 'Nhện Độc', level: 15, expReward: 180,
    tier: 'beast_general_low' as const,
    drops: [
      { itemId: 'venom_sac', chance: 0.6, quantity: [1, 2] },
      { itemId: 'monster_hide_mid', chance: 0.4, quantity: [1, 2] },
      { itemId: 'energy_crystal', chance: 0.5, quantity: [6, 10] }
    ],
    stats: {
      hp: 600,
      attack: 60,
      defense: 25,
      critChance: 0.15,
      critDamage: 1.7,
      resistance: 10
    }
  },

  mutant_mantis: {
    name: 'Bọ Ngựa Biến Dị', level: 16, expReward: 200,
    tier: 'beast_general_low' as const,
    drops: [
      { itemId: 'sharp_blade_limb', chance: 0.5, quantity: [1, 1] },
      { itemId: 'monster_tendon_mid', chance: 0.4, quantity: [1, 2] },
      { itemId: 'energy_crystal', chance: 0.6, quantity: [7, 11] }
    ],
    stats: {
      hp: 650,
      attack: 75,
      defense: 20,
      critChance: 0.25,
      critDamage: 2.0,
      resistance: 8
    }
  },

  toxic_vine: {
    name: 'Dây Leo Độc', level: 14, expReward: 150,
    tier: 'beast_soldier_high' as const,
    drops: [
      { itemId: 'toxic_extract', chance: 0.7, quantity: [1, 3] },
      { itemId: 'cosmic_herb_low', chance: 0.3, quantity: [1, 1] },
      { itemId: 'energy_crystal', chance: 0.4, quantity: [5, 8] }
    ],
    stats: {
      hp: 400,
      attack: 40,
      defense: 15,
      critChance: 0.1,
      critDamage: 1.5,
      resistance: 12
    }
  },

  // Rocky Area Monsters (Hoang Da 0204)
  razor_hawk: {
    name: 'Diều Hâu Dao Cạnh', level: 20, expReward: 250,
    tier: 'beast_general_mid' as const,
    drops: [
      { itemId: 'razor_feather', chance: 0.6, quantity: [2, 4] },
      { itemId: 'monster_hide_mid', chance: 0.5, quantity: [2, 3] },
      { itemId: 'energy_crystal', chance: 0.7, quantity: [10, 15] }
    ],
    stats: {
      hp: 850,
      attack: 85,
      defense: 35,
      critChance: 0.22,
      critDamage: 1.9,
      resistance: 15
    }
  },

  rock_lizard: {
    name: 'Thằn Lằn Đá', level: 19, expReward: 230,
    tier: 'beast_general_low' as const,
    drops: [
      { itemId: 'stone_scale', chance: 0.7, quantity: [2, 4] },
      { itemId: 'blue_gold_ore', chance: 0.2, quantity: [1, 2] },
      { itemId: 'energy_crystal', chance: 0.6, quantity: [9, 14] }
    ],
    stats: {
      hp: 950,
      attack: 65,
      defense: 55,
      critChance: 0.15,
      critDamage: 1.6,
      resistance: 25
    }
  },

  crystal_scorpion: {
    name: 'Bọ Cạp Tinh Thể', level: 21, expReward: 280,
    tier: 'beast_general_mid' as const,
    drops: [
      { itemId: 'crystal_shard', chance: 0.5, quantity: [1, 2] },
      { itemId: 'venom_sac', chance: 0.4, quantity: [1, 2] },
      { itemId: 'energy_crystal', chance: 0.8, quantity: [12, 18] }
    ],
    stats: {
      hp: 900,
      attack: 80,
      defense: 45,
      critChance: 0.18,
      critDamage: 1.8,
      resistance: 20
    }
  },

  // Boss Monsters
  poison_spider_queen: {
    name: 'Nữ Vương Nhện Độc (Boss)', level: 18, expReward: 800,
    tier: 'beast_king' as const,
    drops: [
      { itemId: 'spider_queen_fang', chance: 0.8, quantity: [1, 1] },
      { itemId: 'venom_sac', chance: 1.0, quantity: [5, 8] },
      { itemId: 'energy_crystal', chance: 1.0, quantity: [20, 30] },
      { itemId: 'cosmic_herb_mid', chance: 0.3, quantity: [2, 3] },
      { itemId: 'gene_solution_basic', chance: 0.08, quantity: [1, 1] },
      // Rare equipment drops
      { itemId: 'venom_blade', chance: 0.03, quantity: [1, 1] },
      { itemId: 'spider_silk_armor', chance: 0.025, quantity: [1, 1] },
      { itemId: 'venom_ring', chance: 0.02, quantity: [1, 1] }
    ],
    stats: {
      hp: 2000,
      attack: 110,
      defense: 50,
      critChance: 0.2,
      critDamage: 2.0,
      resistance: 20
    }
  },

  toxic_treant: {
    name: 'Cây Tinh Độc Dược (Boss)', level: 17, expReward: 700,
    tier: 'beast_king' as const,
    drops: [
      { itemId: 'treant_heart', chance: 0.9, quantity: [1, 1] },
      { itemId: 'toxic_extract', chance: 1.0, quantity: [4, 7] },
      { itemId: 'energy_crystal', chance: 1.0, quantity: [18, 28] },
      { itemId: 'cosmic_herb_low', chance: 0.5, quantity: [3, 5] }
    ],
    stats: {
      hp: 2200,
      attack: 90,
      defense: 70,
      critChance: 0.15,
      critDamage: 1.8,
      resistance: 30
    }
  },

  stone_golem_king: {
    name: 'Vua Golem Đá (Boss)', level: 22, expReward: 900,
    tier: 'beast_king' as const,
    drops: [
      { itemId: 'golem_core', chance: 0.85, quantity: [1, 1] },
      { itemId: 'ancient_stone', chance: 1.0, quantity: [3, 6] },
      { itemId: 'kele_metal_fragment', chance: 0.2, quantity: [1, 2] },
      { itemId: 'energy_crystal', chance: 1.0, quantity: [25, 35] },
      { itemId: 'gene_solution_basic', chance: 0.1, quantity: [1, 2] },
      // Epic equipment drops
      { itemId: 'golem_hammer', chance: 0.02, quantity: [1, 1] },
      { itemId: 'golem_shell', chance: 0.015, quantity: [1, 1] },
      { itemId: 'golem_heart_stone', chance: 0.01, quantity: [1, 1] }
    ],
    stats: {
      hp: 2800,
      attack: 120,
      defense: 90,
      critChance: 0.18,
      critDamage: 2.0,
      resistance: 35
    }
  },

  // Chaos Zone Monsters
  steel_beast: {
    name: 'Dã Thú Thép', level: 25, expReward: 350,
    tier: 'beast_general_mid' as const,
    drops: [
      { itemId: 'steel_plate', chance: 0.6, quantity: [1, 3] },
      { itemId: 'alloy_ore', chance: 0.4, quantity: [2, 4] },
      { itemId: 'energy_crystal', chance: 0.7, quantity: [12, 20] }
    ],
    stats: {
      hp: 1100,
      attack: 95,
      defense: 60,
      critChance: 0.2,
      critDamage: 1.9,
      resistance: 25
    }
  },

  electric_wolf: {
    name: 'Sói Điện', level: 26, expReward: 380,
    tier: 'beast_general_mid' as const,
    drops: [
      { itemId: 'electric_core', chance: 0.5, quantity: [1, 2] },
      { itemId: 'monster_tendon_mid', chance: 0.5, quantity: [2, 3] },
      { itemId: 'energy_crystal', chance: 0.8, quantity: [15, 22] }
    ],
    stats: {
      hp: 1000,
      attack: 110,
      defense: 45,
      critChance: 0.25,
      critDamage: 2.0,
      resistance: 18
    }
  },

  // Advanced Secret Realm Monsters
  ancient_guardian: {
    name: 'Vệ Binh Cổ Đại', level: 35, expReward: 600,
    tier: 'beast_general_high' as const,
    drops: [
      { itemId: 'ancient_relic', chance: 0.4, quantity: [1, 2] },
      { itemId: 'ruin_module', chance: 0.3, quantity: [1, 2] },
      { itemId: 'energy_crystal', chance: 0.9, quantity: [20, 30] }
    ],
    stats: {
      hp: 1800,
      attack: 140,
      defense: 80,
      critChance: 0.22,
      critDamage: 2.0,
      resistance: 30
    }
  },

  ruin_sentinel: {
    name: 'Canh Gác Tàn Tích', level: 34, expReward: 580,
    tier: 'beast_general_high' as const,
    drops: [
      { itemId: 'ancient_relic', chance: 0.35, quantity: [1, 1] },
      { itemId: 'alloy_ore', chance: 0.5, quantity: [4, 7] },
      { itemId: 'energy_crystal', chance: 0.85, quantity: [18, 28] }
    ],
    stats: {
      hp: 1650,
      attack: 135,
      defense: 75,
      critChance: 0.2,
      critDamage: 1.9,
      resistance: 28
    }
  },

  // Underground Monsters
  tunnel_crawler: {
    name: 'Sinh Vật Bò Hầm', level: 28, expReward: 420,
    tier: 'beast_general_mid' as const,
    drops: [
      { itemId: 'bio_sample', chance: 0.5, quantity: [1, 2] },
      { itemId: 'monster_hide_mid', chance: 0.4, quantity: [2, 4] },
      { itemId: 'energy_crystal', chance: 0.7, quantity: [14, 22] }
    ],
    stats: {
      hp: 1200,
      attack: 100,
      defense: 50,
      critChance: 0.18,
      critDamage: 1.8,
      resistance: 22
    }
  },

  aberration_spawn: {
    name: 'Đẻ Dị Hình', level: 29, expReward: 450,
    tier: 'beast_general_mid' as const,
    drops: [
      { itemId: 'bio_sample', chance: 0.6, quantity: [2, 3] },
      { itemId: 'aberration_tissue', chance: 0.4, quantity: [1, 2] },
      { itemId: 'energy_crystal', chance: 0.75, quantity: [16, 24] }
    ],
    stats: {
      hp: 1150,
      attack: 105,
      defense: 45,
      critChance: 0.2,
      critDamage: 1.9,
      resistance: 20
    }
  },

  mutant_fungus: {
    name: 'Nấm Độc Biến Dị', level: 27, expReward: 400,
    tier: 'beast_general_low' as const,
    drops: [
      { itemId: 'fungal_spore', chance: 0.7, quantity: [2, 4] },
      { itemId: 'toxic_extract', chance: 0.3, quantity: [1, 2] },
      { itemId: 'energy_crystal', chance: 0.6, quantity: [13, 20] }
    ],
    stats: {
      hp: 1300,
      attack: 85,
      defense: 65,
      critChance: 0.15,
      critDamage: 1.7,
      resistance: 28
    }
  },

  aberration_lord: {
    name: 'Chúa Tể Dị Hình (Boss)', level: 32, expReward: 1200,
    tier: 'beast_king' as const,
    drops: [
      { itemId: 'aberration_core', chance: 0.95, quantity: [1, 1] },
      { itemId: 'bio_sample', chance: 1.0, quantity: [5, 10] },
      { itemId: 'gene_solution_advanced', chance: 0.12, quantity: [1, 1] },
      { itemId: 'energy_crystal', chance: 1.0, quantity: [35, 50] },
      { itemId: 'ruin_module', chance: 0.4, quantity: [1, 3] },
      // Epic and Legendary equipment drops
      { itemId: 'aberration_claw', chance: 0.015, quantity: [1, 1] },
      { itemId: 'aberration_hide', chance: 0.012, quantity: [1, 1] },
      { itemId: 'aberration_eye', chance: 0.003, quantity: [1, 1] }, // Legendary!
      { itemId: 'ancient_guardian_shield', chance: 0.015, quantity: [1, 1] },
      { itemId: 'celestial_ring', chance: 0.008, quantity: [1, 1] }
    ],
    stats: {
      hp: 3500,
      attack: 150,
      defense: 70,
      critChance: 0.25,
      critDamage: 2.2,
      resistance: 25
    }
  },

  // === NEW BOSSES (Feature 1) ===
  
  ice_wraith: {
    name: 'Linh Hồn Băng', level: 35, expReward: 400,
    tier: 'beast_general_high' as const,
    drops: [
      { itemId: 'frozen_crystal', chance: 0.8, quantity: [1, 2] },
      { itemId: 'ice_essence', chance: 0.3, quantity: [1, 1] },
      { itemId: 'energy_crystal', chance: 1.0, quantity: [20, 35] }
    ],
    stats: { hp: 1800, attack: 110, defense: 50, critChance: 0.2, critDamage: 1.9, resistance: 30 }
  },

  frost_golem: {
    name: 'Golem Băng', level: 36, expReward: 420,
    tier: 'beast_general_high' as const,
    drops: [
      { itemId: 'frozen_crystal', chance: 0.9, quantity: [2, 3] },
      { itemId: 'ice_essence', chance: 0.4, quantity: [1, 2] },
      { itemId: 'energy_crystal', chance: 1.0, quantity: [22, 38] }
    ],
    stats: { hp: 2200, attack: 95, defense: 80, critChance: 0.15, critDamage: 1.8, resistance: 40 }
  },

  ice_queen_boss: {
    name: 'Nữ Hoàng Băng (Boss)', level: 40, expReward: 1200,
    tier: 'beast_king' as const,
    drops: [
      { itemId: 'ice_crown', chance: 0.15, quantity: [1, 1] },
      { itemId: 'ice_scepter', chance: 0.12, quantity: [1, 1] },
      { itemId: 'frozen_heart', chance: 0.08, quantity: [1, 1] },
      { itemId: 'gene_solution_elite', chance: 0.1, quantity: [1, 1] },
      { itemId: 'energy_crystal', chance: 1.0, quantity: [50, 80] }
    ],
    stats: { hp: 5000, attack: 180, defense: 90, critChance: 0.28, critDamage: 2.3, resistance: 35 }
  },

  lava_serpent: {
    name: 'Xà Nha Nham', level: 45, expReward: 550,
    tier: 'beast_general_high' as const,
    drops: [
      { itemId: 'lava_stone', chance: 0.8, quantity: [1, 3] },
      { itemId: 'fire_essence', chance: 0.4, quantity: [1, 2] },
      { itemId: 'energy_crystal', chance: 1.0, quantity: [28, 45] }
    ],
    stats: { hp: 2500, attack: 130, defense: 60, critChance: 0.22, critDamage: 2.0, resistance: 35 }
  },

  fire_elemental: {
    name: 'Nguyên Tố Lửa', level: 46, expReward: 580,
    tier: 'beast_general_high' as const,
    drops: [
      { itemId: 'lava_stone', chance: 0.7, quantity: [2, 4] },
      { itemId: 'fire_essence', chance: 0.5, quantity: [1, 2] },
      { itemId: 'energy_crystal', chance: 1.0, quantity: [30, 48] }
    ],
    stats: { hp: 2200, attack: 145, defense: 50, critChance: 0.25, critDamage: 2.1, resistance: 30 }
  },

  fire_phoenix_boss: {
    name: 'Hỏa Phượng (Boss)', level: 50, expReward: 1500,
    tier: 'beast_king' as const,
    drops: [
      { itemId: 'phoenix_feather', chance: 0.2, quantity: [1, 1] },
      { itemId: 'phoenix_heart', chance: 0.1, quantity: [1, 1] },
      { itemId: 'flame_wing', chance: 0.15, quantity: [1, 1] },
      { itemId: 'gene_solution_elite', chance: 0.12, quantity: [1, 1] },
      { itemId: 'energy_crystal', chance: 1.0, quantity: [60, 100] }
    ],
    stats: { hp: 6000, attack: 200, defense: 100, critChance: 0.3, critDamage: 2.4, resistance: 40 }
  },

  void_demon: {
    name: 'Quỷ Hư Không', level: 55, expReward: 700,
    tier: 'beast_general_high' as const,
    drops: [
      { itemId: 'void_crystal', chance: 0.6, quantity: [1, 2] },
      { itemId: 'dimensional_essence', chance: 0.25, quantity: [1, 1] },
      { itemId: 'energy_crystal', chance: 1.0, quantity: [35, 55] }
    ],
    stats: { hp: 3000, attack: 160, defense: 70, critChance: 0.27, critDamage: 2.2, resistance: 45 }
  },

  rift_horror: {
    name: 'Kinh Hoàng Khe Nứt', level: 56, expReward: 750,
    tier: 'beast_general_high' as const,
    drops: [
      { itemId: 'void_crystal', chance: 0.7, quantity: [2, 3] },
      { itemId: 'dimensional_essence', chance: 0.3, quantity: [1, 1] },
      { itemId: 'energy_crystal', chance: 1.0, quantity: [38, 58] }
    ],
    stats: { hp: 3200, attack: 170, defense: 65, critChance: 0.28, critDamage: 2.3, resistance: 40 }
  },

  void_lord_boss: {
    name: 'Chúa Tể Hư Không (Boss)', level: 60, expReward: 2000,
    tier: 'beast_king' as const,
    drops: [
      { itemId: 'void_lord_core', chance: 0.25, quantity: [1, 1] },
      { itemId: 'void_armor', chance: 0.15, quantity: [1, 1] },
      { itemId: 'dimensional_blade', chance: 0.18, quantity: [1, 1] },
      { itemId: 'gene_solution_legendary', chance: 0.08, quantity: [1, 1] },
      { itemId: 'energy_crystal', chance: 1.0, quantity: [80, 120] }
    ],
    stats: { hp: 8000, attack: 230, defense: 110, critChance: 0.32, critDamage: 2.5, resistance: 50 }
  },

  // === SPACE MONSTERS (Feature 6) ===
  
  gas_giant_beast: {
    name: 'Quái Thú Khí Khổng Lồ', level: 65, expReward: 900,
    tier: 'beast_general_high' as const,
    drops: [
      { itemId: 'jupiter_gas', chance: 0.7, quantity: [2, 5] },
      { itemId: 'energy_crystal', chance: 1.0, quantity: [40, 65] }
    ],
    stats: { hp: 3500, attack: 180, defense: 75, critChance: 0.25, critDamage: 2.1, resistance: 45 }
  },

  magnetic_anomaly: {
    name: 'Dị Thường Từ Trường', level: 66, expReward: 950,
    tier: 'beast_general_high' as const,
    drops: [
      { itemId: 'magnetic_core', chance: 0.5, quantity: [1, 2] },
      { itemId: 'energy_crystal', chance: 1.0, quantity: [42, 68] }
    ],
    stats: { hp: 3200, attack: 195, defense: 70, critChance: 0.28, critDamage: 2.2, resistance: 50 }
  },

  ring_guardian: {
    name: 'Vệ Binh Vành Đai', level: 70, expReward: 1100,
    tier: 'beast_king' as const,
    drops: [
      { itemId: 'saturn_ice', chance: 0.8, quantity: [3, 6] },
      { itemId: 'cosmic_herb_mid', chance: 0.5, quantity: [2, 4] },
      { itemId: 'energy_crystal', chance: 1.0, quantity: [50, 75] }
    ],
    stats: { hp: 4500, attack: 210, defense: 100, critChance: 0.3, critDamage: 2.3, resistance: 55 }
  },

  ice_comet_beast: {
    name: 'Quái Thú Sao Chổi Băng', level: 71, expReward: 1150,
    tier: 'beast_king' as const,
    drops: [
      { itemId: 'saturn_ice', chance: 0.9, quantity: [4, 7] },
      { itemId: 'frozen_crystal', chance: 0.6, quantity: [2, 4] },
      { itemId: 'energy_crystal', chance: 1.0, quantity: [52, 78] }
    ],
    stats: { hp: 4800, attack: 205, defense: 95, critChance: 0.29, critDamage: 2.2, resistance: 50 }
  },

  nebula_entity: {
    name: 'Thực Thể Tinh Vân', level: 75, expReward: 1300,
    tier: 'beast_king' as const,
    drops: [
      { itemId: 'nebula_essence', chance: 0.6, quantity: [1, 3] },
      { itemId: 'cosmic_herb_mid', chance: 0.7, quantity: [3, 7] },
      { itemId: 'energy_crystal', chance: 1.0, quantity: [60, 90] }
    ],
    stats: { hp: 5500, attack: 220, defense: 105, critChance: 0.32, critDamage: 2.4, resistance: 60 }
  },

  cosmic_horror: {
    name: 'Kinh Hoàng Vũ Trụ', level: 76, expReward: 1350,
    tier: 'beast_king' as const,
    drops: [
      { itemId: 'nebula_essence', chance: 0.7, quantity: [2, 4] },
      { itemId: 'cosmic_artifact', chance: 0.15, quantity: [1, 1] },
      { itemId: 'energy_crystal', chance: 1.0, quantity: [65, 95] }
    ],
    stats: { hp: 6000, attack: 235, defense: 100, critChance: 0.33, critDamage: 2.5, resistance: 55 }
  }
} as const

export type MonsterId = keyof typeof monsters
export type MonsterTier = 'beast_soldier_low' | 'beast_soldier_mid' | 'beast_soldier_high' | 'beast_general_low' | 'beast_general_mid' | 'beast_general_high' | 'beast_king'
