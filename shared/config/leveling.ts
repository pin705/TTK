import type { RaceId } from './races'
import { races } from './races'

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

// === RACE-BASED STAT GROWTH ===
/**
 * Calculate stat gains on level up based on character race
 * Each race has different growth rates
 */
export function getRaceStatGains(race: RaceId) {
  const raceConfig = races[race]
  return {
    hpMax: Math.floor(STAT_GAINS_PER_LEVEL.hpMax * (raceConfig.statGrowth.hp / 10)),
    energyMax: Math.floor(STAT_GAINS_PER_LEVEL.energyMax * (raceConfig.statGrowth.energy / 20)),
    attack: STAT_GAINS_PER_LEVEL.attack * (raceConfig.statGrowth.attack / 1.5),
    defense: STAT_GAINS_PER_LEVEL.defense * (raceConfig.statGrowth.defense / 1.2),
    speed: raceConfig.statGrowth.speed,
    spirit: raceConfig.statGrowth.spirit,
    statPoints: STAT_GAINS_PER_LEVEL.statPoints
  }
}

/**
 * Interface for character base stats
 */
export interface CharacterBaseStats {
  attack: number
  defense: number
  speed: number
  spirit: number
  critChance: number
  critDamage: number
  dodgeChance: number
  resistance: number
}

/**
 * Apply racial bonuses to a character's stats
 * This includes passive bonuses from race configuration
 */
export function applyRacialBonuses(baseStats: CharacterBaseStats, race: RaceId): CharacterBaseStats {
  const raceConfig = races[race]
  const bonuses = raceConfig.racialBonuses as any // Type assertion to handle varied bonus structures
  
  return {
    ...baseStats,
    critChance: (baseStats.critChance || 0) + (bonuses?.critChance || 0),
    critDamage: (baseStats.critDamage || 1.5) + (bonuses?.critDamage || 0),
    dodgeChance: (baseStats.dodgeChance || 0) + (bonuses?.dodgeChance || 0),
    resistance: (baseStats.resistance || 0) + (bonuses?.resistance || 0)
  }
}
