/** Service type discriminator */
export type ServiceType = 'ambulance' | 'doctor';

/** Database row shape (snake_case) */
export interface ServiceRow {
  id: number;
  title: string;
  description: string;
  location: string;
  type: ServiceType;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

/** API response shape (camelCase) */
export interface Service {
  id: number;
  title: string;
  description: string;
  location: string;
  type: ServiceType;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Input for creating a service */
export interface CreateServiceInput {
  title: string;
  description: string;
  location: string;
  type: ServiceType;
  imageUrl?: string;
}

/** Input for updating a service */
export interface UpdateServiceInput {
  title?: string;
  description?: string;
  location?: string;
  type?: ServiceType;
  imageUrl?: string | null;
}

/** Query parameters for listing services */
export interface ListServicesParams {
  page: number;
  limit: number;
  type?: ServiceType;
  search?: string;
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

/** Type totals */
export interface ServiceTotals {
  all: number;
  ambulance: number;
  doctor: number;
}

/** Transform a database row to an API-friendly shape */
export function toService(row: ServiceRow): Service {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    location: row.location,
    type: row.type,
    imageUrl: row.image_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
