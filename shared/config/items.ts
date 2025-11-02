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
  
  // --- Evolution System Resources ---
  energy_crystal: { name: 'Tinh Thể Năng Lượng', type: 'currency', rarity: 'common', description: 'Nguồn năng lượng chính, dùng để tu luyện và làm tiền tệ' },
  cosmic_herb_low: { name: 'Linh Dược Vũ Trụ (Hạ Cấp)', type: 'resource', rarity: 'uncommon', description: 'Dùng để chế tạo dung dịch tiến hóa' },
  cosmic_herb_mid: { name: 'Linh Dược Vũ Trụ (Trung Cấp)', type: 'resource', rarity: 'rare' },
  alloy_ore: { name: 'Khoáng Thạch Hợp Kim', type: 'resource', rarity: 'uncommon', description: 'Dùng để chế tạo vũ khí và giáp' },
  ruin_module: { name: 'Module Tàn Tích', type: 'resource', rarity: 'rare', description: 'Dùng để nâng cấp cơ giới hóa' },
  
  // --- Gene Evolution Solutions ---
  gene_solution_basic: { name: 'Dung Dịch Tiến Hóa Gien Cơ Bản', type: 'consumable', rarity: 'uncommon', 
    description: 'Cần thiết để đột phá từ Học Đồ lên Chiến Sĩ', effect: { type: 'breakthrough', tier: 1 } },
  gene_solution_advanced: { name: 'Dung Dịch Tiến Hóa Gien Cao Cấp', type: 'consumable', rarity: 'rare',
    description: 'Cần thiết để đột phá từ Chiến Sĩ lên Chiến Tướng', effect: { type: 'breakthrough', tier: 2 } },
  gene_solution_elite: { name: 'Dung Dịch Tiến Hóa Gien Tinh Anh', type: 'consumable', rarity: 'epic',
    description: 'Cần thiết để đột phá từ Chiến Tướng lên Chiến Thần', effect: { type: 'breakthrough', tier: 3 } },
  gene_solution_legendary: { name: 'Dung Dịch Tiến Hóa Gien Huyền Thoại', type: 'consumable', rarity: 'legendary',
    description: 'Cần thiết để đột phá lên Hành Tinh Cấp', effect: { type: 'breakthrough', tier: 4 } },
  
  // --- Energy Recovery ---
  energy_solution: { name: 'Dung Dịch Năng Lượng', type: 'consumable', rarity: 'common',
    description: 'Hồi phục 50 năng lượng', effect: { type: 'energy_restore', power: 50 } },

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
  
  // --- Modules (Mechanization System) ---
  // Cultivation Chips
  cultivation_chip_basic: {
    name: 'Chip Tu Luyện Cơ Bản', type: 'module_cultivation', rarity: 'uncommon',
    description: 'Tăng 20% tốc độ hấp thụ Tinh Thể Năng Lượng',
    stats: { cultivationSpeed: 1.2 }
  },
  cultivation_chip_advanced: {
    name: 'Chip Tu Luyện Cao Cấp', type: 'module_cultivation', rarity: 'rare',
    description: 'Tăng 50% tốc độ hấp thụ Tinh Thể Năng Lượng',
    stats: { cultivationSpeed: 1.5 }
  },
  
  // Combat Modules
  combat_module_attack: {
    name: 'Module Chiến Đấu - Sát Thương', type: 'module_combat', rarity: 'uncommon',
    description: 'Tăng 15 sát thương',
    stats: { attack: 15 }
  },
  combat_module_defense: {
    name: 'Module Chiến Đấu - Phòng Thủ', type: 'module_combat', rarity: 'uncommon',
    description: 'Tăng 10 phòng ngự',
    stats: { defense: 10 }
  },
  
  // Survival Modules
  survival_module_energy: {
    name: 'Module Sinh Tồn - Năng Lượng', type: 'module_survival', rarity: 'uncommon',
    description: 'Giảm 20% tiêu hao năng lượng',
    stats: { energyCostReduction: 0.2 }
  },
  survival_module_recovery: {
    name: 'Module Sinh Tồn - Hồi Phục', type: 'module_survival', rarity: 'uncommon',
    description: 'Tăng 50% tốc độ hồi phục HP',
    stats: { hpRegenBoost: 0.5 }
  },
  
  // --- Skill Books (Battle Skills) ---
  skill_thunder_blade: {
    name: 'Sách Chiến Kỹ: Lôi Đao', type: 'skill_book', rarity: 'rare',
    description: 'Chiến kỹ chủ động, gây sát thương cao với thuộc tính sét',
    skill: { type: 'active', name: 'Lôi Đao', damage: 1.5, element: 'thunder' }
  },
  skill_eight_extremes_fist: {
    name: 'Sách Chiến Kỹ: Bát Cực Quyền', type: 'skill_book', rarity: 'uncommon',
    description: 'Chiến kỹ bị động, tăng 10% sức mạnh',
    skill: { type: 'passive', name: 'Bát Cực Quyền', attackBoost: 0.1 }
  },
  skill_iron_body: {
    name: 'Sách Chiến Kỹ: Kim Cang Thân', type: 'skill_book', rarity: 'rare',
    description: 'Chiến kỹ bị động, tăng 15% phòng thủ',
    skill: { type: 'passive', name: 'Kim Cang Thân', defenseBoost: 0.15 }
  },
  skill_rapid_strike: {
    name: 'Sách Chiến Kỹ: Liên Hoàn Chưởng', type: 'skill_book', rarity: 'uncommon',
    description: 'Chiến kỹ chủ động, tấn công 3 lần liên tiếp với 60% sát thương',
    skill: { type: 'active', name: 'Liên Hoàn Chưởng', hits: 3, damageMultiplier: 0.6 }
  },
  
  // --- Advanced Modules ---
  combat_module_critical: {
    name: 'Module Chiến Đấu - Chí Mạng', type: 'module_combat', rarity: 'rare',
    description: 'Tăng 10% tỷ lệ chí mạng',
    stats: { critChance: 0.1 }
  },
  survival_module_shield: {
    name: 'Module Sinh Tồn - Lá Chắn', type: 'module_survival', rarity: 'rare',
    description: 'Giảm 15% sát thương nhận vào',
    stats: { damageReduction: 0.15 }
  },
  cultivation_chip_elite: {
    name: 'Chip Tu Luyện Tinh Anh', type: 'module_cultivation', rarity: 'epic',
    description: 'Tăng 100% tốc độ hấp thụ Tinh Thể Năng Lượng',
    stats: { cultivationSpeed: 2.0 }
  },
} as const

export type ItemId = keyof typeof items;
