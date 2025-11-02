import { Schema } from 'mongoose'
import { defineMongooseModel } from '#nuxt/mongoose'

export interface IShip {
  _id: string
  ownerId: Schema.Types.ObjectId
  shipType: string // e.g., 'basic_shuttle', 'cargo_vessel', 'combat_cruiser'
  name: string
  stats: {
    fuel: number
    fuelMax: number
    cargo: number
    cargoMax: number
    speed: number
    hp: number
    hpMax: number
  }
  createdAt: Date
  updatedAt: Date
}

export const Ship = defineMongooseModel<IShip>('Ship', {
  ownerId: { type: Schema.Types.ObjectId, ref: 'Character', required: true, index: true },
  shipType: { type: String, required: true },
  name: { type: String, required: true },
  stats: {
    fuel: { type: Number, default: 100 },
    fuelMax: { type: Number, default: 100 },
    cargo: { type: Number, default: 0 },
    cargoMax: { type: Number, default: 50 },
    speed: { type: Number, default: 10 },
    hp: { type: Number, default: 100 },
    hpMax: { type: Number, default: 100 }
  }
}, { timestamps: true })
