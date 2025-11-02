// Race System Configuration
// Each race has unique stats, growth rates, and innate abilities

export interface RacialSkill {
  id: string
  name: string
  description: string
  type: 'passive' | 'active'
  cooldown?: number // for active skills (in seconds)
  energyCost?: number // for active skills
  effect: {
    // Passive effects
    statBoosts?: {
      attack?: number
      defense?: number
      speed?: number
      spirit?: number
      hpMax?: number
      energyMax?: number
      critChance?: number
      critDamage?: number
      dodgeChance?: number
      resistance?: number
    }
    // Active effects
    damage?: number
    healing?: number
    buffDuration?: number
    debuffDuration?: number
    specialEffect?: string
  }
}

export interface RaceConfig {
  name: string
  nameVi: string
  description: string
  baseStats: {
    hp: number
    energy: number
    attack: number
    defense: number
    speed: number
    spirit: number
  }
  // Stat growth per level (multipliers)
  statGrowth: {
    hp: number
    energy: number
    attack: number
    defense: number
    speed: number
    spirit: number
  }
  // Racial passive bonuses
  racialBonuses: {
    cultivationSpeed?: number // Bonus to cultivation speed
    expGain?: number // Bonus to exp gain
    critChance?: number // Bonus crit chance
    critDamage?: number // Bonus crit damage
    dodgeChance?: number // Bonus dodge chance
    resistance?: number // Bonus resistance
    energyCostReduction?: number // Reduce energy costs
    dropRateBonus?: number // Bonus to item drops
  }
  // Innate skills/talents
  innateSkills: RacialSkill[]
  // Starting location
  startingZone: string
}

