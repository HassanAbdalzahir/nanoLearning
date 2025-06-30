import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Only log API errors
  if (req.url.startsWith('/api/')) {
    const errorMessage = `❌ ${req.method} ${req.url} - ${statusCode}: ${message}`;
    logger.error(errorMessage);
  }

  // Don't leak error details in production
  const errorResponse = {
    error: {
      message:
        statusCode === 500 && process.env['NODE_ENV'] === 'production'
          ? 'Internal Server Error'
          : message,
      statusCode,
    },
  };

  res.status(statusCode).json(errorResponse);
};

export const createError = (
  message: string,
  statusCode: number = 500
): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};
