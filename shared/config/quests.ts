import type { MonsterId, ItemId, NpcId, ZoneId } from './index' // Import các type ID

// Định nghĩa các loại mục tiêu nhiệm vụ
interface QuestObjectiveKill {
  type: 'kill'
  monsterId: MonsterId
  count: number
  description: string // Mô tả hiển thị cho người chơi (VD: "Hạ gục Lợn Rừng Nanh Máu")
}

interface QuestObjectiveGather {
  type: 'gather'
  itemId: ItemId
  count: number
  description: string // VD: "Thu thập Da Thú (Hạ Cấp)"
}

interface QuestObjectiveTalk {
  type: 'talk'
  npcId: NpcId
  description: string // VD: "Nói chuyện với Võ Sư Trương"
}

interface QuestObjectiveExplore {
  type: 'explore'
  zoneId: ZoneId
  description: string // VD: "Khám phá Sào Huyệt Mãnh Hổ"
}

export type QuestObjective = QuestObjectiveKill | QuestObjectiveGather | QuestObjectiveTalk | QuestObjectiveExplore
export type QuestType = 'main' | 'side' | 'daily' | 'co-op' | 'cultivation'

// Định nghĩa cấu trúc phần thưởng
interface QuestRewards {
  exp: number
  items?: { itemId: ItemId, quantity: number }[]
  reputation?: number
  // Thêm các loại phần thưởng khác: tiền, mở khóa zone/skill...
}

// Định nghĩa cấu trúc Quest Template
export interface QuestTemplate {
  title: string
  description: string
  type: 'main' | 'side' | 'daily' | 'co-op' | 'cultivation' // Loại nhiệm vụ
  npcId?: NpcId // NPC giao nhiệm vụ (nếu có)
  requiredLevel?: number // Cấp độ yêu cầu để nhận
  objectives: QuestObjective[]
  rewards: QuestRewards
  isRepeatable?: boolean // Có thể làm lại không (cho daily/weekly)
}

