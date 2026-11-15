import { Router } from 'express';
import kehadiranController from '../controllers/kehadiranController.js';
import { optionalAuthMiddleware, authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', optionalAuthMiddleware, kehadiranController.getKehadiran);
router.post('/', authMiddleware, kehadiranController.createKehadiran);
router.delete('/:id', authMiddleware, kehadiranController.deleteKehadiran);

export default router;