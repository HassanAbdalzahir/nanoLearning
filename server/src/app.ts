import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { loggerMiddleware } from './middleware/logger';
import userRoutes from './routes/users';
import healthRoutes from './routes/health';
import authRoutes from './routes/auth';
import courseRoutes from './routes/courses';
import lessonRoutes from './routes/lessons';
import uploadRoutes from './routes/upload';
import enrollmentRoutes from './routes/enrollments';
import { logger } from './utils/logger';
const cookieParser = require('cookie-parser');

export const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cookieParser());

// Custom logging middleware (cleaner than morgan)
app.use(loggerMiddleware);

// API routes
app.use('/api/health', healthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/enrollments', enrollmentRoutes);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    message: 'nanoLearning API Server',
    version: '1.0.0',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler - must be after all other routes
app.use((_req, res) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      statusCode: 404,
    },
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

logger.info('🚀 Server started successfully');
