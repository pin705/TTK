// Equipment Set Bonus System (Feature 4)

export interface SetBonus {
  pieces: number // Number of pieces required
  bonuses: {
    attack?: number
    defense?: number
    spirit?: number
    speed?: number
    hpMax?: number
    energyMax?: number
    critChance?: number
    critDamage?: number
    dodgeChance?: number
    resistance?: number
    // Special bonuses
    damageBonus?: number // Percentage damage increase
    damageReduction?: number // Percentage damage reduction
    lifeSteal?: number // Percentage life steal
    energyRegen?: number // Energy regen per second
    specialEffect?: string // Special effect identifier
  }
}

export interface EquipmentSet {
  name: string
  nameVi: string
  description: string
  rarity: 'uncommon' | 'rare' | 'epic' | 'legendary'
  setBonuses: SetBonus[]
}

export const equipmentSets = {
  dragon_set: {
    name: 'Dragon Scale Set',
    nameVi: 'Bộ Vảy Rồng',
    description: 'Giáp làm từ vảy rồng huyền thoại, tăng sức mạnh và sinh lực.',
    rarity: 'epic',
    setBonuses: [
      {
        pieces: 2,
        bonuses: {
          hpMax: 500,
          resistance: 15,
          specialEffect: 'dragon_scales_2' // Tăng 10% phòng thủ
        }
      },
      {
        pieces: 4,
        bonuses: {
          hpMax: 1000,
          attack: 40,
          defense: 40,
          resistance: 30,
          damageReduction: 0.15, // Giảm 15% sát thương nhận vào
          specialEffect: 'dragon_scales_4' // Dragon's Fury: Khi HP < 30%, tăng 30% sát thương
        }
      }
    ]
  },

  phoenix_set: {
    name: 'Phoenix Set',
    nameVi: 'Bộ Hỏa Phượng',
    description: 'Trang bị của Hỏa Phượng, mang sức mạnh lửa và tái sinh.',
    rarity: 'legendary',
    setBonuses: [
      {
        pieces: 2,
        bonuses: {
          attack: 50,
          spirit: 40,
          critChance: 0.1,
          specialEffect: 'phoenix_flames_2' // Tấn công thường có 20% tỉ lệ gây cháy
        }
      },
      {
        pieces: 3,
        bonuses: {
          attack: 80,
          spirit: 70,
          hpMax: 800,
          critChance: 0.2,
          critDamage: 0.4,
          lifeSteal: 0.1, // Hút 10% máu từ sát thương gây ra
          specialEffect: 'phoenix_rebirth' // Khi chết, tái sinh 1 lần với 50% HP (cooldown 1 giờ)
        }
      }
    ]
  },

  void_set: {
    name: 'Void Set',
    nameVi: 'Bộ Hư Không',
    description: 'Trang bị từ chiều không gian khác, tăng khả năng né tránh và chí mạng.',
    rarity: 'legendary',
    setBonuses: [
      {
        pieces: 2,
        bonuses: {
          critChance: 0.15,
          dodgeChance: 0.15,
          specialEffect: 'void_walker_2' // Né tránh thành công thì đòn tiếp theo chí mạng
        }
      },
      {
        pieces: 3,
        bonuses: {
          attack: 70,
          critChance: 0.25,
          critDamage: 0.5,
          dodgeChance: 0.25,
          speed: 30,
          specialEffect: 'void_walker_3' // Bước Hư Không: Có thể dịch chuyển tức thời (cooldown 30s)
        }
      }
    ]
  },

  titan_set: {
    name: 'Titan Set',
    nameVi: 'Bộ Titan',
    description: 'Giáp khổng lồ của người khổng lồ, tăng HP và phòng thủ cực lớn.',
    rarity: 'epic',
    setBonuses: [
      {
        pieces: 2,
        bonuses: {
          hpMax: 800,
          defense: 50,
          resistance: 20,
          specialEffect: 'titan_endurance_2' // Tăng 20% hiệu quả hồi máu
        }
      },
      {
        pieces: 4,
        bonuses: {
          hpMax: 1500,
          defense: 100,
          resistance: 40,
          damageReduction: 0.2,
          specialEffect: 'titan_guardian' // Tạo khiên hấp thụ 30% HP khi nhận sát thương > 30% HP (cooldown 2 phút)
        }
      }
    ]
  },

  assassin_set: {
    name: 'Shadow Assassin Set',
    nameVi: 'Bộ Thích Khách Bóng Tối',
    description: 'Trang bị của thích khách, tăng chí mạng và tốc độ.',
    rarity: 'rare',
    setBonuses: [
      {
        pieces: 2,
        bonuses: {
          critChance: 0.12,
          speed: 20,
          specialEffect: 'shadow_step_2' // Tăng 15% tốc độ di chuyển
        }
      },
      {
        pieces: 4,
        bonuses: {
          attack: 60,
          critChance: 0.25,
          critDamage: 0.6,
          speed: 40,
          specialEffect: 'assassinate' // Đòn đầu tiên vào mục tiêu chưa bị tấn công gây 200% sát thương
        }
      }
    ]
  },

  mage_set: {
    name: 'Archmage Set',
    nameVi: 'Bộ Đại Pháp Sư',
    description: 'Trang bị của pháp sư, tăng tinh thần và năng lượng.',
    rarity: 'epic',
    setBonuses: [
      {
        pieces: 2,
        bonuses: {
          spirit: 50,
          energyMax: 300,
          energyRegen: 5, // +5 energy/giây
          specialEffect: 'mana_flow_2' // Giảm 10% chi phí năng lượng
        }
      },
      {
        pieces: 4,
        bonuses: {
          spirit: 100,
          energyMax: 600,
          energyRegen: 12,
          critChance: 0.15,
          specialEffect: 'arcane_mastery' // Kỹ năng tinh thần có 25% tỉ lệ không tốn năng lượng
        }
      }
    ]
  }
} as const

export type EquipmentSetId = keyof typeof equipmentSets
