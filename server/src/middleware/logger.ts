import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const method = req.method;
    const url = req.url;
    const statusCode = res.statusCode;

    // Only log API requests (skip static files, etc.)
    if (url.startsWith('/api/')) {
      const statusColor =
        statusCode >= 400 ? '❌' : statusCode >= 300 ? '⚠️' : '✅';
      const methodColor =
        method === 'GET'
          ? '🔵'
          : method === 'POST'
            ? '🟢'
            : method === 'PUT'
              ? '🟡'
              : method === 'DELETE'
                ? '🔴'
                : '⚪';

      const logMessage = `${statusColor} ${methodColor} ${method} ${url} - ${statusCode} (${duration}ms)`;

      if (statusCode >= 400) {
        logger.error(logMessage);
      } else {
        logger.info(logMessage);
      }
    }
  });

  next();
};
