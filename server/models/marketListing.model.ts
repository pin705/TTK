import { Schema } from 'mongoose'
import { defineMongooseModel } from '#nuxt/mongoose'

export interface IMarketListing {
  _id: string
  sellerId: Schema.Types.ObjectId
  itemId: string
  quantity: number
  pricePerUnit: number
  currency: 'credits' | 'energyCrystals'
  status: 'active' | 'sold' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

export const MarketListing = defineMongooseModel<IMarketListing>('MarketListing', {
  sellerId: { type: Schema.Types.ObjectId, ref: 'Character', required: true, index: true },
  itemId: { type: String, required: true, index: true },
  quantity: { type: Number, required: true, min: 1 },
  pricePerUnit: { type: Number, required: true, min: 1 },
  currency: { type: String, enum: ['credits', 'energyCrystals'], default: 'energyCrystals' },
  status: { type: String, enum: ['active', 'sold', 'cancelled'], default: 'active', index: true }
}, { timestamps: true })
