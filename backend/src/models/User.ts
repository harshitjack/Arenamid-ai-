import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['fan', 'volunteer', 'organizer', 'staff'], default: 'fan' },
  language: { type: String, default: 'en' },
  preferences: {
    accessibilityMode: { type: Boolean, default: false },
    favoriteTeam: { type: String, default: '' },
    dietaryRestrictions: [{ type: String }],
  },
  createdAt: { type: Date, default: Date.now }
});

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
