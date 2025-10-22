import { defineMongooseModel } from '#nuxt/mongoose'

export const Event = defineMongooseModel('Event', {
  name: { type: String, required: true },
  description: String,
  triggerType: { type: String, enum: ['zone_enter', 'time_based', 'player_action'] },
  chance: { type: Number, min: 0, max: 1 },
  effects: [{
    type: { type: String }, // e.g., 'spawn_monster', 'give_item', 'modify_zone_desc'
    details: Object
  }]
})
