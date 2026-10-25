const express = require('express');
const router = express.Router();

const {
  getNotesHandler,
  syncNotesHandler,
  createNoteHandler,
} = require('../controllers/noteController');

const { authMiddleware } = require('../middleware/authMiddleware');

// Semua rute catatan dilindungi dengan JWT authMiddleware
router.use(authMiddleware);

// GET /api/notes — Ambil catatan milik user
router.get('/', getNotesHandler);

// POST /api/notes — Buat catatan baru
router.post('/', createNoteHandler);

// POST /api/notes/sync — Sinkronisasi batch catatan offline-first (synced & updated_at)
router.post('/sync', syncNotesHandler);

module.exports = router;
