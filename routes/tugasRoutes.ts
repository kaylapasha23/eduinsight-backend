import { Router } from 'express';
import tugasController from '../controllers/tugasController.js';
import pengumpulanTugasController from '../controllers/pengumpulanTugasController.js';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/authMiddleware.js';
import { validateBody, validateParams } from '../middleware/validateMiddleware.js';
import { CreateTugasSchema, UpdateTugasCategorySchema } from '../dtos/tugas.dto.js';
import { uploadTugas } from '../middleware/uploadMiddleware.js';
import { z } from 'zod';

const router = Router();

// GET /api/tugas - List semua tugas
router.get(
  '/',
  optionalAuthMiddleware,
  tugasController.getAllTugas,
);

// GET /api/tugas/:id/pengumpulan/me - Pengumpulan milik mahasiswa yang login
router.get(
  '/:id/pengumpulan/me',
  optionalAuthMiddleware,
  pengumpulanTugasController.getMyPengumpulan,
);

// GET /api/tugas/:id/pengumpulan - Detail pengumpulan & daftar mahasiswa
router.get(
  '/:id/pengumpulan',
  optionalAuthMiddleware,
  pengumpulanTugasController.getPengumpulanByTugasId,
);

// POST /api/tugas/:id/pengumpulan - Mahasiswa submit tugas (file & repo)
router.post(
  '/:id/pengumpulan',
  optionalAuthMiddleware,
  uploadTugas.single('file'),
  pengumpulanTugasController.submitPengumpulan,
);

// DELETE /api/tugas/:id/pengumpulan - Mahasiswa batalkan pengumpulan
router.delete(
  '/:id/pengumpulan',
  optionalAuthMiddleware,
  pengumpulanTugasController.deleteMyPengumpulan,
);

// GET /api/tugas/:id - Detail tugas
router.get(
  '/:id',
  optionalAuthMiddleware,
  validateParams(z.object({ id: z.string() })),
  tugasController.getTugasById,
);

// POST /api/tugas - Dosen tambah tugas baru
router.post(
  '/',
  authMiddleware,
  uploadTugas.single('lampiran'),
  validateBody(CreateTugasSchema),
  tugasController.createTugas,
);

// PATCH / PUT /api/tugas/:id - Update tugas
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

// DELETE /api/tugas/:id - Dosen hapus tugas
router.delete(
  '/:id',
  authMiddleware,
  tugasController.deleteTugas,
);

export default router;
