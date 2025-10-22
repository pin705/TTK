import { Schema } from 'mongoose'
import { defineMongooseModel } from '#nuxt/mongoose'

export const CombatLog = defineMongooseModel('CombatLog', {
  characterId: { type: Schema.Types.ObjectId, ref: 'Character', index: true },
  monsterName: { type: String },
  isVictory: { type: Boolean },
  turns: [{
    turn: Number,
    actor: String, // 'player' or 'monster'
    action: String, // e.g., 'attack', 'skill_X'
    description: String // e.g., "Bạn tấn công, gây 50 sát thương."
  }],
  rewards: [{
    itemId: String,
    quantity: Number
  }]
}, { timestamps: true })
