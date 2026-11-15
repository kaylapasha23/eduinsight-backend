import { Router } from 'express';
import {
  getNotesHandler,
  syncNotesHandler,
  createNoteHandler,
} from '../controllers/noteController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Semua rute catatan dilindungi dengan JWT authMiddleware
router.use(authMiddleware);

// GET /api/notes — Ambil catatan milik user
router.get('/', getNotesHandler);

// POST /api/notes — Buat catatan baru
router.post('/', createNoteHandler);

// POST /api/notes/sync — Sinkronisasi batch catatan offline-first (synced & updated_at)
router.post('/sync', syncNotesHandler);

export default router;