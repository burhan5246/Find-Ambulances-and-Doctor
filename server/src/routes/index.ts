import { Router, Request, Response } from 'express';
import serviceRoutes from './serviceRoutes';

const router = Router();

/** Health check endpoint — costs nothing, useful for deployment checks */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

/** Mount service routes */
router.use('/services', serviceRoutes);

export default router;
