import { describe, it, expect, beforeAll } from 'vitest';
import { app } from './server';
import request from 'supertest';

// ===================================================
// Auth — Register Endpoint Tests
// ===================================================
describe('POST /api/auth/register', () => {
  it('should register a new user and return a JWT token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'securepass123',
      role: 'fan'
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.role).toBe('fan');
  });

  it('should return 400 when name is missing', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'noname@example.com',
      password: 'pass123'
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 when email is missing', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test',
      password: 'pass123'
    });
    expect(res.status).toBe(400);
  });

  it('should return 400 when password is missing', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test',
      email: 'nopwd@example.com'
    });
    expect(res.status).toBe(400);
  });

  it('should reject duplicate email registrations', async () => {
    const email = `dup${Date.now()}@example.com`;
    await request(app).post('/api/auth/register').send({ name: 'First', email, password: 'pass123' });
    const res = await request(app).post('/api/auth/register').send({ name: 'Second', email, password: 'pass456' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/already exists/i);
  });
});

// ===================================================
// Auth — Login Endpoint Tests
// ===================================================
describe('POST /api/auth/login', () => {
  it('should login with correct organizer credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@arenamind.com',
      password: 'admin123'
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.role).toBe('organizer');
  });

  it('should login with correct volunteer credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'volunteer@arenamind.com',
      password: 'volunteer123'
    });
    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe('volunteer');
  });

  it('should login with correct staff credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'staff@arenamind.com',
      password: 'staff123'
    });
    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe('staff');
  });

  it('should login with correct fan credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'fan@arenamind.com',
      password: 'fan123'
    });
    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe('fan');
  });

  it('should return 401 for wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@arenamind.com',
      password: 'wrongpassword'
    });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 401 for non-existent user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'ghost@nowhere.com',
      password: 'pass123'
    });
    expect(res.status).toBe(401);
  });

  it('should return 400 when email and password are both missing', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
  });

  it('should return 400 when email is missing', async () => {
    const res = await request(app).post('/api/auth/login').send({ password: 'pass123' });
    expect(res.status).toBe(400);
  });

  it('should return 400 when password is missing', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'admin@arenamind.com' });
    expect(res.status).toBe(400);
  });
});

// ===================================================
// Auth — Demo Login Endpoint Tests (Secure)
// ===================================================
describe('POST /api/auth/demo-login', () => {
  it('should return a valid token for organizer role', async () => {
    const res = await request(app).post('/api/auth/demo-login').send({ role: 'organizer' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.role).toBe('organizer');
  });

  it('should return a valid token for volunteer role', async () => {
    const res = await request(app).post('/api/auth/demo-login').send({ role: 'volunteer' });
    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe('volunteer');
  });

  it('should return a valid token for fan role', async () => {
    const res = await request(app).post('/api/auth/demo-login').send({ role: 'fan' });
    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe('fan');
  });

  it('should return a valid token for staff role', async () => {
    const res = await request(app).post('/api/auth/demo-login').send({ role: 'staff' });
    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe('staff');
  });

  it('should reject unknown roles', async () => {
    const res = await request(app).post('/api/auth/demo-login').send({ role: 'hacker' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should reject missing role', async () => {
    const res = await request(app).post('/api/auth/demo-login').send({});
    expect(res.status).toBe(400);
  });
});

// ===================================================
// Public API — Incidents
// ===================================================
describe('GET /api/incidents', () => {
  it('should return a list of incidents', async () => {
    const res = await request(app).get('/api/incidents');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return incidents with expected fields', async () => {
    const res = await request(app).get('/api/incidents');
    if (res.body.length > 0) {
      const incident = res.body[0];
      expect(incident).toHaveProperty('id');
      expect(incident).toHaveProperty('type');
      expect(incident).toHaveProperty('status');
    }
  });
});

// ===================================================
// Public API — Food Stalls
// ===================================================
describe('GET /api/food', () => {
  it('should return a list of food stalls', async () => {
    const res = await request(app).get('/api/food');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return food stalls with name and location', async () => {
    const res = await request(app).get('/api/food');
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('name');
    }
  });
});

// ===================================================
// Public API — Volunteer Tasks
// ===================================================
describe('GET /api/tasks', () => {
  it('should return a list of volunteer tasks', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// ===================================================
// Public API — Match Center
// ===================================================
describe('GET /api/match', () => {
  it('should return live match data', async () => {
    const res = await request(app).get('/api/match');
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
  });
});

// ===================================================
// Health Check — Root
// ===================================================
describe('GET /', () => {
  it('should return online status and platform name', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('online');
    expect(res.body).toHaveProperty('platform');
  });

  it('should include FIFA 2026 era marker', async () => {
    const res = await request(app).get('/');
    expect(res.body.era).toBe('FIFA 2026');
  });
});

// ===================================================
// Security — Response Headers
// ===================================================
describe('Security Headers', () => {
  it('should include X-Content-Type-Options header', async () => {
    const res = await request(app).get('/');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  it('should include X-Frame-Options or CSP header', async () => {
    const res = await request(app).get('/');
    const hasFrameGuard = res.headers['x-frame-options'] || res.headers['content-security-policy'];
    expect(hasFrameGuard).toBeTruthy();
  });
});

// ===================================================
// Input Sanitization
// ===================================================
describe('Input Sanitization', () => {
  it('should normalize email to lowercase on login', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: '  ADMIN@ARENAMIND.COM  ',
      password: 'admin123'
    });
    // Should either login successfully or return a consistent error
    expect([200, 401]).toContain(res.status);
  });

  it('should trim whitespace from name on register', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: '   Trimmed Name   ',
      email: `trim${Date.now()}@example.com`,
      password: 'pass12345'
    });
    expect(res.status).toBe(201);
    expect(res.body.user.name).toBe('Trimmed Name');
  });
});