export const races = {
  // 1. Human (Nhân Loại) - Balanced, adaptable
  human: {
    name: 'Human',
    nameVi: 'Nhân Loại',
    description: 'Con người đã trải qua Đại Niết Bàn, có khả năng thích nghi cao và cân bằng về mọi mặt. Họ là chủng tộc đa năng nhất.',
    baseStats: {
      hp: 100,
      energy: 500,
      attack: 10,
      defense: 8,
      speed: 10,
      spirit: 10
    },
    statGrowth: {
      hp: 10,
      energy: 20,
      attack: 1.5,
      defense: 1.2,
      speed: 1.0,
      spirit: 1.0
    },
    racialBonuses: {
      expGain: 0.1, // +10% exp gain
      cultivationSpeed: 0.05 // +5% cultivation speed
    },
    innateSkills: [
      {
        id: 'human_adaptability',
        name: 'Thích Nghi',
        description: 'Con người có khả năng thích nghi vượt trội. Nhận thêm 10% kinh nghiệm từ mọi nguồn.',
        type: 'passive',
        effect: {
          statBoosts: {}
        }
      },
      {
        id: 'human_willpower',
        name: 'Ý Chí Sắt Đá',
        description: 'Kích hoạt để hồi phục 30% HP và tăng 20% phòng thủ trong 30 giây.',
        type: 'active',
        cooldown: 300, // 5 minutes
        energyCost: 100,
        effect: {
          healing: 0.3, // 30% of max HP
          buffDuration: 30,
          specialEffect: 'defense_boost_20'
        }
      }
    ],
    startingZone: 'giang_nam_khu_dan_cu_01'
  },

  // 2. Mutant (Dị Nhân) - High attack, evolved genetics
  mutant: {
    name: 'Mutant',
    nameVi: 'Dị Nhân',
    description: 'Những con người đã đột biến gen sau Đại Niết Bàn, có sức mạnh vượt trội nhưng năng lượng thấp hơn. Chuyên về chiến đấu cận chiến.',
    baseStats: {
      hp: 120,
      energy: 400,
      attack: 15,
      defense: 10,
      speed: 8,
      spirit: 5
    },
    statGrowth: {
      hp: 12,
      energy: 15,
      attack: 2.0,
      defense: 1.5,
      speed: 0.8,
      spirit: 0.5
    },
    racialBonuses: {
      critChance: 0.05, // +5% crit chance
      critDamage: 0.2 // +20% crit damage
    },
    innateSkills: [
      {
        id: 'mutant_berserker',
        name: 'Bạo Tẩu',
        description: 'Sức mạnh tăng 10% khi HP dưới 50%. Sát thương chí mạng tăng thêm 20%.',
        type: 'passive',
        effect: {
          statBoosts: {
            critDamage: 0.2
          }
        }
      },
      {
        id: 'mutant_rage',
        name: 'Cuồng Nộ',
        description: 'Kích hoạt để tăng 50% sát thương trong 20 giây nhưng giảm 20% phòng thủ.',
        type: 'active',
        cooldown: 180, // 3 minutes
        energyCost: 150,
        effect: {
          buffDuration: 20,
          specialEffect: 'rage_mode'
        }
      }
    ],
    startingZone: 'giang_nam_khu_dan_cu_01'
  },

  // 3. Esper (Linh Năng Giả) - High spirit, psychic abilities
  esper: {
    name: 'Esper',
    nameVi: 'Linh Năng Giả',
    description: 'Con người giác ngộ được năng lực tinh thần sau Đại Niết Bàn. Có khả năng sử dụng niệm lực mạnh mẽ nhưng thể chất yếu.',
    baseStats: {
      hp: 80,
      energy: 600,
      attack: 5,
      defense: 5,
      speed: 12,
      spirit: 18
    },
    statGrowth: {
      hp: 8,
      energy: 25,
      attack: 0.5,
      defense: 0.8,
      speed: 1.2,
      spirit: 2.5
    },
    racialBonuses: {
      cultivationSpeed: 0.15, // +15% cultivation speed
      energyCostReduction: 0.1 // -10% energy costs
    },
    innateSkills: [
      {
        id: 'esper_mind',
        name: 'Tâm Linh Thông',
        description: 'Tăng 15% tốc độ tu luyện và giảm 10% chi phí năng lượng cho tất cả hành động.',
        type: 'passive',
        effect: {
          statBoosts: {}
        }
      },
      {
        id: 'esper_telekinesis',
        name: 'Niệm Động Lực',
        description: 'Kích hoạt để tấn công 5 mục tiêu bằng niệm lực, gây sát thương dựa trên Tinh Thần.',
        type: 'active',
        cooldown: 60, // 1 minute
        energyCost: 80,
        effect: {
          damage: 1.5, // 150% spirit damage
          specialEffect: 'spirit_aoe_5'
        }
      }
    ],
    startingZone: 'giang_nam_khu_dan_cu_01'
  },

  // 4. Cyborg (Cơ Giới Chiến Binh) - Balanced with tech focus
  cyborg: {
    name: 'Cyborg',
    nameVi: 'Cơ Giới Chiến Binh',
    description: 'Con người đã cơ giới hóa cơ thể bằng công nghệ tiên tiến. Có khả năng sử dụng module hiệu quả hơn và phòng thủ cao.',
    baseStats: {
      hp: 110,
      energy: 480,
      attack: 12,
      defense: 12,
      speed: 9,
      spirit: 8
    },
    statGrowth: {
      hp: 11,
      energy: 18,
      attack: 1.2,
      defense: 1.8,
      speed: 0.9,
      spirit: 0.8
    },
    racialBonuses: {
      resistance: 5, // +5 resistance
      dropRateBonus: 0.1 // +10% item drop rate
    },
    innateSkills: [
      {
        id: 'cyborg_armor',
        name: 'Giáp Cơ Giới',
        description: 'Tăng 5 điểm kháng và giảm 10% sát thương nhận vào từ các nguồn vật lý.',
        type: 'passive',
        effect: {
          statBoosts: {
            resistance: 5
          }
        }
      },
      {
        id: 'cyborg_overload',
        name: 'Quá Tải Hệ Thống',
        description: 'Kích hoạt tất cả module cùng lúc, tăng 30% hiệu quả trong 25 giây.',
        type: 'active',
        cooldown: 240, // 4 minutes
        energyCost: 120,
        effect: {
          buffDuration: 25,
          specialEffect: 'module_overload'
        }
      }
    ],
    startingZone: 'giang_nam_khu_dan_cu_01'
  },

  // 5. Beast Kin (Thú Nhân) - High speed and dodge
  beastkin: {
    name: 'Beast Kin',
    nameVi: 'Thú Nhân',
    description: 'Lai giữa người và quái thú, có bản năng săn mồi tuyệt vời. Tốc độ và khả năng né tránh vượt trội.',
    baseStats: {
      hp: 95,
      energy: 520,
      attack: 13,
      defense: 7,
      speed: 15,
      spirit: 7
    },
    statGrowth: {
      hp: 9,
      energy: 22,
      attack: 1.8,
      defense: 1.0,
      speed: 1.5,
      spirit: 0.6
    },
    racialBonuses: {
      dodgeChance: 0.08, // +8% dodge chance
      dropRateBonus: 0.15 // +15% monster drop rate
    },
    innateSkills: [
      {
        id: 'beastkin_instinct',
        name: 'Bản Năng Thú Tính',
        description: 'Tăng 8% khả năng né tránh và 15% tỷ lệ rơi vật phẩm từ quái vật.',
        type: 'passive',
        effect: {
          statBoosts: {
            dodgeChance: 0.08
          }
        }
      },
      {
        id: 'beastkin_hunt',
        name: 'Bản Năng Săn Mồi',
        description: 'Kích hoạt để tăng 40% tốc độ và 25% sát thương trong 15 giây.',
        type: 'active',
        cooldown: 120, // 2 minutes
        energyCost: 90,
        effect: {
          buffDuration: 15,
          specialEffect: 'hunt_mode'
        }
      }
    ],
    startingZone: 'giang_nam_khu_dan_cu_01'
  },

  // 6. Void Walker (Hư Không Hành Giả) - Stealth and critical focus
  voidwalker: {
    name: 'Void Walker',
    nameVi: 'Hư Không Hành Giả',
    description: 'Những người đã chạm được vào không gian hư không, có khả năng ẩn mình và tấn công chí mạng cực cao.',
    baseStats: {
      hp: 85,
      energy: 550,
      attack: 11,
      defense: 6,
      speed: 14,
      spirit: 12
    },
    statGrowth: {
      hp: 8,
      energy: 23,
      attack: 1.6,
      defense: 0.9,
      speed: 1.3,
      spirit: 1.1
    },
    racialBonuses: {
      critChance: 0.1, // +10% crit chance
      dodgeChance: 0.05 // +5% dodge chance
    },
    innateSkills: [
      {
        id: 'voidwalker_shadow',
        name: 'Bóng Tối Hư Không',
        description: 'Tăng 10% tỷ lệ chí mạng và 5% né tránh. Đòn đánh đầu tiên luôn chí mạng.',
        type: 'passive',
        effect: {
          statBoosts: {
            critChance: 0.1,
            dodgeChance: 0.05
          }
        }
      },
      {
        id: 'voidwalker_strike',
        name: 'Nhất Kích Tất Sát',
        description: 'Kích hoạt để tấn công 1 mục tiêu với 300% sát thương chí mạng và bỏ qua 50% phòng thủ.',
        type: 'active',
        cooldown: 150, // 2.5 minutes
        energyCost: 110,
        effect: {
          damage: 3.0,
          specialEffect: 'assassinate'
        }
      }
    ],
    startingZone: 'giang_nam_khu_dan_cu_01'
  }
} as const satisfies Record<string, RaceConfig>

export type RaceId = keyof typeof races
