import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController';
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

const router = Router();

// Auth Routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/profile', authenticateToken as any, getProfile as any);

// Incident Routes (Alert reporting & tracking)
router.get('/incidents', getIncidents);
router.post('/incidents', createIncident as any);
router.put('/incidents/:id', updateIncident as any);

// Food routes
router.get('/food', getFoodStalls);

// Volunteer tasks routes
router.get('/tasks', getVolunteerTasks);
router.put('/tasks/:id/claim', claimVolunteerTask as any);
router.put('/tasks/:id/complete', completeVolunteerTask as any);

// Match telemetry
router.get('/match', getLiveMatchCenter);

// AI Copilot central chat route
router.post('/ai/copilot', handleAICopilot as any);

export default router;
