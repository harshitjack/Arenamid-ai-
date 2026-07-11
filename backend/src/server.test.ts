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
});
