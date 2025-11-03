import { Schema } from 'mongoose'
import { defineMongooseModel } from '#nuxt/mongoose'

export interface GuildWar {
  targetGuildId: Schema.Types.ObjectId
  startTime: Date
  endTime: Date
  attackerScore: number
  defenderScore: number
  isDefender?: boolean
}

export interface IGuild {
  _id: string
  name: string
  ownerId: Schema.Types.ObjectId
  members: Schema.Types.ObjectId[] // Character IDs
  level: number
  bank: Map<string, number> // Resource bank (itemId -> quantity)
  baseZoneId: string // Guild base instance zone ID
  resources: number // Energy crystals for guild operations
  lastWarTime?: Date // Last time guild declared war
  activeWars?: GuildWar[] // Active guild wars (Feature 2)
  territories?: string[] // Controlled territories (Feature 2)
  warScore?: number // Total war victories
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
  baseZoneId: { type: String, required: true },
  resources: { type: Number, default: 0 },
  lastWarTime: { type: Date },
  activeWars: [{
    targetGuildId: { type: Schema.Types.ObjectId, ref: 'Guild' },
    startTime: { type: Date },
    endTime: { type: Date },
    attackerScore: { type: Number, default: 0 },
    defenderScore: { type: Number, default: 0 },
    isDefender: { type: Boolean, default: false }
  }],
  territories: [{ type: String }],
  warScore: { type: Number, default: 0 }
}, { timestamps: true })
