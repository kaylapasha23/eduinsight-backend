import { Router } from 'express';
import evaluasiController from '../controllers/evaluasiController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, evaluasiController.getEvaluasi);
router.post('/', authMiddleware, evaluasiController.saveEvaluasi);

export default router;