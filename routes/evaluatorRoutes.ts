import { Router } from 'express';
import evaluatorController from '../controllers/evaluatorController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validateMiddleware.js';
import { AnalyzeRequestSchema } from '../dtos/evaluator.dto.js';

const router = Router();

/**
 * POST /api/evaluator/analyze
 *
 * Trigger evaluasi AI untuk satu mahasiswa di satu kelas.
 * Hanya bisa diakses oleh dosen yang sudah login.
 *
 * Body:
 *   {
 *     "student_id"   : "user-mhs-brooke",   // id user ATAU NIM
 *     "class_id"     : "kelas-ai",
 *     "lecturer_note": "Mohon tingkatkan kehadiran" // opsional
 *   }
 */
router.post(
  '/analyze',
  authMiddleware,
  validateBody(AnalyzeRequestSchema),
  evaluatorController.analyzeStudent,
);

export default router;
