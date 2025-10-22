export const items = {
  // --- Tài nguyên ---
  monster_hide_low: { name: 'Da Thú (Hạ Cấp)', type: 'resource', rarity: 'common' },
  monster_bone_low: { name: 'Xương Thú (Hạ Cấp)', type: 'resource', rarity: 'common' },
  monster_tendon_low: { name: 'Gân Thú (Hạ Cấp)', type: 'resource', rarity: 'uncommon' },
  monster_hide_mid: { name: 'Da Thú (Trung Cấp)', type: 'resource', rarity: 'uncommon' },
  monster_tendon_mid: { name: 'Gân Thú (Trung Cấp)', type: 'resource', rarity: 'rare' },

  // --- Nguyên liệu quý ---
  kele_metal_fragment: { name: 'Mảnh Vụn Kim Loại Khắc La', type: 'resource', rarity: 'rare' },
  blue_gold_ore: { name: 'Quặng Lam Kim', type: 'resource', rarity: 'uncommon' },
  life_essence_low: { name: 'Sinh Mệnh Tinh Hoa (Hạ Cấp)', type: 'consumable', rarity: 'rare', effect: { type: 'heal', power: 200 } },
  dragon_blood: { name: 'Long Huyết (Giả)', type: 'resource', rarity: 'epic' },

  // --- Trang bị ---
  standard_combat_knife: {
    name: 'Dao Găm Chiến Đấu Tiêu Chuẩn', type: 'weapon', rarity: 'common',
    description: 'Vũ khí tiêu chuẩn cho mọi võ giả khi ra ngoài hoang dã.',
    stats: { attack: 5 }
  },
  alloy_battle_axe: {
    name: 'Chiến Phủ Hợp Kim', type: 'weapon', rarity: 'uncommon',
    description: 'Nặng và mạnh mẽ, có khả năng xuyên qua lớp da dày của quái thú.',
    stats: { attack: 12 }
  },
  standard_combat_vest: {
    name: 'Áo Giáp Chiến Đấu Tiêu Chuẩn', type: 'armor', rarity: 'common',
    description: 'Làm từ da quái thú cấp thấp, cung cấp sự bảo vệ cơ bản.',
    stats: { defense: 8 }
  },
} as const

export type ItemId = keyof typeof items;
