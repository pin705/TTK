import { Schema } from 'mongoose'
import { defineMongooseModel } from '#nuxt/mongoose'

export interface IPet {
  _id: string
  ownerId: Schema.Types.ObjectId
  monsterId: string // Monster template ID
  name: string
  level: number
  stats: {
    attack: number
    defense: number
    hp: number
    hpMax: number
    speed: number
  }
  mode: 'Combat' | 'Collect' // Combat mode or collection mode
  exp: number
  // Breeding System (Feature 7)
  generation?: number // Generation number (1 = first gen, 2+ = bred)
  lastBreedTime?: Date // Last time this pet bred
  // Evolution System (Feature 7)
  evolutionTier?: number // 0 = base, 1-3 = evolved tiers
  talents?: string[] // Special abilities gained through evolution
  createdAt: Date
  updatedAt: Date
}

export const Pet = defineMongooseModel<IPet>('Pet', {
  ownerId: { type: Schema.Types.ObjectId, ref: 'Character', required: true, index: true },
  monsterId: { type: String, required: true },
  name: { type: String, required: true },
  level: { type: Number, default: 1 },
  stats: {
    attack: { type: Number, default: 5 },
    defense: { type: Number, default: 3 },
    hp: { type: Number, default: 50 },
    hpMax: { type: Number, default: 50 },
    speed: { type: Number, default: 10 }
  },
  mode: { type: String, enum: ['Combat', 'Collect'], default: 'Combat' },
  exp: { type: Number, default: 0 },
  generation: { type: Number, default: 1 },
  lastBreedTime: { type: Date },
  evolutionTier: { type: Number, default: 0 },
  talents: [{ type: String }]
}, { timestamps: true })
