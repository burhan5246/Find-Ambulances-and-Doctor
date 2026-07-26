/** Service type discriminator */
export type ServiceType = 'ambulance' | 'doctor';

/** Service entity as returned from the API */
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

/** Input for creating a new service */
export interface CreateServiceInput {
  title: string;
  description: string;
  location: string;
  type: ServiceType;
  imageUrl?: string;
}

/** Input for updating an existing service */
export interface UpdateServiceInput {
  title?: string;
  description?: string;
  location?: string;
  type?: ServiceType;
  imageUrl?: string | null;
}
