export const npcs = {
  vo_su_truong: {
    name: 'Võ Sư Trương',
    personality: 'neutral',
    dialogues: {
      greeting: [
        'Con đường võ đạo không có điểm dừng, chỉ có sự kiên trì.',
        'Cơ thể con người là một kho báu, hãy không ngừng khai phá nó.',
        'Một võ giả chân chính không chỉ có sức mạnh, mà còn có một trái tim kiên định.'
      ],
      farewell: ['Hãy chăm chỉ luyện tập.']
    }
    // quests: [{ questId: 'first_hunt', requiredLevel: 1 }] // Sẽ thêm sau
  },
  thuong_nhan_vat_lieu: {
    name: 'Lão Giả Bán Vật Liệu',
    personality: 'merchant',
    dialogues: {
      greeting: [
        'Vật liệu quái thú tươi mới đây! Cần gì cứ xem.',
        'Giá cả hôm nay lại biến động rồi, do tiểu đội Liệp Ưng vừa trở về đó.',
        'Cần Da Thú hay Gân Thú? Tôi có đủ cả, chỉ cần cậu có đủ tiền.'
      ],
      farewell: ['Hẹn gặp lại.', 'Lần sau có hàng tốt tôi sẽ giữ cho cậu.']
    }
  },
  tinh_bao_vien: {
    name: 'Người Cung Cấp Tình Báo',
    personality: 'neutral',
    dialogues: {
      greeting: [
        'Tin tức mới nhất, muốn nghe không? Đương nhiên là không miễn phí.',
        'Nghe nói ở khu hoang dã 0203 mới xuất hiện một con Thú Tướng biến dị.',
        'Một số thứ không thể mua được bằng tiền, mà phải mua bằng tin tức.'
      ],
      farewell: ['Hãy cẩn thận.']
    }
  },

  // === NEW NPCS - EXPANDED CONTENT ===

  // Training Masters at Training Area
  dao_su_huan_luyen: {
    name: 'Đao Sư Huấn Luyện',
    personality: 'strict',
    dialogues: {
      greeting: [
        'Đao pháp là nghệ thuật của tốc độ và sát thương. Ngươi có muốn học không?',
        'Một nhát đao chuẩn xác hơn trăm nhát lung tung.',
        'Ta có thể dạy ngươi kỹ thuật đao cơ bản, nhưng ngươi phải trả công.'
      ],
      farewell: ['Hãy luyện tập chăm chỉ.', 'Đao pháp không có đường tắt.']
    },
    services: ['skill_training', 'shop'],
    shopItems: [
      { itemId: 'skill_thunder_blade', price: 5000 },
      { itemId: 'skill_rapid_strike', price: 3000 }
    ]
  },

  kiem_su_huan_luyen: {
    name: 'Kiếm Sư Huấn Luyện',
    personality: 'wise',
    dialogues: {
      greeting: [
        'Kiếm đạo là con đường của sự cân bằng và kiểm soát.',
        'Một kiếm sư giỏi biết cách phòng thủ trước khi tấn công.',
        'Ta có thể truyền thụ cho ngươi kiếm pháp cơ bản.'
      ],
      farewell: ['Kiếm đạo dài vô tận.', 'Hãy luôn giữ thăng bằng.']
    },
    services: ['skill_training'],
    shopItems: [
      { itemId: 'skill_iron_body', price: 4500 }
    ]
  },

  quyen_su_huan_luyen: {
    name: 'Quyền Sư Huấn Luyện',
    personality: 'fierce',
    dialogues: {
      greeting: [
        'Thân thể là vũ khí mạnh nhất! Không cần gươm giáo!',
        'Quyền pháp của ta có thể đập vỡ cả đá!',
        'Muốn học Bát Cực Quyền không? Ta dạy cho!'
      ],
      farewell: ['Hãy rèn luyện thân thể!', 'Sức mạnh là tất cả!']
    },
    services: ['skill_training', 'stat_training'],
    shopItems: [
      { itemId: 'skill_eight_extremes_fist', price: 3500 }
    ]
  },

  // Guild Manager
  quan_ly_bang_hoi: {
    name: 'Quản Lý Bang Hội',
    personality: 'professional',
    dialogues: {
      greeting: [
        'Chào mừng đến Khu Bang Hội. Ta có thể giúp gì cho ngươi?',
        'Muốn tạo bang hội riêng? Cần 10,000 Tinh Thể Năng Lượng.',
        'Sức mạnh của tập thể luôn vượt trội cá nhân.'
      ],
      farewell: ['Chúc bang hội phát triển.', 'Hợp tác tạo nên sức mạnh.']
    },
    services: ['guild_management']
  },

  // Equipment Craftsmen
  tho_ren_vu_khi: {
    name: 'Thợ Rèn Vũ Khí Chuyên Nghiệp',
    personality: 'craftsman',
    dialogues: {
      greeting: [
        'Mang nguyên liệu đến, ta sẽ rèn cho ngươi vũ khí tốt nhất!',
        'Mỗi thanh kiếm đều có linh hồn riêng.',
        'Ta có thể nâng cấp vũ khí của ngươi, nếu ngươi có đá cường hóa.'
      ],
      farewell: ['Hãy trân trọng vũ khí.', 'Kim khí cần được tôi luyện thường xuyên.']
    },
    services: ['crafting', 'enhancement', 'shop'],
    shopItems: [
      { itemId: 'enhancement_stone_basic', price: 100 },
      { itemId: 'enhancement_stone_advanced', price: 500 },
      { itemId: 'blueprint_venom_blade', price: 8000 },
      { itemId: 'blueprint_golem_hammer', price: 15000 }
    ]
  },

  tho_ren_giap: {
    name: 'Thợ Rèn Giáp Giáp Chuyên Nghiệp',
    personality: 'craftsman',
    dialogues: {
      greeting: [
        'Giáp tốt là sự khác biệt giữa sống và chết.',
        'Ta chuyên chế tác giáp từ da quái thú và kim loại quý.',
        'Nâng cấp giáp cần đá cường hóa và nguyên liệu phù hợp.'
      ],
      farewell: ['Giáp chắc, mạng an toàn.', 'Đừng tiết kiệm với phòng thủ.']
    },
    services: ['crafting', 'enhancement', 'shop'],
    shopItems: [
      { itemId: 'enhancement_stone_basic', price: 100 },
      { itemId: 'enhancement_stone_advanced', price: 500 },
      { itemId: 'blueprint_spider_silk_armor', price: 10000 }
    ]
  },

  // Mysterious Merchant
  thuong_nhan_bi_an: {
    name: 'Thương Nhân Bí Ẩn',
    personality: 'mysterious',
    dialogues: {
      greeting: [
        'Ta có những thứ mà người khác không có... với giá phù hợp.',
        'Vật phẩm của ta không dành cho người yếu đuối.',
        'Trang bị đặc biệt theo chủng tộc? Ta có đấy.'
      ],
      farewell: ['Hẹn gặp lại... nếu ngươi còn sống.', 'Vận may mỉm cười với người có tiền.']
    },
    services: ['shop'],
    shopItems: [
      { itemId: 'human_valor_badge', price: 12000 },
      { itemId: 'mutant_power_gauntlet', price: 12000 },
      { itemId: 'esper_mind_crown', price: 12000 },
      { itemId: 'cyborg_power_core', price: 12000 },
      { itemId: 'beastkin_feral_totem', price: 12000 },
      { itemId: 'voidwalker_shadow_cloak', price: 12000 },
      { itemId: 'gene_solution_advanced', price: 20000 },
      { itemId: 'enhancement_stone_elite', price: 2000 }
    ]
  },

  // Healer NPC
  y_su: {
    name: 'Y Sư',
    personality: 'caring',
    dialogues: {
      greeting: [
        'Bị thương à? Ta có thể chữa cho ngươi.',
        'Sức khỏe là tài sản quý giá nhất.',
        'Dược phẩm chữa trị và phục hồi, ta có đủ cả.'
      ],
      farewell: ['Hãy giữ gìn sức khỏe.', 'Đừng liều mạng quá mức.']
    },
    services: ['healing', 'shop'],
    shopItems: [
      { itemId: 'life_essence_low', price: 500 },
      { itemId: 'energy_solution', price: 200 }
    ]
  },

  // Race-specific NPCs
  truong_lao_nhan_loai: {
    name: 'Trưởng Lão Nhân Loại',
    personality: 'elder',
    dialogues: {
      greeting: [
        'Con người chúng ta đã vượt qua Đại Niết Bàn. Đó là minh chứng cho sức mạnh.',
        'Ý chí là vũ khí mạnh nhất của con người.',
        'Hãy ghi nhớ lịch sử, để không lặp lại sai lầm.'
      ],
      farewell: ['Hãy làm cho chủng tộc tự hào.', 'Sức mạnh con người là vô tận.']
    },
    services: ['quest_giver', 'lore']
  },

  thuyen_truong_khong_gian: {
    name: 'Thuyền Trưởng Không Gian',
    personality: 'adventurous',
    dialogues: {
      greeting: [
        'Vũ trụ rộng lớn đang chờ đợi. Ngươi có đủ mạnh để khám phá không?',
        'Phi thuyền cần nhiên liệu. Đừng quên mang theo tế bào năng lượng.',
        'Hành tinh khác có nhiều nguy hiểm hơn Trái Đất.'
      ],
      farewell: ['Chúc hành trình thuận lợi.', 'Hãy cẩn thận ngoài vũ trụ.']
    },
    services: ['shop', 'space_travel'],
    shopItems: [
      { itemId: 'fuel_cell', price: 500 },
      { itemId: 'basic_shuttle', price: 100000 }
    ]
  }
} as const

export type NpcId = keyof typeof npcs
