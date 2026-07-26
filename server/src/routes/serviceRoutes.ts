import { Router } from 'express';
import { list, getById, create, update, remove } from '../controllers/serviceController';
import { validateRequest } from '../middleware/validateRequest';
import {
  createServiceSchema,
  updateServiceSchema,
  listServicesQuerySchema,
  idParamSchema,
} from '../validation/serviceValidation';

const router = Router();

/**
 * Service routes — 5 endpoints for full CRUD + individual fetch.
 * Validation middleware runs before the controller.
 */
router.get('/', validateRequest(listServicesQuerySchema, 'query'), list);
router.get('/:id', validateRequest(idParamSchema, 'params'), getById);
router.post('/', validateRequest(createServiceSchema, 'body'), create);
router.put('/:id', validateRequest(idParamSchema, 'params'), validateRequest(updateServiceSchema, 'body'), update);
router.delete('/:id', validateRequest(idParamSchema, 'params'), remove);

export default router;
