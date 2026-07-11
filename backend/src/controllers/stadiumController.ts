import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { IncidentModel } from '../models/Incident';
import { FoodModel } from '../models/Food';
import { TaskModel } from '../models/Task';
import { MatchModel } from '../models/Match';
import { askGemini, classifyEmergencyAI } from '../ai/gemini';

// ----------------------------------------------------
// Fallback in-memory data for instant sandbox testing
// ----------------------------------------------------
let mockIncidents: any[] = [
  {
    id: 'inc-1',
    reporterName: 'John Fan',
    type: 'medical',
    description: 'Heat exhaustion, fan is feeling dizzy and needs water and ice pack.',
    location: 'Section 104, Row G',
    status: 'assigned',
    severity: 'medium',
    assignedVolunteer: 'David Beckham',
    aiAnalysis: {
      suggestedResponse: 'Deliver hydration package and cooling towels.',
      responsePlan: ['Fetch ice packs from Section 104 kiosk.', 'Assign nearby volunteer.', 'Track response status.'],
      notifiedControlRoom: true,
      recommendedPath: ['Volunteer Base', 'Elevator E1', 'Section 104 Row G']
    },
    createdAt: new Date()
  }
];

let mockFoodStalls: any[] = [
  { id: 'f-1', name: 'Copa Grill', stall: 'Gate B East', price: 14.50, category: 'halal', queueTime: 4, occupancy: 35, walkingDistance: 2, available: true },
  { id: 'f-2', name: 'Green Field Bistro', stall: 'Gate D West', price: 12.00, category: 'vegetarian', queueTime: 2, occupancy: 15, walkingDistance: 4, available: true },
  { id: 'f-3', name: 'Lil Kicker Meals', stall: 'Section 210 Lobby', price: 9.00, category: 'kids', queueTime: 8, occupancy: 65, walkingDistance: 5, available: true },
  { id: 'f-4', name: 'Fit Athlete Salads', stall: 'Section 105 Outer Loop', price: 13.00, category: 'healthy', queueTime: 3, occupancy: 20, walkingDistance: 3, available: true },
  { id: 'f-5', name: 'Stadium Dogs & Brews', stall: 'Gate A North', price: 11.50, category: 'general', queueTime: 12, occupancy: 85, walkingDistance: 1, available: true }
];

let mockVolunteerTasks: any[] = [
  { id: 't-1', title: 'Assist Fan Wheelchair', description: 'Assist elderly fan entering Gate B with wheelchair escort to Section 104.', location: 'Gate B Entryway', assignedTo: 'David Beckham', status: 'assigned', urgency: 'medium' },
  { id: 't-2', title: 'Language Translation', description: 'Translate French announcement for group of French fans near Ticketing Gate 3.', location: 'Ticketing Gate 3', assignedTo: '', status: 'pending', urgency: 'low' },
  { id: 't-3', title: 'Section Check', description: 'Monitor occupancy density in lower stands of Section 120.', location: 'Section 120 Lower', assignedTo: '', status: 'pending', urgency: 'low' }
];

let mockLiveMatch: any = {
  homeTeam: 'USA',
  awayTeam: 'Mexico',
  homeScore: 1,
  awayScore: 1,
  status: 'live',
  minute: 54,
  possession: { home: 55, away: 45 },
  expectedGoals: { home: 1.45, away: 1.12 },
  momentum: [0, 10, -5, 20, -15, 30, 45, 10, -25, 15, 40, -10, 20, 25, 30, 15],
  timeline: [
    { time: 12, type: 'goal', detail: 'GOAL! USA scores. Pulisic with a beautiful volley!' },
    { time: 34, type: 'card', detail: 'Yellow card shown to McKennie (USA).' },
    { time: 42, type: 'goal', detail: 'GOAL! Mexico scores. Jimenez equalizes with a header!' }
  ],
  aiCommentary: [
    '[Minute 12] AI Analysis: USA exploit spaces in the wide channel. Pulisic has 0.65 xG on that volley.',
    '[Minute 34] AI Analysis: Match intensity is high, average player heart rate is 164 bpm.',
    '[Minute 42] AI Analysis: Mexico shifts to cross-heavy play. High conversion chance on set piece.'
  ],
  predictions: { homeWin: 45, awayWin: 30, draw: 25 },
  heatmaps: {
    home: [{ x: 30, y: 40, intensity: 8 }, { x: 35, y: 45, intensity: 10 }, { x: 70, y: 50, intensity: 6 }],
    away: [{ x: 50, y: 30, intensity: 7 }, { x: 60, y: 35, intensity: 9 }, { x: 40, y: 60, intensity: 5 }]
  }
};

