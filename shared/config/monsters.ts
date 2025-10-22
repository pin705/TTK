export const monsters = {
  // Cấp Thú Binh
  bloodfang_boar: {
    name: 'Nanh Máu Lợn Rừng', level: 1, hp: 80, attack: 12, defense: 5, expReward: 15,
    drops: [{ itemId: 'monster_hide_low', chance: 0.8, quantity: [1, 2] }, { itemId: 'monster_bone_low', chance: 0.5, quantity: [1, 3] }],
  },
  horned_wolf: {
    name: 'Thiết Giáp Sói Sừng', level: 2, hp: 120, attack: 18, defense: 8, expReward: 25,
    drops: [{ itemId: 'monster_hide_low', chance: 0.7, quantity: [1, 1] }, { itemId: 'monster_tendon_low', chance: 0.2, quantity: [1, 1] }],
  },
  shadow_cat: {
    name: 'Ảnh Miêu', level: 4, hp: 150, attack: 25, defense: 10, expReward: 40,
    drops: [{ itemId: 'monster_tendon_low', chance: 0.3, quantity: [1, 2] }],
  },

  // Cấp Thú Tướng
  iron_fist_ape: {
    name: 'Thiết Quyền Viên Hầu', level: 7, hp: 500, attack: 55, defense: 30, expReward: 120,
    drops: [{ itemId: 'monster_tendon_mid', chance: 0.5, quantity: [2, 3] }, { itemId: 'blue_gold_ore', chance: 0.1, quantity: [1, 1] }],
  },
  silvermoon_mastiff: {
    name: 'Ngân Nguyệt Ngao', level: 9, hp: 800, attack: 70, defense: 45, expReward: 200,
    drops: [{ itemId: 'monster_hide_mid', chance: 0.9, quantity: [3, 5] }, { itemId: 'life_essence_low', chance: 0.05, quantity: [1, 1] }],
  },

  // Cấp Vương
  armored_tiger: {
    name: 'Giáp Sắt Mãnh Hổ (Vương Cấp)', level: 12, hp: 1500, attack: 100, defense: 60, expReward: 500,
    drops: [{ itemId: 'kele_metal_fragment', chance: 0.1, quantity: [1, 1] }, { itemId: 'life_essence_low', chance: 0.2, quantity: [1, 2] }],
  },
} as const

export type MonsterId = keyof typeof monsters;
