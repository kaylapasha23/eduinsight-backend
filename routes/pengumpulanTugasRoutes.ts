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

// GET /api/pengumpulan-tugas/:id/file - Preview / Download berkas tugas langsung tanpa hambatan CDN
router.get(
  '/:id/file',
  pengumpulanTugasController.serveSubmissionFile,
);

// GET /api/pengumpulan-tugas/:id/preview - Isi berkas dalam JSON base64 (kebal intercept IDM)
router.get(
  '/:id/preview',
  pengumpulanTugasController.previewSubmissionFile,
);

// GET /api/pengumpulan-tugas/:id
router.get(
  '/:id',
  optionalAuthMiddleware,
  pengumpulanTugasController.getPengumpulanByTugasId,
);

export default router;
