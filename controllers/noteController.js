const {
  getUserNotes,
  syncUserNotes,
  getNotes,
  saveNotes,
} = require('../data/database');

/**
 * GET /api/notes
 * Ambil semua catatan milik pengguna yang login (berdasarkan JWT token)
 */
function getNotesHandler(req, res) {
  try {
    const userId = req.user.id;
    const notes = getUserNotes(userId);

    return res.status(200).json({
      success: true,
      message: 'Catatan berhasil dimuat.',
      data: { notes },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil catatan.',
      error: error.message,
    });
  }
}

/**
 * POST /api/notes/sync
 * Sinkronisasi batch catatan offline-first dari Drift local DB
 * Menerima array catatan dari client, menyimpan data, dan mengembalikan status synced
 */
function syncNotesHandler(req, res) {
  try {
    const userId = req.user.id;
    const incomingNotes = req.body.notes;

    if (!Array.isArray(incomingNotes)) {
      return res.status(400).json({
        success: false,
        message: 'Format catatan tidak valid. Gunakan format array { notes: [...] }',
      });
    }

    const { syncedIds, notes } = syncUserNotes(userId, incomingNotes);

    return res.status(200).json({
      success: true,
      message: `Sinkronisasi berhasil. ${syncedIds.length} catatan tersinkronkan.`,
      data: {
        syncedIds,
        notes,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal menyinkronkan catatan.',
      error: error.message,
    });
  }
}

/**
 * POST /api/notes
 * Tambah catatan tunggal
 */
function createNoteHandler(req, res) {
  try {
    const userId = req.user.id;
    const { title, body } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Judul catatan tidak boleh kosong.',
      });
    }

    const allNotes = getNotes();
    const newNote = {
      id: allNotes.length > 0 ? Math.max(...allNotes.map((n) => n.id || 0)) + 1 : 1,
      userId,
      title: title.trim(),
      body: body || '',
      synced: true,
      updatedAt: Date.now(),
    };

    allNotes.push(newNote);
    saveNotes(allNotes);

    return res.status(201).json({
      success: true,
      message: 'Catatan berhasil dibuat.',
      data: { note: newNote },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal membuat catatan.',
      error: error.message,
    });
  }
}

module.exports = {
  getNotesHandler,
  syncNotesHandler,
  createNoteHandler,
};
