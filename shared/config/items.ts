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
  
  // --- Spirit Reader Weapons ---
  spirit_blade_basic: {
    name: 'Phi Đao Cơ Bản', type: 'spirit_weapon', rarity: 'common',
    description: 'Phi đao niệm lực, tấn công từ xa bằng tinh thần',
    stats: { spirit: 8 }
  },
  spirit_blade_advanced: {
    name: 'Phi Đao Cao Cấp', type: 'spirit_weapon', rarity: 'uncommon',
    description: 'Phi đao niệm lực mạnh mẽ, có thể tấn công nhiều mục tiêu',
    stats: { spirit: 15, aoe: 3 }
  },
  energy_shield_basic: {
    name: 'Khiên Năng Lượng Cơ Bản', type: 'spirit_weapon', rarity: 'uncommon',
    description: 'Khiên năng lượng niệm lực, tăng phòng thủ',
    stats: { spirit: 5, defense: 10 }
  },
  
  // --- Active Modules ---
  module_energy_shield: {
    name: 'Module: Khiên Năng Lượng', type: 'module_active', rarity: 'rare',
    description: 'Kích hoạt để tạo lá chắn HP ảo, tiêu hao 50 năng lượng',
    stats: { shieldPower: 100, energyCost: 50 }
  },
  module_counter_strike: {
    name: 'Module: Phản Chấn', type: 'module_passive', rarity: 'rare',
    description: 'Bị động: Phản lại 20% sát thương nhận vào',
    stats: { counterDamage: 0.2 }
  },
  
  // --- Pet Items ---
  slave_ring: {
    name: 'Vòng Nô Dịch', type: 'consumable', rarity: 'uncommon',
    description: 'Dùng để thuần hóa hung thú làm thú cưng',
    effect: { type: 'tame_beast', successRate: 0.5 }
  },
  mechanical_pet_basic: {
    name: 'Pet Cơ Giới Cơ Bản', type: 'consumable', rarity: 'rare',
    description: 'Robot chiến đấu cơ bản, có thể triệu hồi làm pet',
    effect: { type: 'summon_pet', petType: 'robot_basic' }
  },
  
  // --- Blueprints (Crafting) ---
  blueprint_alloy_armor: {
    name: 'Công Thức: Giáp Hợp Kim', type: 'blueprint', rarity: 'uncommon',
    description: 'Công thức chế tạo giáp hợp kim',
    recipe: {
      required: [
        { itemId: 'alloy_ore', qty: 10 },
        { itemId: 'monster_hide_mid', qty: 5 }
      ],
      result: { itemId: 'alloy_armor', qty: 1 }
    }
  },
  blueprint_gene_solution: {
    name: 'Công Thức: Dung Dịch Tiến Hóa', type: 'blueprint', rarity: 'rare',
    description: 'Công thức chế tạo dung dịch tiến hóa cơ bản',
    recipe: {
      required: [
        { itemId: 'cosmic_herb_low', qty: 5 },
        { itemId: 'energy_crystal', qty: 20 }
      ],
      result: { itemId: 'gene_solution_basic', qty: 1 }
    }
  },
  
  // --- Crafting Resources ---
  ruin_fragment: {
    name: 'Mảnh Tàn Tích', type: 'resource', rarity: 'uncommon',
    description: 'Mảnh tàn tích cổ đại, dùng để nghiên cứu công thức'
  },
  alloy_armor: {
    name: 'Giáp Hợp Kim', type: 'armor', rarity: 'uncommon',
    description: 'Giáp được chế tạo từ hợp kim',
    stats: { defense: 15 }
  },
  
  // --- Space Travel Items ---
  basic_shuttle: {
    name: 'Phi Thuyền Tàn Tích (Cấp 1)', type: 'ship', rarity: 'epic',
    description: 'Phi thuyền cơ bản để du hành vũ trụ',
    stats: { fuel: 100, cargo: 50, speed: 10, hp: 100 }
  },
  fuel_cell: {
    name: 'Tế Bào Năng Lượng', type: 'consumable', rarity: 'common',
    description: 'Nhiên liệu cho phi thuyền, hồi phục 50 nhiên liệu',
    effect: { type: 'fuel_restore', power: 50 }
  },

  // === NEW ITEMS - EXPANDED CONTENT ===

  // New Monster Drops
  venom_sac: { name: 'Túi Nọc Độc', type: 'resource', rarity: 'uncommon' },
  sharp_blade_limb: { name: 'Chi Kiếm Sắc', type: 'resource', rarity: 'uncommon' },
  toxic_extract: { name: 'Chiết Xuất Độc', type: 'resource', rarity: 'common' },
  razor_feather: { name: 'Lông Dao Cạnh', type: 'resource', rarity: 'uncommon' },
  stone_scale: { name: 'Vảy Đá', type: 'resource', rarity: 'common' },
  crystal_shard: { name: 'Mảnh Tinh Thể', type: 'resource', rarity: 'rare' },
  spider_queen_fang: { name: 'Nanh Nữ Vương Nhện', type: 'resource', rarity: 'epic' },
  treant_heart: { name: 'Trái Tim Cây Tinh', type: 'resource', rarity: 'epic' },
  golem_core: { name: 'Lõi Golem', type: 'resource', rarity: 'epic' },
  ancient_stone: { name: 'Đá Cổ Đại', type: 'resource', rarity: 'rare' },
  steel_plate: { name: 'Tấm Thép', type: 'resource', rarity: 'uncommon' },
  electric_core: { name: 'Lõi Điện', type: 'resource', rarity: 'rare' },
  ancient_relic: { name: 'Thánh Vật Cổ Đại', type: 'resource', rarity: 'epic' },
  bio_sample: { name: 'Mẫu Sinh Học', type: 'resource', rarity: 'uncommon' },
  aberration_tissue: { name: 'Mô Dị Hình', type: 'resource', rarity: 'rare' },
  fungal_spore: { name: 'Bào Tử Nấm', type: 'resource', rarity: 'common' },
  aberration_core: { name: 'Lõi Dị Hình', type: 'resource', rarity: 'epic' },

  // New Equipment - Weapons
  venom_blade: {
    name: 'Kiếm Nọc Độc', type: 'weapon', rarity: 'rare',
    description: 'Kiếm được tẩm nọc độc nhện, gây thêm sát thương độc.',
    stats: { attack: 25, critChance: 0.05 },
    requirements: { level: 18 }
  },

  crystal_spear: {
    name: 'Giáo Tinh Thể', type: 'weapon', rarity: 'rare',
    description: 'Giáo làm từ tinh thể năng lượng, xuyên thủng phòng thủ địch.',
    stats: { attack: 28, resistance: 5 },
    requirements: { level: 21 }
  },

  golem_hammer: {
    name: 'Búa Golem', type: 'weapon', rarity: 'epic',
    description: 'Búa khổng lồ từ lõi Golem, gây sát thương cực lớn.',
    stats: { attack: 35, defense: 10 },
    requirements: { level: 22 }
  },

  electric_blade: {
    name: 'Lưỡi Kiếm Điện', type: 'weapon', rarity: 'rare',
    description: 'Kiếm chứa năng lượng điện, tăng tốc độ tấn công.',
    stats: { attack: 30, speed: 5 },
    requirements: { level: 26 }
  },

  aberration_claw: {
    name: 'Móng Vuốt Dị Hình', type: 'weapon', rarity: 'epic',
    description: 'Vũ khí từ Chúa Tể Dị Hình, có khả năng hút máu.',
    stats: { attack: 38, critDamage: 0.3 },
    requirements: { level: 32 }
  },

  // New Equipment - Armor
  spider_silk_armor: {
    name: 'Giáp Tơ Nhện', type: 'armor', rarity: 'rare',
    description: 'Giáp nhẹ từ tơ nhện, tăng khả năng né tránh.',
    stats: { defense: 18, dodgeChance: 0.08 },
    requirements: { level: 18 }
  },

  stone_plate_armor: {
    name: 'Giáp Tấm Đá', type: 'armor', rarity: 'rare',
    description: 'Giáp nặng từ vảy đá, phòng thủ cực cao.',
    stats: { defense: 28, resistance: 8 },
    requirements: { level: 19 }
  },

  golem_shell: {
    name: 'Mai Golem', type: 'armor', rarity: 'epic',
    description: 'Vỏ giáp từ Vua Golem, phòng thủ tối thượng.',
    stats: { defense: 35, hpMax: 200 },
    requirements: { level: 22 }
  },

  steel_alloy_suit: {
    name: 'Bộ Giáp Hợp Kim Thép', type: 'armor', rarity: 'rare',
    description: 'Giáp chiến đấu công nghệ cao.',
    stats: { defense: 25, resistance: 10 },
    requirements: { level: 25 }
  },

  aberration_hide: {
    name: 'Da Dị Hình', type: 'armor', rarity: 'epic',
    description: 'Giáp từ da Dị Hình, tự hồi phục.',
    stats: { defense: 30, hpMax: 150 },
    requirements: { level: 32 }
  },

  // New Equipment - Accessories
  venom_ring: {
    name: 'Nhẫn Nọc Độc', type: 'accessory', rarity: 'rare',
    description: 'Nhẫn chứa nọc độc, tăng sát thương chí mạng.',
    stats: { critChance: 0.08, critDamage: 0.15 },
    requirements: { level: 18 }
  },

  crystal_amulet: {
    name: 'Bùa Hộ Tinh Thể', type: 'accessory', rarity: 'rare',
    description: 'Bùa hộ mệnh từ tinh thể, tăng năng lượng.',
    stats: { energyMax: 100, resistance: 5 },
    requirements: { level: 20 }
  },

  ancient_medallion: {
    name: 'Huy Hiệu Cổ Đại', type: 'accessory', rarity: 'epic',
    description: 'Huy hiệu từ thời tiền Đại Niết Bàn.',
    stats: { attack: 15, spirit: 15, defense: 10 },
    requirements: { level: 35 }
  },

  golem_heart_stone: {
    name: 'Đá Trái Tim Golem', type: 'accessory', rarity: 'epic',
    description: 'Viên đá từ lõi Golem, tăng sức sống.',
    stats: { hpMax: 300, defense: 15 },
    requirements: { level: 22 }
  },

  aberration_eye: {
    name: 'Mắt Dị Hình', type: 'accessory', rarity: 'legendary',
    description: 'Mắt của Chúa Tể Dị Hình, cho phép nhìn thấu bản chất.',
    stats: { spirit: 25, critChance: 0.1, dodgeChance: 0.05 },
    requirements: { level: 32 }
  },

  // Equipment Enhancement Materials
  enhancement_stone_basic: {
    name: 'Đá Cường Hóa Cơ Bản', type: 'resource', rarity: 'common',
    description: 'Dùng để nâng cấp trang bị cấp thấp'
  },

  enhancement_stone_advanced: {
    name: 'Đá Cường Hóa Cao Cấp', type: 'resource', rarity: 'uncommon',
    description: 'Dùng để nâng cấp trang bị cấp trung'
  },

  enhancement_stone_elite: {
    name: 'Đá Cường Hóa Tinh Anh', type: 'resource', rarity: 'rare',
    description: 'Dùng để nâng cấp trang bị cấp cao'
  },

  enhancement_stone_legendary: {
    name: 'Đá Cường Hóa Huyền Thoại', type: 'resource', rarity: 'epic',
    description: 'Dùng để nâng cấp trang bị huyền thoại'
  },

  // New Blueprints
  blueprint_venom_blade: {
    name: 'Công Thức: Kiếm Nọc Độc', type: 'blueprint', rarity: 'rare',
    description: 'Công thức chế tạo Kiếm Nọc Độc',
    recipe: {
      required: [
        { itemId: 'venom_sac', qty: 5 },
        { itemId: 'alloy_ore', qty: 8 },
        { itemId: 'monster_tendon_mid', qty: 3 }
      ],
      result: { itemId: 'venom_blade', qty: 1 }
    }
  },

  blueprint_golem_hammer: {
    name: 'Công Thức: Búa Golem', type: 'blueprint', rarity: 'epic',
    description: 'Công thức chế tạo Búa Golem',
    recipe: {
      required: [
        { itemId: 'golem_core', qty: 1 },
        { itemId: 'ancient_stone', qty: 10 },
        { itemId: 'kele_metal_fragment', qty: 3 }
      ],
      result: { itemId: 'golem_hammer', qty: 1 }
    }
  },

  blueprint_spider_silk_armor: {
    name: 'Công Thức: Giáp Tơ Nhện', type: 'blueprint', rarity: 'rare',
    description: 'Công thức chế tạo Giáp Tơ Nhện',
    recipe: {
      required: [
        { itemId: 'spider_queen_fang', qty: 1 },
        { itemId: 'venom_sac', qty: 8 },
        { itemId: 'monster_hide_mid', qty: 5 }
      ],
      result: { itemId: 'spider_silk_armor', qty: 1 }
    }
  },

  // Race-specific Equipment
  human_valor_badge: {
    name: 'Huy Hiệu Dũng Khí Nhân Loại', type: 'accessory', rarity: 'rare',
    description: 'Biểu tượng của ý chí con người. Chỉ dành cho chủng tộc Nhân Loại.',
    stats: { attack: 10, defense: 10, hpMax: 100 },
    requirements: { level: 15, race: 'human' }
  },

  mutant_power_gauntlet: {
    name: 'Găng Tay Sức Mạnh Dị Nhân', type: 'accessory', rarity: 'rare',
    description: 'Tăng cường sức mạnh đột biến. Chỉ dành cho Dị Nhân.',
    stats: { attack: 20, critDamage: 0.2 },
    requirements: { level: 15, race: 'mutant' }
  },

  esper_mind_crown: {
    name: 'Vương Miện Tâm Linh', type: 'accessory', rarity: 'rare',
    description: 'Tăng cường năng lực tinh thần. Chỉ dành cho Linh Năng Giả.',
    stats: { spirit: 25, energyMax: 150 },
    requirements: { level: 15, race: 'esper' }
  },

  cyborg_power_core: {
    name: 'Lõi Năng Lượng Cơ Giới', type: 'accessory', rarity: 'rare',
    description: 'Lõi năng lượng cơ giới hóa. Chỉ dành cho Cơ Giới Chiến Binh.',
    stats: { defense: 15, resistance: 10, energyMax: 100 },
    requirements: { level: 15, race: 'cyborg' }
  },

  beastkin_feral_totem: {
    name: 'Vật Tổ Dã Tính', type: 'accessory', rarity: 'rare',
    description: 'Thức tỉnh bản năng thú tính. Chỉ dành cho Thú Nhân.',
    stats: { attack: 15, speed: 8, dodgeChance: 0.05 },
    requirements: { level: 15, race: 'beastkin' }
  },

  voidwalker_shadow_cloak: {
    name: 'Áo Choàng Bóng Đêm', type: 'accessory', rarity: 'rare',
    description: 'Hòa nhập với bóng tối. Chỉ dành cho Hư Không Hành Giả.',
    stats: { critChance: 0.1, dodgeChance: 0.08, speed: 5 },
    requirements: { level: 15, race: 'voidwalker' }
  },

  // === LEGENDARY EQUIPMENT - ULTRA RARE DROPS ===
  // These items have extremely low drop rates (0.1-1%) but incredible stats
  
  dragon_slayer_blade: {
    name: 'Kiếm Đồ Long', type: 'weapon', rarity: 'legendary',
    description: 'Vũ khí huyền thoại được rèn từ xương Rồng Thời Cổ. Chỉ rơi từ Boss cấp cao với tỉ lệ 0.5%.',
    stats: { attack: 60, critChance: 0.15, critDamage: 0.5, spirit: 20 },
    requirements: { level: 40 }
  },

  void_emperor_armor: {
    name: 'Giáp Hư Không Đế Vương', type: 'armor', rarity: 'legendary',
    description: 'Giáp tối thượng từ thời Đại Niết Bàn. Tỉ lệ rơi cực kỳ thấp (0.3%).',
    stats: { defense: 50, hpMax: 500, resistance: 20, dodgeChance: 0.1 },
    requirements: { level: 40 }
  },

  celestial_ring: {
    name: 'Nhẫn Thiên Giới', type: 'accessory', rarity: 'legendary',
    description: 'Nhẫn mang sức mạnh của các vì sao. Rơi từ Boss Bí Cảnh với tỉ lệ 0.8%.',
    stats: { attack: 25, spirit: 30, energyMax: 200, critChance: 0.12 },
    requirements: { level: 35 }
  },

  phoenix_feather_necklace: {
    name: 'Vòng Cổ Lông Phượng', type: 'accessory', rarity: 'legendary',
    description: 'Vật phẩm thần thoại, tự hồi sinh người đeo 1 lần/ngày. Cực kỳ hiếm (0.2%).',
    stats: { hpMax: 400, defense: 20, resistance: 15 },
    requirements: { level: 42 }
  },

  // EPIC TIER - RARE DROPS (1-3% drop rate)
  
  tiger_king_fang_blade: {
    name: 'Kiếm Nanh Hổ Vương', type: 'weapon', rarity: 'epic',
    description: 'Được rèn từ nanh Giáp Sắt Mãnh Hổ. Tỉ lệ rơi 2%.',
    stats: { attack: 45, critChance: 0.12, speed: 8 },
    requirements: { level: 30 }
  },

  shadow_assassin_dagger: {
    name: 'Dao Ám Sát Bóng Đêm', type: 'weapon', rarity: 'epic',
    description: 'Dao ám sát tốc độ cao. Rơi từ Boss bí ẩn với tỉ lệ 3%.',
    stats: { attack: 40, critChance: 0.18, dodgeChance: 0.08, speed: 12 },
    requirements: { level: 28 }
  },

  ancient_guardian_shield: {
    name: 'Khiên Vệ Binh Cổ Đại', type: 'armor', rarity: 'epic',
    description: 'Khiên của Vệ Binh Cổ Đại, phòng thủ tuyệt đối. Tỉ lệ rơi 1.5%.',
    stats: { defense: 42, hpMax: 300, resistance: 15 },
    requirements: { level: 35 }
  },

  thunder_god_gauntlet: {
    name: 'Găng Tay Lôi Thần', type: 'accessory', rarity: 'epic',
    description: 'Găng tay chứa sức mạnh sét. Boss Rừng Thép rơi với tỉ lệ 2%.',
    stats: { attack: 22, speed: 10, critDamage: 0.25 },
    requirements: { level: 26 }
  },

  beast_king_crown: {
    name: 'Vương Miện Thú Vương', type: 'accessory', rarity: 'epic',
    description: 'Biểu tượng của chúa tể mọi loài thú. Rơi từ Boss Thú Vương cấp với tỉ lệ 1%.',
    stats: { attack: 18, defense: 18, hpMax: 200, critChance: 0.08 },
    requirements: { level: 32 }
  },

  // Grinding/Farming Items - Boost drops and exp
  
  fortune_talisman: {
    name: 'Bùa May Mắn', type: 'accessory', rarity: 'rare',
    description: 'Tăng 20% tỉ lệ rơi vật phẩm quý hiếm. Phù hợp cho cày cuốc.',
    stats: { dropRateBonus: 0.2 },
    requirements: { level: 10 }
  },

  exp_boost_pill: {
    name: 'Hoàn Tăng Kinh Nghiệm', type: 'consumable', rarity: 'uncommon',
    description: 'Tăng 50% EXP nhận được trong 1 giờ. Lý tưởng cho grinding.',
    effect: { type: 'exp_boost', power: 0.5, duration: 3600 }
  },

  treasure_hunter_compass: {
    name: 'La Bàn Thợ Săn Kho Báu', type: 'accessory', rarity: 'uncommon',
    description: 'Tăng 15% tỉ lệ tìm thấy vật phẩm hiếm khi khám phá.',
    stats: { treasureFindBonus: 0.15 },
    requirements: { level: 8 }
  },
} as const

export type ItemId = keyof typeof items;
