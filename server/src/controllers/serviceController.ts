import { Request, Response, NextFunction } from 'express';
import {
  listServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../services/serviceService';
import { successResponse, createdResponse } from '../utils/ApiResponse';
import { ListServicesParams, CreateServiceInput, UpdateServiceInput } from '../models/Service';

/**
 * Controller layer — handles HTTP request/response.
 * Delegates business logic to service functions.
 */

/** GET /api/services — List services with pagination */
export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Safe cast: validateRequest middleware replaces req.query with Zod-parsed output
    const params = req.query as unknown as ListServicesParams;
    const result = await listServices(params);

    successResponse(res, result.data, 200, {
      pagination: result.pagination,
      totals: result.totals,
    });
  } catch (err) {
    next(err);
  }
}

/** GET /api/services/:id — Get a single service */
export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // ID is already validated and coerced by Zod middleware
    const { id } = req.params as unknown as { id: number };
    const service = await getServiceById(id);
    successResponse(res, service);
  } catch (err) {
    next(err);
  }
}

/** POST /api/services — Create a new service */
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = req.body as CreateServiceInput;
    const service = await createService(input);
    createdResponse(res, service);
  } catch (err) {
    next(err);
  }
}

/** PUT /api/services/:id — Update a service */
export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // ID is already validated and coerced by Zod middleware
    const { id } = req.params as unknown as { id: number };
    const input = req.body as UpdateServiceInput;
    const service = await updateService(id, input);
    successResponse(res, service);
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/services/:id — Delete a service */
export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // ID is already validated and coerced by Zod middleware
    const { id } = req.params as unknown as { id: number };
    await deleteService(id);
    successResponse(res, null, 204);
  } catch (err) {
    next(err);
  }
}
