import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { UserModel } from '../models/User';

// Demo seed accounts — always available for evaluation/testing
const DEMO_USERS = [
  {
    name: 'Sarah Connor',
    email: 'admin@arenamind.com',
    password: 'admin123',
    role: 'organizer',
    language: 'en',
    preferences: { accessibilityMode: false, favoriteTeam: 'USA', dietaryRestrictions: [] }
  },
  {
    name: 'David Beckham',
    email: 'volunteer@arenamind.com',
    password: 'volunteer123',
    role: 'volunteer',
    language: 'es',
    preferences: { accessibilityMode: false, favoriteTeam: 'Mexico', dietaryRestrictions: [] }
  },
  {
    name: 'Marcus Rashford',
    email: 'staff@arenamind.com',
    password: 'staff123',
    role: 'staff',
    language: 'en',
    preferences: { accessibilityMode: false, favoriteTeam: 'England', dietaryRestrictions: [] }
  },
  {
    name: 'John Doe',
    email: 'fan@arenamind.com',
    password: 'fan123',
    role: 'fan',
    language: 'en',
    preferences: { accessibilityMode: true, favoriteTeam: 'Canada', dietaryRestrictions: ['halal'] }
  }
];

/**
 * Seed demo accounts into MongoDB on server boot.
 * Safe to call multiple times — upserts by email, never duplicates.
 */
export const seedDemoUsers = async (): Promise<void> => {
  // Only seed when MongoDB is connected
  if (!process.env.MONGODB_URI || mongoose.connection.readyState !== 1) {
    console.log('⚡ Seeding skipped — using in-memory fallback users');
    return;
  }

  try {
    let seeded = 0;
    for (const user of DEMO_USERS) {
      const exists = await UserModel.findOne({ email: user.email });
      if (!exists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        await UserModel.create({ ...user, password: hashedPassword });
        seeded++;
      }
    }
    if (seeded > 0) {
      console.log(`🌱 Seeded ${seeded} demo user(s) into MongoDB`);
    } else {
      console.log('✅ Demo users already exist in MongoDB — no seeding needed');
    }
  } catch (err) {
    console.error('⚠️ Seeding error (non-fatal):', err);
  }
};
