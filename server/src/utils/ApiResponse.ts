import { Response } from 'express';

/**
 * Standard API response functions.
 * Ensures all responses follow the same envelope format.
 * Uses plain functions (not a class) for functional consistency.
 */

export function successResponse<T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    totals?: {
      all: number;
      ambulance: number;
      doctor: number;
    };
  }
): Response {
  return res.status(statusCode).json({
    success: true,
    data,
    ...meta,
  });
}

export function createdResponse<T>(res: Response, data: T): Response {
  return successResponse(res, data, 201);
}

export function errorResponse(
  res: Response,
  statusCode: number,
  message: string,
  code: string,
  details?: Array<{ field: string; message: string }>
): Response {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  });
}
