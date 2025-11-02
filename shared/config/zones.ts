export const zones = {
  // === CĂN CỨ THỊ GIANG NAM (BASE - Safe Zone) ===
  giang_nam_khu_dan_cu_01: {
    name: 'Khu Dân Cư Nghèo',
    description: 'Những tòa nhà xiêu vẹo, dấu tích của Đại Niết Bàn. Nơi đây là điểm khởi đầu của bạn.',
    recommendedLevel: 1, monsterDensity: 'none', allowCultivation: true,
    zoneType: 'base' as const, // Safe zone
    energyCostPerMove: 0, // No energy cost in safe zones
    respawnLocation: 'giang_nam_khu_dan_cu_01',
    connectedZones: [{ direction: 'đến Võ Quán', zoneId: 'giang_nam_vo_quan_01' }]
  },
  giang_nam_vo_quan_01: {
    name: 'Võ Quán Cực Hạn',
    description: 'Nơi các võ giả trao đổi và nhận nhiệm vụ. Võ Sư Trương đang đứng ở trung tâm.',
    recommendedLevel: 1, monsterDensity: 'none', allowCultivation: true,
    zoneType: 'base' as const,
    energyCostPerMove: 0,
    respawnLocation: 'giang_nam_khu_dan_cu_01',
    npcs: [{ npcId: 'vo_su_truong' }],
    connectedZones: [
      { direction: 'về Khu Dân Cư', zoneId: 'giang_nam_khu_dan_cu_01' },
      { direction: 'đến Chợ Giao Dịch', zoneId: 'giang_nam_cho_giao_dich_01' },
      { direction: 'ra Cổng Căn Cứ', zoneId: 'giang_nam_cong_can_cu_01' }
    ]
  },
  giang_nam_cho_giao_dich_01: {
    name: 'Chợ Giao Dịch',
    description: 'Tiếng rao hàng ồn ào. Các võ giả đang mua bán vật liệu quái thú và trang bị.',
    recommendedLevel: 1, monsterDensity: 'none', allowCultivation: false,
    zoneType: 'base' as const,
    energyCostPerMove: 0,
    respawnLocation: 'giang_nam_khu_dan_cu_01',
    npcs: [{ npcId: 'thuong_nhan_vat_lieu' }, { npcId: 'tinh_bao_vien' }],
    connectedZones: [
      { direction: 'về Võ Quán', zoneId: 'giang_nam_vo_quan_01' },
      { direction: 'đến Xưởng Rèn', zoneId: 'giang_nam_xuong_ren' },
      { direction: 'đến Phòng Thí Nghiệm', zoneId: 'giang_nam_phong_thi_nghiem' }
    ]
  },
  giang_nam_cong_can_cu_01: {
    name: 'Cổng Căn Cứ Phía Bắc',
    description: 'Bức tường thành kim loại khổng lồ vươn cao. Lính gác kiểm tra giấy phép của mọi người ra vào.',
    recommendedLevel: 2, monsterDensity: 'none', allowCultivation: false,
    zoneType: 'base' as const,
    energyCostPerMove: 0,
    respawnLocation: 'giang_nam_khu_dan_cu_01',
    connectedZones: [
      { direction: 'vào Võ Quán', zoneId: 'giang_nam_vo_quan_01' },
      { direction: 'ra Hoang Dã', zoneId: 'hoang_da_0201' },
      { direction: 'đến Bãi Đỗ Phi Thuyền', zoneId: 'earth_base' }
    ]
  },

  // === KHU VỰC HOANG DÃ (WILDERNESS - PVE) ===
  hoang_da_0201: {
    name: 'Hoang Dã - Khu 0201',
    description: 'Nhà cao tầng đổ nát bị cây dại bao phủ. Tiếng gầm của quái thú vang vọng từ xa.',
    allowCultivation: false,
    recommendedLevel: 3,
    zoneType: 'wilderness' as const, // PVE zone
    energyCostPerMove: 5, // Energy cost to move in wilderness
    deathPenalty: { energyCrystalLoss: 0.1 }, // Lose 10% of energy crystals on death
    respawnLocation: 'giang_nam_khu_dan_cu_01',
    // Gợi ý cho AI
    monsterDensity: 5, // AI sẽ cố gắng duy trì 5 quái vật trong khu vực này
    monsterTypes: ['thú', 'côn trùng'], // Gợi ý về loại quái
    possibleBosses: [], // Các loại boss có thể xuất hiện

    monsters: [
      { monsterId: 'bloodfang_boar', spawnChance: 0.6 },
      { monsterId: 'horned_wolf', spawnChance: 0.4 }
    ],
    resources: [{ itemId: 'blue_gold_ore', spawnChance: 0.05, quantity: [1, 1] }],
    connectedZones: [
      { direction: 'về Căn Cứ', zoneId: 'giang_nam_cong_can_cu_01' },
      { direction: 'tiến sâu hơn', zoneId: 'hoang_da_0202' }
    ]
  },
  hoang_da_0202: {
    name: 'Hoang Dã - Khu 0202 (Ngoại vi)',
    description: 'Tàn tích của một khu công nghiệp cũ. Những con quái thú mạnh hơn đang rình rập trong bóng tối.',
    allowCultivation: false,

    recommendedLevel: 10,
    zoneType: 'wilderness' as const,
    energyCostPerMove: 8,
    deathPenalty: { energyCrystalLoss: 0.15 },
    respawnLocation: 'giang_nam_khu_dan_cu_01',
    monsterDensity: 3,
    monsterTypes: ['thú', 'dị thú'],
    possibleBosses: ['armored_tiger'], // Boss 'Giáp Sắt Mãnh Hổ' có thể xuất hiện ở đây

    monsters: [
      { monsterId: 'shadow_cat', spawnChance: 0.5 },
      { monsterId: 'iron_fist_ape', spawnChance: 0.3 }
    ],
    connectedZones: [
      { direction: 'lùi lại Khu 0201', zoneId: 'hoang_da_0201' },
      { direction: 'đến Sào Huyệt', zoneId: 'sao_huyet_manh_ho_01' }
    ]
  },
  sao_huyet_manh_ho_01: {
    name: 'Sào Huyệt Mãnh Hổ',
    description: 'Bên trong một trung tâm thương mại đã sụp đổ, một con quái thú Vương Cấp đang chiếm cứ.',
    recommendedLevel: 10, monsterDensity: 'high', allowCultivation: false,
    zoneType: 'secret_realm' as const, // Secret realm / instance
    energyCostPerMove: 10,
    deathPenalty: { energyCrystalLoss: 0.2 },
    respawnLocation: 'giang_nam_khu_dan_cu_01',
    monsters: [{ monsterId: 'armored_tiger', spawnChance: 1 }],
    resources: [{ itemId: 'kele_metal_fragment', spawnChance: 0.02, quantity: [1, 1] }],
    connectedZones: [{ direction: 'rời khỏi sào huyệt', zoneId: 'hoang_da_0202' }]
  },

  // === KHU HỖN LOẠN (CHAOS ZONE - PVP) ===
  khu_hon_loan_mo_tinh_the: {
    name: 'Mỏ Tinh Thể Tranh Chấp',
    description: 'Khu vực tranh chấp tài nguyên. Người chơi có thể tấn công lẫn nhau để chiếm đoạt Tinh Thể Năng Lượng.',
    recommendedLevel: 15, monsterDensity: 'low', allowCultivation: false,
    zoneType: 'chaos' as const, // PVP zone
    energyCostPerMove: 10,
    deathPenalty: { 
      energyCrystalLoss: 0.3, // 30% loss
      itemDropChance: 0.1 // 10% chance to drop random inventory item
    },
    respawnLocation: 'giang_nam_khu_dan_cu_01',
    pvpEnabled: true,
    monsters: [
      { monsterId: 'shadow_cat', spawnChance: 0.4 },
      { monsterId: 'iron_fist_ape', spawnChance: 0.2 }
    ],
    resources: [
      { itemId: 'energy_crystal', spawnChance: 0.3, quantity: [5, 10] },
      { itemId: 'cosmic_herb_mid', spawnChance: 0.1, quantity: [1, 2] }
    ],
    connectedZones: [
      { direction: 'lùi về Hoang Dã', zoneId: 'hoang_da_0202' }
    ]
  },

  // === CRAFTING ZONES (Base Zones for Crafting) ===
  giang_nam_xuong_ren: {
    name: 'Xưởng Rèn',
    description: 'Tiếng búa đập trên đe vang vọng. Nơi các thợ rèn chế tạo vũ khí và giáp.',
    recommendedLevel: 1, monsterDensity: 'none', allowCultivation: false,
    zoneType: 'base' as const,
    energyCostPerMove: 0,
    respawnLocation: 'giang_nam_khu_dan_cu_01',
    connectedZones: [{ direction: 'về Chợ Giao Dịch', zoneId: 'giang_nam_cho_giao_dich_01' }]
  },
  giang_nam_phong_thi_nghiem: {
    name: 'Phòng Thí Nghiệm',
    description: 'Phòng nghiên cứu đầy các thiết bị hiện đại. Nơi nghiên cứu công thức chế tạo.',
    recommendedLevel: 5, monsterDensity: 'none', allowCultivation: false,
    zoneType: 'base' as const,
    energyCostPerMove: 0,
    respawnLocation: 'giang_nam_khu_dan_cu_01',
    connectedZones: [{ direction: 'về Chợ Giao Dịch', zoneId: 'giang_nam_cho_giao_dich_01' }]
  },

  // === VŨ TRỤ (SPACE - Endgame zones) ===
  earth_base: {
    name: 'Bãi Đỗ Phi Thuyền',
    description: 'Bãi đỗ phi thuyền tại Trái Đất. Nơi xuất phát cho các chuyến du hành vũ trụ.',
    recommendedLevel: 40, monsterDensity: 'none', allowCultivation: false,
    zoneType: 'base' as const,
    energyCostPerMove: 0,
    respawnLocation: 'giang_nam_khu_dan_cu_01',
    connectedZones: [
      { direction: 'về Căn Cứ', zoneId: 'giang_nam_khu_dan_cu_01' }
    ]
  },
  moon_base: {
    name: 'Căn Cứ Mặt Trăng',
    description: 'Trạm vũ trụ trên Mặt Trăng, nơi các Chiến Thần tập trung.',
    recommendedLevel: 50, monsterDensity: 'none', allowCultivation: true,
    zoneType: 'base' as const,
    energyCostPerMove: 0,
    respawnLocation: 'moon_base',
    connectedZones: []
  },
  mars_mining: {
    name: 'Khu Khai Thác Sao Hỏa',
    description: 'Các mỏ khoáng quý hiếm trên Sao Hỏa.',
    recommendedLevel: 55, monsterDensity: 'medium', allowCultivation: false,
    zoneType: 'wilderness' as const,
    energyCostPerMove: 15,
    deathPenalty: { energyCrystalLoss: 0.25 },
    respawnLocation: 'moon_base',
    resources: [
      { itemId: 'alloy_ore', spawnChance: 0.5, quantity: [3, 8] },
      { itemId: 'cosmic_herb_mid', spawnChance: 0.3, quantity: [2, 4] }
    ],
    connectedZones: []
  },
  asteroid_belt: {
    name: 'Vành Đai Tiểu Hành Tinh',
    description: 'Khu vực nguy hiểm đầy các tiểu hành tinh và quái thú vũ trụ.',
    recommendedLevel: 60, monsterDensity: 'high', allowCultivation: false,
    zoneType: 'secret_realm' as const,
    energyCostPerMove: 20,
    deathPenalty: { energyCrystalLoss: 0.3, itemDropChance: 0.1 },
    respawnLocation: 'moon_base',
    monsters: [
      { monsterId: 'space_beast', spawnChance: 0.5 },
      { monsterId: 'asteroid_guardian', spawnChance: 0.3 }
    ],
    resources: [
      { itemId: 'energy_crystal', spawnChance: 0.8, quantity: [10, 20] },
      { itemId: 'ruin_module', spawnChance: 0.2, quantity: [1, 3] }
    ],
    connectedZones: []
  }
} as const

export type ZoneId = keyof typeof zones
export type ZoneType = 'base' | 'wilderness' | 'chaos' | 'secret_realm' | 'space'
