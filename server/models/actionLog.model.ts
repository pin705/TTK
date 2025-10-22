import { Schema } from 'mongoose'
import { defineMongooseModel } from '#nuxt/mongoose'

export const ActionLog = defineMongooseModel('ActionLog', {
  characterId: { type: Schema.Types.ObjectId, ref: 'Character', required: true, index: true },
  action: { type: String, required: true }, // "move", "attack", "gather", "cultivate"
  result: { type: String }, // "success", "failure"
  details: { type: Object } // { fromZone: 'A', toZone: 'B' } or { damage: 50, target: 'MonsterX' }
}, { timestamps: true, capped: { size: 10000000, max: 50000 } }) // Capped collection
