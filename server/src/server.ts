import { app } from './app';
import { config } from './config';
import { connectDB } from './config/db';
import { logger } from './utils/logger';

// Global error handlers to prevent crashes
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', {
    promise: promise.toString(),
    reason: reason,
  });
  // Don't exit the process, just log the error
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack,
  });
  // Don't exit the process, just log the error
});

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    logger.info('📦 MongoDB connected successfully');

    // Start the server
    const server = app.listen(config.port, () => {
      logger.info(`🚀 Server running on http://localhost:${config.port}`);
      logger.info(`📊 Environment: ${config.nodeEnv}`);
      logger.info('📝 Ready to handle API requests...');
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
      logger.info('🛑 SIGINT received, shutting down gracefully');
      server.close(() => {
        logger.info('✅ Server closed');
        process.exit(0);
      });
    });

    process.on('SIGTERM', () => {
      logger.info('🛑 SIGTERM received, shutting down gracefully');
      server.close(() => {
        logger.info('✅ Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
