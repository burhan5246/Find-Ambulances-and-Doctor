import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

/**
 * Validation middleware factory.
 * Validates the specified request property (body, query, params) against a Zod schema.
 * On failure, throws an ApiError with field-level validation details.
 */
export function validateRequest(
  schema: ZodSchema,
  source: 'body' | 'query' | 'params' = 'body'
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[source]);
      // Replace original data with parsed (coerced + trimmed) data
      req[source] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        next(ApiError.badRequest('Validation failed', details));
        return;
      }
      next(err);
    }
  };
}
