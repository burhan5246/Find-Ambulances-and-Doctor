import type { Service } from './service';

/** Standard API response envelope */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
  pagination?: PaginationMeta;
  totals?: ServiceTotals;
}

/** Pagination metadata */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/** Global type totals */
export interface ServiceTotals {
  all: number;
  ambulance: number;
  doctor: number;
}

/** List services response with data + pagination + totals */
export interface ListServicesResponse extends ApiResponse<Service[]> {
  pagination: PaginationMeta;
  totals: ServiceTotals;
}

/** Single service response */
export type ServiceResponse = ApiResponse<Service>;

/** Delete service response — 204 No Content, data is null */
export type DeleteServiceResponse = ApiResponse<null>;

/** Field-level validation error from API */
export interface FieldError {
  field: string;
  message: string;
}
