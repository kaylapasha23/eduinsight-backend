import { Router } from 'express';
import penilaianController from '../controllers/penilaianController.js';
import { validateBody } from '../middleware/validateMiddleware.js';
import { CreatePenilaianSchema } from '../dtos/penilaian.dto.js';
import { optionalAuthMiddleware, authMiddleware } from '../middleware/authMiddleware.js'; // Sesuaikan path jika berbeda

const router = Router();

router.get('/', optionalAuthMiddleware, penilaianController.getAllPenilaian);
router.post(
  '/',
  authMiddleware,
  validateBody(CreatePenilaianSchema),
  penilaianController.createPenilaian,
);
router.delete('/:id', authMiddleware, penilaianController.deletePenilaian);

export default router;