import { Router } from 'express';
import pengumpulanTugasController from '../controllers/pengumpulanTugasController.js';
import { optionalAuthMiddleware, authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// PATCH /api/pengumpulan-tugas/:id/nilai
router.patch(
  '/:id/nilai',
  optionalAuthMiddleware,
  pengumpulanTugasController.updateNilaiPengumpulan,
);

// GET /api/pengumpulan-tugas/:id
router.get(
  '/:id',
  optionalAuthMiddleware,
  pengumpulanTugasController.getPengumpulanByTugasId,
);

export default router;
