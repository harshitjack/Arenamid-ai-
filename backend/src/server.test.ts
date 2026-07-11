import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from './server';

// Mock DB connection so we don't try to connect to MongoDB during tests
vi.mock('./config/db', () => ({
  connectDB: vi.fn().mockResolvedValue(true)
}));

// Mock Socket.IO gateway setup
vi.mock('./sockets/gateway', () => ({
  initSockets: vi.fn()
}));

// Mock Google Generative AI status log
vi.mock('./ai/gemini', () => ({
  logAIStatus: vi.fn(),
  handleAICopilot: vi.fn()
}));

describe('Backend Express API Server', () => {
  it('should return 200 OK and online status on GET /', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'online');
    expect(res.body).toHaveProperty('platform', 'ArenaMind AI Operations Engine');
    expect(res.body).toHaveProperty('era', 'FIFA 2026');
  });

  it('should handle unrouted paths with 404', async () => {
    const res = await request(app).get('/api/invalid-route-xyz');
    expect(res.status).toBe(404);
  });

  // ==========================================
  // Authentication API Tests
  // ==========================================
  describe('Authentication endpoints', () => {
    const randomEmail = `test-${Math.random()}@example.com`;

    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Runner',
          email: randomEmail,
          password: 'securePassword123',
          role: 'fan'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('email', randomEmail);
      expect(res.body.user).toHaveProperty('name', 'Test Runner');
    });

    it('should fail registration if fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'incomplete@example.com',
          password: 'securePassword123'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Please provide all required fields');
    });

    it('should fail registration if email already exists', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Duplicate',
          email: randomEmail,
          password: 'securePassword123',
          role: 'fan'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Email already exists');
    });

    it('should login an existing user and return a token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: randomEmail,
          password: 'securePassword123'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe(randomEmail);
    });

    it('should fail login with invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: randomEmail,
          password: 'wrongPassword'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should protect /api/auth/profile route with 401 when token is missing', async () => {
      const res = await request(app).get('/api/auth/profile');
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Access token required');
    });

    it('should allow profile access and return user data with valid JWT', async () => {
      // First log in to get a token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: randomEmail,
          password: 'securePassword123'
        });
      
      const token = loginRes.body.token;

      // Access profile
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email', randomEmail);
      expect(res.body).toHaveProperty('name', 'Test Runner');
      expect(res.body).toHaveProperty('role', 'fan');
    });
  });
});
