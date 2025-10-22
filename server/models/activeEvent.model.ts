import { defineMongooseModel } from '#nuxt/mongoose'

// Collection này sẽ rất nhỏ, chỉ lưu các event đang active
export const ActiveEvent = defineMongooseModel('ActiveEvent', {
  eventId: { type: String, required: true }, // ID từ file config
  zoneId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  startMessage: { type: String },
  endMessage: { type: String },
  effects: { type: Array, required: true },
  expiresAt: { type: Date, required: true, index: true } // Thời gian kết thúc
}, { timestamps: true })
