import type { CreateServiceInput, UpdateServiceInput, ServiceType } from '../types/service';
import type { ListServicesResponse, ServiceResponse, DeleteServiceResponse, FieldError } from '../types/api';

const API_BASE = '/api';

/**
 * Custom error class for API errors.
 * Contains the error code and optional field-level validation details.
 */
export class ApiClientError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: FieldError[];

  constructor(statusCode: number, message: string, code: string, details?: FieldError[]) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = 'ApiClientError';
  }
}

/**
 * Generic fetch wrapper that handles the API response envelope.
 * Throws ApiClientError on non-2xx responses.
 * Only sets Content-Type when a body is present (GET/DELETE don't need it).
 */
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {};

  // Only set Content-Type when there's a body (POST, PUT)
  if (options?.body) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${url}`, {
    headers,
    ...options,
  });

  // Handle 204 No Content (DELETE responses)
  if (response.status === 204) {
    return { success: true, data: null } as T;
  }

  // Guard against non-JSON responses (e.g., 502 proxy errors)
  let json;
  try {
    json = await response.json();
  } catch {
    throw new ApiClientError(
      response.status,
      'Server returned an invalid response',
      'PARSE_ERROR'
    );
  }

  if (!response.ok || !json.success) {
    throw new ApiClientError(
      response.status,
      json.error?.message || 'An unexpected error occurred',
      json.error?.code || 'UNKNOWN_ERROR',
      json.error?.details
    );
  }

  return json;
}

/** API client for services — all HTTP calls centralized here */
export const servicesApi = {
  /** GET /api/services — List services with pagination, filter, search */
  async getServices(params: {
    page?: number;
    limit?: number;
    type?: ServiceType;
    search?: string;
  } = {}): Promise<ListServicesResponse> {
    const searchParams = new URLSearchParams();
    if (params.page != null) searchParams.set('page', String(params.page));
    if (params.limit != null) searchParams.set('limit', String(params.limit));
    if (params.type) searchParams.set('type', params.type);
    if (params.search) searchParams.set('search', params.search);

    const query = searchParams.toString();
    return request<ListServicesResponse>(`/services${query ? `?${query}` : ''}`);
  },

  /** POST /api/services — Create a new service */
  async createService(data: CreateServiceInput): Promise<ServiceResponse> {
    return request<ServiceResponse>('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /** PUT /api/services/:id — Update a service */
  async updateService(id: number, data: UpdateServiceInput): Promise<ServiceResponse> {
    return request<ServiceResponse>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /** DELETE /api/services/:id — Delete a service */
  async deleteService(id: number): Promise<DeleteServiceResponse> {
    return request<DeleteServiceResponse>(`/services/${id}`, {
      method: 'DELETE',
    });
  },
};
