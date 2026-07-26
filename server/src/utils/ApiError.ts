/**
 * Custom error class for API errors.
 * Extends Error with HTTP status code and machine-readable error code.
 * Used by the global error handler to format consistent error responses.
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: Array<{ field: string; message: string }>;

  constructor(
    statusCode: number,
    message: string,
    code: string,
    details?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = 'ApiError';

    // Fix prototype chain for instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(
    message: string,
    details?: Array<{ field: string; message: string }>
  ): ApiError {
    return new ApiError(400, message, 'VALIDATION_ERROR', details);
  }

  static notFound(message: string): ApiError {
    return new ApiError(404, message, 'NOT_FOUND');
  }

  static internal(message = 'Internal server error'): ApiError {
    return new ApiError(500, message, 'INTERNAL_ERROR');
  }
}
