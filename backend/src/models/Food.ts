import mongoose, { Schema } from 'mongoose';

const FoodSchema = new Schema({
  name: { type: String, required: true },
  stall: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ['halal', 'vegetarian', 'kids', 'healthy', 'general'],
    default: 'general',
  },
  queueTime: { type: Number, default: 5 }, // wait time in minutes
  occupancy: { type: Number, default: 20 }, // stall crowd density percentage
  walkingDistance: { type: Number, default: 3 }, // walking time in minutes
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const FoodModel = mongoose.models.Food || mongoose.model('Food', FoodSchema, 'stadium_foods');
