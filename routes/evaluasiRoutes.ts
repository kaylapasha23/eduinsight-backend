import { Router } from 'express';
import evaluasiController from '../controllers/evaluasiController.js';
import { optionalAuthMiddleware, authMiddleware } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validateMiddleware.js';
import { z } from 'zod';

// Simple schema for saving evaluation data
const SaveEvaluasiSchema = z.object({
  dateText: z.string().optional(),
  lecturerName: z.string().optional(),
  messages: z.any().optional(),
  lecturerNote: z.string().nullable().optional(),
  kelasId: z.string().optional(),
  studentName: z.string().optional(),
  nilaiAkhir: z.coerce.number().optional(),
});

const router = Router();

router.get(
  '/',
  optionalAuthMiddleware,
  evaluasiController.getEvaluasi,
);
router.post(
  '/',
  authMiddleware,
  validateBody(SaveEvaluasiSchema),
  evaluasiController.saveEvaluasi,
);

export default router;
