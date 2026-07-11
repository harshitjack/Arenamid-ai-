import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import apiRouter from './routes/api';
import { connectDB } from './config/db';
import { initSockets } from './sockets/gateway';
import { logAIStatus } from './ai/gemini';

// Load environmental parameters
dotenv.config();
logAIStatus(); // Log AI engine status now that env is loaded

// Gracefully handle unhandled exceptions & promise rejections (e.g., ECONNRESET, ECONNABORTED socket terminations)
process.on('uncaughtException', (err) => {
  console.error('🔥 Server Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 Server Unhandled Rejection at:', promise, 'reason:', reason);
});

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Turn off for custom frontend resource loading convenience
}));
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Rate limiting to prevent API spamming
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api/', apiLimiter);

// Bind API routing
app.use('/api', apiRouter);

// Basic connection test route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    platform: 'ArenaMind AI Operations Engine',
    version: '1.0.0',
    era: 'FIFA 2026'
  });
});

// Global error handler middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('🔥 Server Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Boot servers
const boot = async () => {
  await connectDB();

  // Socket IO gateway
  initSockets(server);

  server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🏟️  ARENAMIND CORE ENGINE RUNNING ON PORT ${PORT}`);
    console.log(`🛰️  API ENDPOINT: http://localhost:${PORT}/api`);
    console.log(`🔌 SOCKET NODE IS OPEN`);
    console.log(`======================================================\n`);
  });
};

boot();
