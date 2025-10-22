import { Schema } from 'mongoose'
import { defineMongooseModel } from '#nuxt/mongoose'

export interface ICharacter {
  _id: string
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
    durationTurns: number
    power: number
  }[]
  reputation: number
  karma: number
  inCombat: boolean
  combat: {
    monsterId: string | null
    monsterHp: number
    monsterName: string
  }
  lastCultivateTick: Date
}

export const Character = defineMongooseModel<ICharacter>('Character', {
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, unique: true },
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
    stage: { type: String, default: 'Võ Giả Cấp Thấp' },
    exp: { type: Number, default: 0 },
    stateOfMind: { type: Number, default: 1.0, min: 0.1, max: 2.0 },
    comprehension: { type: Number, default: 10 }
  },
  stats: {
    attack: { type: Number, default: 10 },
    defense: { type: Number, default: 5 },
    speed: { type: Number, default: 10 },
    critChance: { type: Number, default: 0.05 },
    critDamage: { type: Number, default: 1.5 },
    dodgeChance: { type: Number, default: 0.05 },
    resistance: { type: Number, default: 0 }
  },
  effects: [{
    effectId: String,
    name: String,
    durationTurns: Number,
    power: Number
  }],
  reputation: { type: Number, default: 0 },
  karma: { type: Number, default: 0 },
  inCombat: { type: Boolean, default: false },
  combat: {
    monsterId: { type: String, default: null },
    monsterHp: { type: Number, default: 0 },
    monsterName: { type: String, default: '' }
  },
  lastCultivateTick: { type: Date, default: Date.now }
}, { timestamps: true })
