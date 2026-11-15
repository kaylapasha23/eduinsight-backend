import { Router } from 'express';
import tugasController from '../controllers/tugasController.js';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/authMiddleware.js';
const router = Router();

router.get('/', optionalAuthMiddleware, tugasController.getAllTugas);
router.get('/:id', optionalAuthMiddleware, tugasController.getTugasById);
router.post('/', authMiddleware, tugasController.createTugas);
router.patch('/:id/category', authMiddleware, tugasController.updateTugasCategory);
router.delete('/:id', authMiddleware, tugasController.deleteTugas);

export default router;