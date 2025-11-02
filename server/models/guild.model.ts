import { Schema } from 'mongoose'
import { defineMongooseModel } from '#nuxt/mongoose'

export interface IGuild {
  _id: string
  name: string
  ownerId: Schema.Types.ObjectId
  members: Schema.Types.ObjectId[] // Character IDs
  level: number
  bank: Map<string, number> // Resource bank (itemId -> quantity)
  baseZoneId: string // Guild base instance zone ID
  createdAt: Date
  updatedAt: Date
}

export const Guild = defineMongooseModel<IGuild>('Guild', {
  name: { type: String, required: true, unique: true, index: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'Character', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'Character' }],
  level: { type: Number, default: 1 },
  bank: {
    type: Map,
    of: Number,
    default: {}
  },
  baseZoneId: { type: String, required: true }
}, { timestamps: true })
