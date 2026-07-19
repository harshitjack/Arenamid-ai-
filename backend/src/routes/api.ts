import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, demoLogin, getProfile } from '../controllers/authController';
import {
  getIncidents,
  createIncident,
  updateIncident,
  getFoodStalls,
  getVolunteerTasks,
  claimVolunteerTask,
  completeVolunteerTask,
  getLiveMatchCenter,
  handleAICopilot,
} from '../controllers/stadiumController';
import { authenticateToken } from '../middleware/auth';
import { sanitizeInputs } from '../middleware/sanitize';

const router = Router();

// ----------------------------------------------------
// Strict rate limiter for authentication endpoints
// Prevents brute-force attacks on login/register
// ----------------------------------------------------
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                   // max 20 auth requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please wait 15 minutes and try again.' },
  skipSuccessfulRequests: false,
  skip: () => process.env.NODE_ENV === 'test',
});

// More lenient limiter for demo login (public, read-only in effect)
const demoRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
  message: { error: 'Too many demo login attempts. Please wait a moment.' },
  skip: () => process.env.NODE_ENV === 'test',
});

// Apply sanitization globally to all routes in this router
router.use(sanitizeInputs);

// ----------------------------------------------------
// Auth Routes
// ----------------------------------------------------
router.post('/auth/register', authRateLimiter, register);
router.post('/auth/login', authRateLimiter, login);
router.post('/auth/demo-login', demoRateLimiter, demoLogin); // ← secure demo login, no passwords from client
router.get('/auth/profile', authenticateToken as any, getProfile as any);

// ----------------------------------------------------
// Incident Routes (Alert reporting & tracking)
// ----------------------------------------------------
router.get('/incidents', getIncidents);
router.post('/incidents', createIncident as any);
router.put('/incidents/:id', updateIncident as any);

// ----------------------------------------------------
// Food Routes
// ----------------------------------------------------
router.get('/food', getFoodStalls);

// ----------------------------------------------------
// Volunteer Tasks Routes
// ----------------------------------------------------
router.get('/tasks', getVolunteerTasks);
router.put('/tasks/:id/claim', claimVolunteerTask as any);
router.put('/tasks/:id/complete', completeVolunteerTask as any);

// ----------------------------------------------------
// Match Telemetry
// ----------------------------------------------------
router.get('/match', getLiveMatchCenter);

// ----------------------------------------------------
// AI Copilot
// ----------------------------------------------------
router.post('/ai/copilot', handleAICopilot as any);

export default router;
