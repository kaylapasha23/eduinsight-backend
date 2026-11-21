import { Router } from 'express';
import tugasController from '../controllers/tugasController.js';
import pengumpulanTugasController from '../controllers/pengumpulanTugasController.js';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/authMiddleware.js';
import { validateBody, validateParams } from '../middleware/validateMiddleware.js';
import { CreateTugasSchema, UpdateTugasCategorySchema } from '../dtos/tugas.dto.js';
import { uploadTugas } from '../middleware/uploadMiddleware.js';
import { z } from 'zod';

const router = Router();

router.get(
  '/',
  optionalAuthMiddleware,
  tugasController.getAllTugas,
);
router.get(
  '/:id/pengumpulan',
  optionalAuthMiddleware,
  pengumpulanTugasController.getPengumpulanByTugasId,
);
router.get(
  '/:id',
  optionalAuthMiddleware,
  validateParams(z.object({ id: z.string() })),
  tugasController.getTugasById,
);
router.post(
  '/',
  authMiddleware,
  uploadTugas.single('lampiran'),
  validateBody(CreateTugasSchema),
  tugasController.createTugas,
);
router.patch(
  '/:id/category',
  authMiddleware,
  validateParams(z.object({ id: z.string() })),
  validateBody(UpdateTugasCategorySchema),
  tugasController.updateTugasCategory,
);
router.put(
  '/:id',
  authMiddleware,
  validateParams(z.object({ id: z.string() })),
  validateBody(UpdateTugasCategorySchema),
  tugasController.updateTugasCategory,
);
router.patch(
  '/:id',
  authMiddleware,
  validateParams(z.object({ id: z.string() })),
  validateBody(UpdateTugasCategorySchema),
  tugasController.updateTugasCategory,
);
router.delete(
  '/:id',
  authMiddleware,
  tugasController.deleteTugas,
);

export default router;