// === DANH SÁCH NHIỆM VỤ ===
export const quests = {
  // === TUTORIAL QUESTS (Auto-triggered) ===
  tutorial_welcome: {
    title: '[Hướng Dẫn] Chào Mừng Đến Với Tinh Không Đạo Lộ',
    description: 'Bạn mới tỉnh dậy trong một thế giới hậu tận thế đầy nguy hiểm. Hãy làm quen với môi trường xung quanh và tìm hiểu cách sinh tồn.',
    type: 'main',
    requiredLevel: 1,
    objectives: [
      { type: 'explore', zoneId: 'giang_nam_vo_quan_01', description: 'Khám phá Võ Quán Cực Hạn' },
      { type: 'talk', npcId: 'vo_su_truong', description: 'Gặp Võ Sư Trương để nhận hướng dẫn' }
    ],
    rewards: {
      exp: 50,
      items: [{ itemId: 'energy_crystal', quantity: 10 }]
    }
  },
  tutorial_first_combat: {
    title: '[Hướng Dẫn] Chiến Đấu Đầu Tiên',
    description: 'Võ Sư Trương muốn kiểm tra khả năng chiến đấu của bạn. Hãy ra ngoài Hoang Dã và hạ gục một con quái thú.',
    type: 'main',
    npcId: 'vo_su_truong',
    requiredLevel: 1,
    objectives: [
      { type: 'explore', zoneId: 'hoang_da_0201', description: 'Đến Hoang Dã Khu 0201' },
      { type: 'kill', monsterId: 'bloodfang_boar', count: 1, description: 'Hạ gục 1 Lợn Rừng Nanh Máu' },
      { type: 'talk', npcId: 'vo_su_truong', description: 'Báo cáo với Võ Sư Trương' }
    ],
    rewards: {
      exp: 100,
      items: [
        { itemId: 'standard_combat_knife', quantity: 1 },
        { itemId: 'energy_crystal', quantity: 20 }
      ],
      reputation: 5
    }
  },
  tutorial_gather_resources: {
    title: '[Hướng Dẫn] Thu Thập Tài Nguyên',
    description: 'Sau khi chiến đấu, bạn cần học cách thu thập tài nguyên từ quái thú. Những tài nguyên này rất có giá trị.',
    type: 'main',
    npcId: 'vo_su_truong',
    requiredLevel: 1,
    objectives: [
      { type: 'gather', itemId: 'monster_hide_low', count: 3, description: 'Thu thập 3 Da Thú (Hạ Cấp)' },
      { type: 'talk', npcId: 'vo_su_truong', description: 'Báo cáo với Võ Sư Trương' }
    ],
    rewards: {
      exp: 120,
      items: [{ itemId: 'energy_crystal', quantity: 30 }],
      reputation: 5
    }
  },
  
  // Nhiệm vụ đầu tiên (sau tutorial)
  first_hunt: {
    title: 'Chuyến Đi Săn Đầu Tiên',
    description: 'Võ Sư Trương ở Võ Quán muốn kiểm tra thực lực của võ giả mới. Hãy chứng minh khả năng sinh tồn của bạn ở khu hoang dã.',
    type: 'side',
    npcId: 'vo_su_truong',
    requiredLevel: 2,
    objectives: [
      { type: 'kill', monsterId: 'bloodfang_boar', count: 3, description: 'Hạ gục Lợn Rừng Nanh Máu' },
      { type: 'gather', itemId: 'monster_hide_low', count: 2, description: 'Thu thập Da Thú (Hạ Cấp)' },
      { type: 'talk', npcId: 'vo_su_truong', description: 'Báo cáo lại cho Võ Sư Trương' }
    ],
    rewards: {
      exp: 150,
      items: [{ itemId: 'standard_combat_knife', quantity: 1 }],
      reputation: 10 // Thăng tiến danh tiếng với Võ Quán
    }
  },
  // Nhiệm vụ thu thập vật liệu
  material_request: {
    title: 'Yêu Cầu Vật Liệu',
    description: 'Lão Giả Bán Vật Liệu ở Chợ Giao Dịch đang cần gấp một số Gân Thú để hoàn thành đơn hàng.',
    type: 'side',
    npcId: 'thuong_nhan_vat_lieu',
    requiredLevel: 3,
    objectives: [
      { type: 'gather', itemId: 'monster_tendon_low', count: 5, description: 'Thu thập Gân Thú (Hạ Cấp)' },
      { type: 'talk', npcId: 'thuong_nhan_vat_lieu', description: 'Giao vật liệu cho Lão Giả' }
    ],
    rewards: {
      exp: 200,
      // Thêm tiền tệ sau này
      reputation: 5
    },
    isRepeatable: true // Nhiệm vụ có thể lặp lại
  },
  // Nhiệm vụ khám phá
  explore_lair: {
    title: 'Thám Hiểm Sào Huyệt',
    description: 'Có tin đồn về một con Mãnh Hổ Vương Cấp trong khu công nghiệp cũ. Hãy đến Sào Huyệt Mãnh Hổ để xác nhận thông tin.',
    type: 'side',
    npcId: 'tinh_bao_vien', // NPC Giao nhiệm vụ
    requiredLevel: 8,
    objectives: [
      { type: 'explore', zoneId: 'sao_huyet_manh_ho_01', description: 'Tiến vào Sào Huyệt Mãnh Hổ' },
      { type: 'talk', npcId: 'tinh_bao_vien', description: 'Báo cáo thông tin cho Người Cung Cấp Tình Báo' }
    ],
    rewards: {
      exp: 500,
      reputation: 15
    }
  },

  // === NEW QUESTS - EXPANDED CONTENT ===

  // Main Story Quests
  main_forest_expedition: {
    title: '[Chính] Thám Hiểm Rừng Rậm',
    description: 'Võ Sư Trương cần ngươi điều tra khu rừng rậm phía Bắc nơi có báo cáo về sinh vật lạ.',
    type: 'main',
    npcId: 'vo_su_truong',
    requiredLevel: 15,
    objectives: [
      { type: 'explore', zoneId: 'hoang_da_0203', description: 'Khám phá Hoang Dã Khu 0203' },
      { type: 'kill', monsterId: 'venomous_spider', count: 5, description: 'Tiêu diệt 5 Nhện Độc' },
      { type: 'kill', monsterId: 'mutant_mantis', count: 3, description: 'Tiêu diệt 3 Bọ Ngựa Biến Dị' },
      { type: 'talk', npcId: 'vo_su_truong', description: 'Báo cáo với Võ Sư Trương' }
    ],
    rewards: {
      exp: 800,
      items: [{ itemId: 'enhancement_stone_basic', quantity: 5 }],
      reputation: 25
    }
  },

  main_poison_cave: {
    title: '[Chính] Tiêu Diệt Nữ Vương Nhện',
    description: 'Hang Động Độc Dược đang là mối đe dọa lớn. Hãy tiêu diệt Nữ Vương Nhện Độc!',
    type: 'main',
    npcId: 'vo_su_truong',
    requiredLevel: 18,
    objectives: [
      { type: 'kill', monsterId: 'poison_spider_queen', count: 1, description: 'Đánh bại Nữ Vương Nhện Độc' },
      { type: 'talk', npcId: 'vo_su_truong', description: 'Báo cáo chiến thắng' }
    ],
    rewards: {
      exp: 1500,
      items: [
        { itemId: 'venom_blade', quantity: 1 },
        { itemId: 'enhancement_stone_advanced', quantity: 3 }
      ],
      reputation: 50
    }
  },

  main_rocky_area: {
    title: '[Chính] Chinh Phục Đồi Đá',
    description: 'Tiến vào khu đồi đá để tìm khoáng sản quý hiếm cho căn cứ.',
    type: 'main',
    npcId: 'vo_su_truong',
    requiredLevel: 20,
    objectives: [
      { type: 'explore', zoneId: 'hoang_da_0204', description: 'Khám phá Hoang Dã Khu 0204' },
      { type: 'gather', itemId: 'blue_gold_ore', count: 10, description: 'Thu thập 10 Quặng Lam Kim' },
      { type: 'kill', monsterId: 'stone_golem_king', count: 1, description: 'Đánh bại Vua Golem Đá' },
      { type: 'talk', npcId: 'vo_su_truong', description: 'Giao khoáng sản' }
    ],
    rewards: {
      exp: 2000,
      items: [
        { itemId: 'golem_hammer', quantity: 1 },
        { itemId: 'energy_crystal', quantity: 100 }
      ],
      reputation: 60
    }
  },

  main_underground: {
    title: '[Chính] Hầm Ngầm Bí Mật',
    description: 'Phát hiện lối vào hầm ngầm biến dị. Điều tra và tiêu diệt mối đe dọa.',
    type: 'main',
    npcId: 'tinh_bao_vien',
    requiredLevel: 28,
    objectives: [
      { type: 'explore', zoneId: 'ham_ngam_bien_di', description: 'Khám phá Hầm Ngầm Biến Dị' },
      { type: 'explore', zoneId: 'ham_ngam_bien_di_sau', description: 'Tiến xuống Tầng Sâu' },
      { type: 'kill', monsterId: 'aberration_lord', count: 1, description: 'Tiêu diệt Chúa Tể Dị Hình' },
      { type: 'talk', npcId: 'tinh_bao_vien', description: 'Báo cáo kết quả' }
    ],
    rewards: {
      exp: 3000,
      items: [
        { itemId: 'aberration_claw', quantity: 1 },
        { itemId: 'gene_solution_advanced', quantity: 2 },
        { itemId: 'energy_crystal', quantity: 200 }
      ],
      reputation: 100
    }
  },

  // Side Quests - Training
  training_dao: {
    title: 'Huấn Luyện Đao Pháp',
    description: 'Đao Sư Huấn Luyện sẵn sàng dạy ngươi kỹ năng đao cơ bản.',
    type: 'side',
    npcId: 'dao_su_huan_luyen',
    requiredLevel: 10,
    objectives: [
      { type: 'kill', monsterId: 'horned_wolf', count: 20, description: 'Luyện tập bằng cách hạ 20 Sói Sừng' },
      { type: 'talk', npcId: 'dao_su_huan_luyen', description: 'Trở lại gặp Đao Sư' }
    ],
    rewards: {
      exp: 600,
      items: [{ itemId: 'skill_rapid_strike', quantity: 1 }],
      reputation: 20
    }
  },

  training_quyen: {
    title: 'Huấn Luyện Quyền Pháp',
    description: 'Quyền Sư muốn kiểm tra sức mạnh thể chất của ngươi.',
    type: 'side',
    npcId: 'quyen_su_huan_luyen',
    requiredLevel: 12,
    objectives: [
      { type: 'kill', monsterId: 'iron_fist_ape', count: 10, description: 'Đánh bại 10 Thiết Quyền Viên Hầu' },
      { type: 'talk', npcId: 'quyen_su_huan_luyen', description: 'Trở lại gặp Quyền Sư' }
    ],
    rewards: {
      exp: 700,
      items: [{ itemId: 'skill_eight_extremes_fist', quantity: 1 }],
      reputation: 25
    }
  },

  // Equipment Crafting Quests
  craft_weapon_quest: {
    title: 'Rèn Vũ Khí Đầu Tiên',
    description: 'Thợ Rèn Vũ Khí muốn dạy ngươi nghề rèn. Hãy mang nguyên liệu đến.',
    type: 'side',
    npcId: 'tho_ren_vu_khi',
    requiredLevel: 15,
    objectives: [
      { type: 'gather', itemId: 'alloy_ore', count: 15, description: 'Thu thập 15 Quặng Hợp Kim' },
      { type: 'gather', itemId: 'monster_tendon_mid', count: 5, description: 'Thu thập 5 Gân Thú Trung Cấp' },
      { type: 'talk', npcId: 'tho_ren_vu_khi', description: 'Giao nguyên liệu cho Thợ Rèn' }
    ],
    rewards: {
      exp: 900,
      items: [
        { itemId: 'blueprint_alloy_armor', quantity: 1 },
        { itemId: 'enhancement_stone_basic', quantity: 10 }
      ],
      reputation: 30
    }
  },

  // Daily Quests
  daily_monster_hunt: {
    title: '[Hằng Ngày] Săn Quái Thú',
    description: 'Nhiệm vụ hàng ngày: Tiêu diệt quái thú để bảo vệ căn cứ.',
    type: 'daily',
    npcId: 'vo_su_truong',
    requiredLevel: 5,
    objectives: [
      { type: 'kill', monsterId: 'bloodfang_boar', count: 10, description: 'Tiêu diệt 10 Lợn Rừng bất kỳ' }
    ],
    rewards: {
      exp: 300,
      items: [{ itemId: 'energy_crystal', quantity: 20 }]
    },
    isRepeatable: true
  },

  daily_resource_gather: {
    title: '[Hằng Ngày] Thu Thập Tài Nguyên',
    description: 'Nhiệm vụ hàng ngày: Thu thập tài nguyên cho căn cứ.',
    type: 'daily',
    npcId: 'thuong_nhan_vat_lieu',
    requiredLevel: 8,
    objectives: [
      { type: 'gather', itemId: 'monster_hide_low', count: 15, description: 'Thu thập 15 Da Thú Hạ Cấp' }
    ],
    rewards: {
      exp: 250,
      items: [{ itemId: 'energy_crystal', quantity: 15 }]
    },
    isRepeatable: true
  },

  // === GRINDING/FARMING QUESTS ===
  
  daily_boss_hunt: {
    title: '[Hằng Ngày] Săn Boss',
    description: 'Nhiệm vụ hàng ngày: Tiêu diệt Boss cấp để nhận thưởng lớn.',
    type: 'daily',
    npcId: 'vo_su_truong',
    requiredLevel: 12,
    objectives: [
      { type: 'kill', monsterId: 'armored_tiger', count: 1, description: 'Tiêu diệt 1 Boss bất kỳ' }
    ],
    rewards: {
      exp: 500,
      items: [
        { itemId: 'energy_crystal', quantity: 50 },
        { itemId: 'enhancement_stone_basic', quantity: 3 }
      ]
    },
    isRepeatable: true
  },

  daily_elite_hunt: {
    title: '[Hằng Ngày] Săn Quái Tinh Anh',
    description: 'Nhiệm vụ hàng ngày: Tiêu diệt quái thú cấp Tướng để luyện kỹ năng.',
    type: 'daily',
    npcId: 'vo_su_truong',
    requiredLevel: 7,
    objectives: [
      { type: 'kill', monsterId: 'iron_fist_ape', count: 5, description: 'Tiêu diệt 5 Thú Tướng cấp' }
    ],
    rewards: {
      exp: 400,
      items: [
        { itemId: 'energy_crystal', quantity: 30 },
        { itemId: 'cosmic_herb_low', quantity: 2 }
      ]
    },
    isRepeatable: true
  },

  daily_rare_material: {
    title: '[Hằng Ngày] Thu Thập Nguyên Liệu Quý',
    description: 'Nhiệm vụ hàng ngày: Thu thập nguyên liệu quý hiếm để chế tạo.',
    type: 'daily',
    npcId: 'thuong_nhan_vat_lieu',
    requiredLevel: 15,
    objectives: [
      { type: 'gather', itemId: 'monster_tendon_mid', count: 10, description: 'Thu thập 10 Gân Thú Trung Cấp' }
    ],
    rewards: {
      exp: 350,
      items: [
        { itemId: 'energy_crystal', quantity: 25 },
        { itemId: 'alloy_ore', quantity: 5 }
      ]
    },
    isRepeatable: true
  },

  weekly_boss_raid: {
    title: '[Hàng Tuần] Đột Kích Boss Hang Động',
    description: 'Nhiệm vụ hàng tuần: Tiêu diệt Boss khó trong Bí Cảnh để nhận phần thưởng khủng.',
    type: 'daily', // Use daily type but can be marked as weekly
    npcId: 'tinh_bao_vien',
    requiredLevel: 18,
    objectives: [
      { type: 'kill', monsterId: 'poison_spider_queen', count: 1, description: 'Tiêu diệt Nữ Vương Nhện Độc' }
    ],
    rewards: {
      exp: 1000,
      items: [
        { itemId: 'energy_crystal', quantity: 100 },
        { itemId: 'gene_solution_basic', quantity: 1 },
        { itemId: 'enhancement_stone_advanced', quantity: 5 },
        { itemId: 'fortune_talisman', quantity: 1 }
      ]
    },
    isRepeatable: true
  },

  grinding_energy_farm: {
    title: '[Lặp Lại] Cày Tinh Thể Năng Lượng',
    description: 'Nhiệm vụ có thể lặp lại: Cày cuốc để thu thập nhiều Tinh Thể Năng Lượng.',
    type: 'side',
    npcId: 'thuong_nhan_vat_lieu',
    requiredLevel: 5,
    objectives: [
      { type: 'kill', monsterId: 'bloodfang_boar', count: 20, description: 'Hạ 20 Lợn Rừng để cày Tinh Thể' }
    ],
    rewards: {
      exp: 200,
      items: [{ itemId: 'energy_crystal', quantity: 40 }]
    },
    isRepeatable: true
  },

  grinding_equipment_farm: {
    title: '[Lặp Lại] Cày Trang Bị',
    description: 'Nhiệm vụ có thể lặp lại: Săn Boss để cày trang bị quý hiếm.',
    type: 'side',
    npcId: 'vo_su_truong',
    requiredLevel: 22,
    objectives: [
      { type: 'kill', monsterId: 'stone_golem_king', count: 1, description: 'Hạ Vua Golem Đá để cày trang bị' }
    ],
    rewards: {
      exp: 800,
      items: [
        { itemId: 'energy_crystal', quantity: 60 },
        { itemId: 'exp_boost_pill', quantity: 1 }
      ]
    },
    isRepeatable: true
  },

  // Race-specific Quests
  human_heritage: {
    title: '[Nhân Loại] Di Sản Của Tổ Tiên',
    description: 'Trưởng Lão Nhân Loại muốn ngươi tìm hiểu về lịch sử chủng tộc.',
    type: 'side',
    npcId: 'truong_lao_nhan_loai',
    requiredLevel: 15,
    objectives: [
      { type: 'explore', zoneId: 'di_tich_thien_canh', description: 'Khám phá Di Tích Thiên Cảnh' },
      { type: 'gather', itemId: 'ancient_relic', count: 3, description: 'Thu thập 3 Thánh Vật Cổ Đại' },
      { type: 'talk', npcId: 'truong_lao_nhan_loai', description: 'Trở lại gặp Trưởng Lão' }
    ],
    rewards: {
      exp: 1200,
      items: [{ itemId: 'human_valor_badge', quantity: 1 }],
      reputation: 40
    }
  },

  // PVP Zone Quest
  chaos_zone_challenge: {
    title: 'Thử Thách Khu Hỗn Loạn',
    description: 'Người Cung Cấp Tình Báo thách thức ngươi vào khu PVP nguy hiểm.',
    type: 'side',
    npcId: 'tinh_bao_vien',
    requiredLevel: 25,
    objectives: [
      { type: 'explore', zoneId: 'khu_hon_loan_rung_thep', description: 'Khám phá Rừng Thép Tranh Chấp' },
      { type: 'gather', itemId: 'alloy_ore', count: 20, description: 'Thu thập 20 Quặng Hợp Kim trong khu PVP' },
      { type: 'talk', npcId: 'tinh_bao_vien', description: 'Báo cáo thành công' }
    ],
    rewards: {
      exp: 2500,
      items: [
        { itemId: 'steel_alloy_suit', quantity: 1 },
        { itemId: 'energy_crystal', quantity: 150 }
      ],
      reputation: 70
    }
  },

  // Advanced Secret Realm Quest
  ancient_ruins_mystery: {
    title: 'Bí Ẩn Di Tích Cổ',
    description: 'Di Tích Thiên Cảnh ẩn chứa nhiều bí mật. Hãy khám phá và thu thập thánh vật.',
    type: 'side',
    npcId: 'tinh_bao_vien',
    requiredLevel: 35,
    objectives: [
      { type: 'explore', zoneId: 'di_tich_thien_canh', description: 'Khám phá Di Tích Thiên Cảnh' },
      { type: 'kill', monsterId: 'ancient_guardian', count: 5, description: 'Đánh bại 5 Vệ Binh Cổ Đại' },
      { type: 'gather', itemId: 'ancient_relic', count: 5, description: 'Thu thập 5 Thánh Vật Cổ Đại' },
      { type: 'talk', npcId: 'tinh_bao_vien', description: 'Báo cáo phát hiện' }
    ],
    rewards: {
      exp: 4000,
      items: [
        { itemId: 'ancient_medallion', quantity: 1 },
        { itemId: 'gene_solution_elite', quantity: 1 },
        { itemId: 'energy_crystal', quantity: 300 }
      ],
      reputation: 120
    }
  }
} as const satisfies Record<string, QuestTemplate> // Đảm bảo type safety

export type QuestId = keyof typeof quests
