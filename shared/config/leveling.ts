// === CÔNG THỨC TÍNH EXP CẦN THIẾT CHO MỖI LEVEL ===
// Ví dụ: EXP(level) = base * (level ^ exponent)
const BASE_EXP = 100
const EXP_EXPONENT = 1.5

export function getExpRequiredForLevel(level: number): number {
  if (level <= 1) return 0
  return Math.floor(BASE_EXP * Math.pow(level - 1, EXP_EXPONENT))
}

// === PHẦN THƯỞNG CHỈ SỐ KHI LÊN CẤP ===
export const STAT_GAINS_PER_LEVEL = {
  hpMax: 15,
  energyMax: 25,
  attack: 2,
  defense: 1,
  statPoints: 5 // <-- THÊM: Mỗi level nhận 5 điểm tiềm năng
  // statPoints: 5,
} as const

export const ALLOCATABLE_STATS = ['attack', 'defense', 'speed', 'hpMax', 'energyMax'] as const
export type AllocatableStat = typeof ALLOCATABLE_STATS[number]