// ----------------------------------------------------
// Emergency Incident Operations
// ----------------------------------------------------
export const getIncidents = async (req: Request, res: Response) => {
  try {
    if (process.env.MONGODB_URI && mongoose.connection.readyState === 1) {
      const dbIncidents = await IncidentModel.find().sort({ createdAt: -1 });
      return res.json(dbIncidents);
    }
    return res.json(mockIncidents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve incidents' });
  }
};

export const createIncident = async (req: Request, res: Response): Promise<any> => {
  const { reporterName, type, description, location } = req.body;
  if (!reporterName || !type || !description || !location) {
    return res.status(400).json({ error: 'Please provide all details' });
  }

  try {
    // Call Gemini to classify the incident and output structured directions
    const aiAnalysis = await classifyEmergencyAI(description, location);

    if (process.env.MONGODB_URI && mongoose.connection.readyState === 1) {
      const incident = await IncidentModel.create({
        reporterName,
        type,
        description,
        location,
        severity: aiAnalysis.severity,
        aiAnalysis: {
          suggestedResponse: aiAnalysis.suggestedResponse,
          responsePlan: aiAnalysis.responsePlan,
          notifiedControlRoom: true,
          recommendedPath: aiAnalysis.recommendedPath,
        },
      });
      return res.status(201).json(incident);
    }

    const newIncident = {
      id: `inc-${mockIncidents.length + 1}`,
      reporterName,
      type,
      description,
      location,
      status: 'reported',
      severity: aiAnalysis.severity,
      assignedVolunteer: '',
      aiAnalysis,
      createdAt: new Date(),
    };
    mockIncidents.push(newIncident);
    return res.status(201).json(newIncident);
  } catch (error) {
    console.error('Incident creation error:', error);
    res.status(500).json({ error: 'Server error reporting incident' });
  }
};

export const updateIncident = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { status, assignedVolunteer } = req.body;

  try {
    if (process.env.MONGODB_URI && mongoose.connection.readyState === 1) {
      const incident = await IncidentModel.findByIdAndUpdate(
        id,
        { status, assignedVolunteer },
        { new: true }
      );
      if (!incident) return res.status(404).json({ error: 'Incident not found' });
      return res.json(incident);
    }

    const incidentIdx = mockIncidents.findIndex(i => i.id === id);
    if (incidentIdx === -1) return res.status(404).json({ error: 'Incident not found' });

    mockIncidents[incidentIdx] = {
      ...mockIncidents[incidentIdx],
      status: status !== undefined ? status : mockIncidents[incidentIdx].status,
      assignedVolunteer: assignedVolunteer !== undefined ? assignedVolunteer : mockIncidents[incidentIdx].assignedVolunteer,
    };
    return res.json(mockIncidents[incidentIdx]);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating incident' });
  }
};

// ----------------------------------------------------
// Food Stalls Operations
// ----------------------------------------------------
export const getFoodStalls = async (req: Request, res: Response) => {
  try {
    if (process.env.MONGODB_URI && mongoose.connection.readyState === 1) {
      const stalls = await FoodModel.find();
      if (stalls.length === 0) {
        // Seed food stalls if empty in database
        await FoodModel.insertMany(mockFoodStalls.map(({ id, ...item }) => item));
        const seeded = await FoodModel.find();
        return res.json(seeded);
      }
      return res.json(stalls);
    }
    return res.json(mockFoodStalls);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve food stalls' });
  }
};

// ----------------------------------------------------
// Tasks Operations
// ----------------------------------------------------
export const getVolunteerTasks = async (req: Request, res: Response) => {
  try {
    if (process.env.MONGODB_URI && mongoose.connection.readyState === 1) {
      const tasks = await TaskModel.find();
      if (tasks.length === 0) {
        await TaskModel.insertMany(mockVolunteerTasks.map(({ id, ...item }) => item));
        const seeded = await TaskModel.find();
        return res.json(seeded);
      }
      return res.json(tasks);
    }
    return res.json(mockVolunteerTasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve volunteer tasks' });
  }
};

export const claimVolunteerTask = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { volunteerName } = req.body;

  try {
    if (process.env.MONGODB_URI && mongoose.connection.readyState === 1) {
      const task = await TaskModel.findByIdAndUpdate(
        id,
        { assignedTo: volunteerName, status: 'assigned' },
        { new: true }
      );
      if (!task) return res.status(404).json({ error: 'Task not found' });
      return res.json(task);
    }

    const taskIdx = mockVolunteerTasks.findIndex(t => t.id === id);
    if (taskIdx === -1) return res.status(404).json({ error: 'Task not found' });

    mockVolunteerTasks[taskIdx].assignedTo = volunteerName;
    mockVolunteerTasks[taskIdx].status = 'assigned';
    return res.json(mockVolunteerTasks[taskIdx]);
  } catch (error) {
    res.status(500).json({ error: 'Server error claiming task' });
  }
};

export const completeVolunteerTask = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    if (process.env.MONGODB_URI && mongoose.connection.readyState === 1) {
      const task = await TaskModel.findByIdAndUpdate(
        id,
        { status: 'completed' },
        { new: true }
      );
      if (!task) return res.status(404).json({ error: 'Task not found' });
      return res.json(task);
    }

    const taskIdx = mockVolunteerTasks.findIndex(t => t.id === id);
    if (taskIdx === -1) return res.status(404).json({ error: 'Task not found' });

    mockVolunteerTasks[taskIdx].status = 'completed';
    return res.json(mockVolunteerTasks[taskIdx]);
  } catch (error) {
    res.status(500).json({ error: 'Server error completing task' });
  }
};

// ----------------------------------------------------
// Match Center Operations
// ----------------------------------------------------
export const getLiveMatchCenter = async (req: Request, res: Response) => {
  try {
    if (process.env.MONGODB_URI && mongoose.connection.readyState === 1) {
      const match = await MatchModel.findOne();
      if (!match) {
        await MatchModel.create(mockLiveMatch);
        const seeded = await MatchModel.findOne();
        return res.json(seeded);
      }
      return res.json(match);
    }
    return res.json(mockLiveMatch);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve match information' });
  }
};

// ----------------------------------------------------
// AI Copilot Integration
// ----------------------------------------------------
export const handleAICopilot = async (req: Request, res: Response) => {
  const { prompt, history } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt text' });
  }

  try {
    const aiResponse = await askGemini(prompt, history || []);
    res.json({ response: aiResponse });
  } catch (error) {
    console.error('AI Controller error:', error);
    res.status(500).json({ error: 'Central AI Engine error' });
  }
};
