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
  }
  mode: 'Combat' | 'Collect' // Combat mode or collection mode
  exp: number
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
    hpMax: { type: Number, default: 50 }
  },
  mode: { type: String, enum: ['Combat', 'Collect'], default: 'Combat' },
  exp: { type: Number, default: 0 }
}, { timestamps: true })
