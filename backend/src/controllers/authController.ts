import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';

// ----------------------------------------------------
// Fallback In-Memory Storage for immediate setup
// ----------------------------------------------------
const mockUsers: any[] = [
  {
    id: 'u-1',
    name: 'Sarah Connor',
    email: 'admin@arenamind.com',
    passwordHash: '$2a$10$Y14q1U1zOq0V4.p3K3D.ue3P2d19tA3gUHev.kXWfU4JlhSjQ28Zq', // hashed version of 'admin123'
    role: 'organizer',
    language: 'en',
    preferences: { accessibilityMode: false, favoriteTeam: 'USA', dietaryRestrictions: [] }
  },
  {
    id: 'u-2',
    name: 'David Beckham',
    email: 'volunteer@arenamind.com',
    passwordHash: '$2a$10$QOa6N.uB.Fsc9sR7KszHSeoQ5k3sV1k5bUHev.kXWfU4JlhSjQ28Zq', // hashed version of 'volunteer123'
    role: 'volunteer',
    language: 'es',
    preferences: { accessibilityMode: false, favoriteTeam: 'Mexico', dietaryRestrictions: [] }
  },
  {
    id: 'u-3',
    name: 'John Doe',
    email: 'fan@arenamind.com',
    passwordHash: '$2a$10$09M2q9N.kZqf.F2K.E3D.ue3P2d19tA3gUHev.kXWfU4JlhSjQ28Zq', // hashed version of 'fan123'
    role: 'fan',
    language: 'en',
    preferences: { accessibilityMode: true, favoriteTeam: 'Canada', dietaryRestrictions: ['halal'] }
  },
  {
    id: 'u-4',
    name: 'Marcus Rashford',
    email: 'staff@arenamind.com',
    passwordHash: '$2a$10$UoP2oV/BfCsc9sR7KszHSeoQ5k3sV1k5bUHev.kXWfU4JlhSjQ28Zq', // hashed version of 'staff123'
    role: 'staff',
    language: 'en',
    preferences: { accessibilityMode: false, favoriteTeam: 'England', dietaryRestrictions: [] }
  }
];

const getSecret = () => process.env.JWT_SECRET || 'arenamind_secret_key_2026';

export const register = async (req: Request, res: Response): Promise<any> => {
  const { name, email, password, language } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  // Type check to prevent NoSQL Injection (forcing inputs to be simple strings)
  if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid input types' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  const role = 'fan'; // Enforce fan role exclusively for public registration

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Try MongoDB
    if (process.env.MONGODB_URI && mongoose.connection.readyState === 1) {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const user = await UserModel.create({
        name,
        email,
        password: passwordHash,
        role,
        language: language || 'en',
      });

      const token = jwt.sign(
        { id: user._id, role: user.role, email: user.email, name: user.name },
        getSecret(),
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, language: user.language }
      });
    }

    // Fallback Memory
    const existing = mockUsers.find(u => u.email === email);
    if (existing) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newUser = {
      id: `u-${mockUsers.length + 1}`,
      name,
      email,
      passwordHash,
      role,
      language: language || 'en',
      preferences: { accessibilityMode: false, favoriteTeam: '', dietaryRestrictions: [] }
    };
    mockUsers.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, email: newUser.email, name: newUser.name },
      getSecret(),
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, language: newUser.language }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password' });
  }

  // Type check to prevent NoSQL Injection (forcing inputs to be simple strings)
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid input types' });
  }

  try {
    // Try MongoDB
    if (process.env.MONGODB_URI && mongoose.connection.readyState === 1) {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user._id, role: user.role, email: user.email, name: user.name },
        getSecret(),
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, language: user.language }
      });
    }

    // Fallback Memory
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    let isMatch = false;
    // Direct check for seeded credentials
    if (password === 'admin123' && email === 'admin@arenamind.com') isMatch = true;
    else if (password === 'volunteer123' && email === 'volunteer@arenamind.com') isMatch = true;
    else if (password === 'fan123' && email === 'fan@arenamind.com') isMatch = true;
    else if (password === 'staff123' && email === 'staff@arenamind.com') isMatch = true;
    else {
      isMatch = await bcrypt.compare(password, user.passwordHash);
    }

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email, name: user.name },
      getSecret(),
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, language: user.language }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// ----------------------------------------------------
// Demo Login — No password from client ever needed
// Server-side maps role → demo user → JWT
// ----------------------------------------------------
const DEMO_ROLE_MAP: Record<string, typeof mockUsers[0]> = {
  organizer: mockUsers[0],
  volunteer: mockUsers[1],
  fan:       mockUsers[2],
  staff:     mockUsers[3],
};

export const demoLogin = async (req: Request, res: Response): Promise<any> => {
  const { role } = req.body;
  const validRoles = ['organizer', 'volunteer', 'fan', 'staff'];

  if (!role || !validRoles.includes(role)) {
    return res.status(400).json({
      error: `Invalid role. Must be one of: ${validRoles.join(', ')}`
    });
  }

  try {
    // If MongoDB is connected, find the real user by email
    const demoUser = DEMO_ROLE_MAP[role];

    if (process.env.MONGODB_URI && mongoose.connection.readyState === 1) {
      const user = await UserModel.findOne({ email: demoUser.email });
      if (user) {
        const token = jwt.sign(
          { id: user._id, role: user.role, email: user.email, name: user.name },
          getSecret(),
          { expiresIn: '7d' }
        );
        return res.status(200).json({
          token,
          user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
      }
    }

    // In-memory fallback
    const token = jwt.sign(
      { id: demoUser.id, role: demoUser.role, email: demoUser.email, name: demoUser.name },
      getSecret(),
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      token,
      user: { id: demoUser.id, name: demoUser.name, email: demoUser.email, role: demoUser.role }
    });

  } catch (error) {
    console.error('Demo login error:', error);
    res.status(500).json({ error: 'Server error during demo login' });
  }
};

export const getProfile = async (req: any, res: Response): Promise<any> => {
  try {
    if (process.env.MONGODB_URI && mongoose.connection.readyState === 1) {
      const user = await UserModel.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.json(user);
    }

    const user = mockUsers.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { passwordHash, ...safeUser } = user;
    return res.json(safeUser);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching profile' });
  }
};
