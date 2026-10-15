import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import missionRoutes from './routes/missionRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Enable CORS
app.use(cors({
  origin: [
    ENV.CLIENT_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ],
  credentials: true
}));

// Body parser
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'PeerBridge Full-Stack API',
    uptime: process.uptime()
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
