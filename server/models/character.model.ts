import { Schema } from 'mongoose'
import { defineMongooseModel } from '#nuxt/mongoose'

export interface ActiveQuestObjective {
  type: string // 'kill', 'gather', 'talk', 'explore'
  target: string // monsterId, itemId, npcId, zoneId
  count: number // Số lượng yêu cầu
  current: number // Tiến trình hiện tại
}

export interface ActiveQuest {
  questId: string
  status: 'active' | 'completed' | 'claimed' // Trạng thái nhiệm vụ
  objectives: ActiveQuestObjective[]
  startedAt: Date
}

export interface ICharacter {
  _id: string
  avatar?: string
  level: number
  statPoints: number // <-- Điểm tiềm năng chưa phân phối
  allocatedStats: { // <-- Điểm đã cộng vào chỉ số
    attack: number
    defense: number
    speed: number
    hpMax: number
    energyMax: number
  }
  userId: Schema.Types.ObjectId
  name: string
  hp: number
  hpMax: number
  energy: number
  energyMax: number
  currentZoneId: string
  inventory: { itemId: string, quantity: number }[]
  equipment: {
    weapon: string | null
    armor: string | null
    accessory: string | null
  }
  cultivation: {
    stage: string
    exp: number
    stateOfMind: number
    comprehension: number
    stageId: string
    isCultivating: boolean
  }
  // Evolution System (Gene-based progression)
  evolution?: {
    geneEnergy: number // Replaces cultivationExp
    rank: string // e.g., 'apprentice_1', 'soldier_low'
    rankLevel: number // 1-9 for Apprentice, then Low/Mid/High for others
    modules: { // Body augmentation modules
      cultivation?: string | null // Cultivation Chip ID
      combat?: string | null // Combat Module ID
      survival?: string | null // Survival Module ID
    }
    geneIntegrity: number // 0-100, reduced by failed breakthroughs
  }
  resources?: {
    energyCrystals: number // Main currency and cultivation resource
  }
  stats: {
    attack: number
    defense: number
    speed: number
    critChance: number
    critDamage: number
    dodgeChance: number
    resistance: number
  }
  effects: {
    effectId: string
    name: string
    durationTurns?: number
    power?: number
    preventsCombat?: boolean
    hpRegenModifier?: number
    energyRegenModifier?: number
    expiresAt?: Date
  }[]
  reputation: number
  karma: number
  inCombat: boolean
  combat: {
    monsterId: string | null
    monsterHp: number
    monsterName: string
  } | null
  activeQuests: ActiveQuest[] // Nhiệm vụ đang hoạt động
  completedQuests: string[] // Lưu ID quest đã hoàn thành
  exploration: Map<string, {
    progress: number
    discoveredQuests: string[]
  }>
  lastCultivateTick: Date
}

// --- Định nghĩa Schema con cho Objective ---
const ObjectiveSchema = new Schema({
  type: { type: String, required: true },
  target: { type: String, required: true },
  count: { type: Number, required: true },
  current: { type: Number, default: 0 }
}, { _id: false }); // _id: false để không tự tạo _id cho objective

// --- Định nghĩa Schema con cho ActiveQuest ---
const ActiveQuestSchema = new Schema({
    questId: { type: String, required: true },
    status: { type: String, enum: ['active', 'completed', 'claimed'], default: 'active' },
    objectives: [ObjectiveSchema], // <-- Sử dụng Schema con ở đây
    startedAt: { type: Date, default: Date.now }
}, { _id: false }); // _id: false để không tự tạo _id cho activeQuest

export const Character = defineMongooseModel<ICharacter>('Character', {
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  avatar: { type: String, default: '' },
  level: { type: Number, default: 1, index: true },
  statPoints: { type: Number, default: 0 }, // <-- Thêm điểm tiềm năng
  allocatedStats: { // <-- Thêm điểm đã cộng
    type: {
      attack: { type: Number, default: 0 },
      defense: { type: Number, default: 0 },
      speed: { type: Number, default: 0 },
      hpMax: { type: Number, default: 0 },
      energyMax: { type: Number, default: 0 }
    },
    default: () => ({}), // Giá trị mặc định là object rỗng
    _id: false
  },
  name: { type: String, required: true },
  hp: { type: Number, default: 100 },
  hpMax: { type: Number, default: 100 },
  energy: { type: Number, default: 500 },
  energyMax: { type: Number, default: 500 },
  currentZoneId: { type: String, required: true },
  inventory: [{ itemId: String, quantity: Number }],
  equipment: {
    weapon: { type: String, default: null },
    armor: { type: String, default: null },
    accessory: { type: String, default: null }
  },
  cultivation: {
    stage: { type: String, default: 'Học Đồ Cấp Thấp' },
    exp: { type: Number, default: 0 },
    stateOfMind: { type: Number, default: 1.0, min: 0.1, max: 2.0 },
    comprehension: { type: Number, default: 10 },
    stageId: { type: String, default: 'apprentice_low' },
    isCultivating: { type: Boolean, default: false }
  },
  evolution: {
    geneEnergy: { type: Number, default: 0 },
    rank: { type: String, default: 'apprentice_1' },
    rankLevel: { type: Number, default: 1 },
    modules: {
      _id: false,
      cultivation: { type: String, default: null },
      combat: { type: String, default: null },
      survival: { type: String, default: null }
    },
    geneIntegrity: { type: Number, default: 100, min: 0, max: 100 }
  },
  resources: {
    energyCrystals: { type: Number, default: 0 }
  },
  stats: {
    attack: { type: Number, default: 10 },
    defense: { type: Number, default: 5 },
    speed: { type: Number, default: 10 },
    critChance: { type: Number, default: 0.05, min: 0, max: 1 },
    critDamage: { type: Number, default: 1.5, min: 1 },
    dodgeChance: { type: Number, default: 0.05, min: 0, max: 1 },
    resistance: { type: Number, default: 0 }
  },
  effects: [{
    _id: false,
    effectId: String,
    name: String,
    durationTurns: Number,
    power: Number,
    preventsCombat: { type: Boolean, default: false },
    hpRegenModifier: { type: Number, default: 0 }, // e.g., -1 (ngăn chặn), 0.5 (tăng 50%)
    energyRegenModifier: { type: Number, default: 0 }, // e.g., -1 (ngăn chặn), 0.5 (tăng 50%)
    expiresAt: { type: Date }
  }],
  reputation: { type: Number, default: 0 },
  karma: { type: Number, default: 0 },
  inCombat: { type: Boolean, default: false },
  combat: { // Sửa lại schema combat
    type: {
      monsterId: { type: String },
      monsterHp: { type: Number },
      monsterName: { type: String }
    },
    default: null, // Cho phép combat là null khi không chiến đấu
    _id: false
  },
  activeQuests: [ActiveQuestSchema], // Nhiệm vụ đang hoạt động
  completedQuests: [String], // Lưu ID quest đã hoàn thành
  exploration: {
    type: Map,
    of: {
      _id: false, // Thêm _id: false
      progress: { type: Number, default: 0 },
      discoveredQuests: [String]
    },
    default: {}
  },
  lastCultivateTick: { type: Date, default: Date.now }
}, { timestamps: true })
