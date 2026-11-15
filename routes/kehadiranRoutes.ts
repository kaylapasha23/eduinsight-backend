import { Router } from 'express';
import kehadiranController from '../controllers/kehadiranController.js';
import { validateBody, validateQuery } from '../middleware/validateMiddleware.js';
import { CreateKehadiranSchema, KehadiranQuerySchema } from '../dtos/kehadiran.dto.js';
import { optionalAuthMiddleware, authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get(
  '/',
  optionalAuthMiddleware,
  validateQuery(KehadiranQuerySchema),
  kehadiranController.getKehadiran,
);
router.post(
  '/',
  authMiddleware,
  validateBody(CreateKehadiranSchema),
  kehadiranController.createKehadiran,
);
router.delete('/:id', authMiddleware, kehadiranController.deleteKehadiran);

export default router;