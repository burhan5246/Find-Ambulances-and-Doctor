import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { errorResponse } from '../utils/ApiResponse';
import { env } from '../config/env';

/**
 * Global error handler middleware.
 * Catches all errors thrown in route handlers and formats them consistently.
 * Must be registered as the LAST middleware in Express.
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log error with request context in development
  if (env.NODE_ENV === 'development') {
    console.error(`[Error] ${req.method} ${req.path}`, err.message);
    if (!(err instanceof ApiError)) {
      console.error(err.stack);
    }
  }

  if (err instanceof ApiError) {
    errorResponse(res, err.statusCode, err.message, err.code, err.details);
    return;
  }

  // Unexpected errors — don't leak internal details
  errorResponse(res, 500, 'Internal server error', 'INTERNAL_ERROR');
}
