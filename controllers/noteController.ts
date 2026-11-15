import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import {
  getUserNotes,
  createNote,
  prisma,
} from '../data/database.js';

/**
 * GET /api/notes
 * Ambil semua catatan milik pengguna yang login (berdasarkan JWT token)
 */
export async function getNotesHandler(req: AuthenticatedRequest, res: Response): Promise<Response> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User ID tidak ditemukan' });
    }

    const notes = await getUserNotes(userId);

    // Konversi BigInt updatedAt ke Number agar serializable ke JSON
    const serializedNotes = notes.map((n: any) => ({
      ...n,
      updatedAt: Number(n.updatedAt),
    }));

    return res.status(200).json({
      success: true,
      message: 'Catatan berhasil dimuat.',
      data: { notes: serializedNotes },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil catatan.',
      error: error?.message || error,
    });
  }
}

/**
 * POST /api/notes/sync
 * Sinkronisasi batch catatan offline-first dari Drift local DB
 */
export async function syncNotesHandler(req: AuthenticatedRequest, res: Response): Promise<Response> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User ID tidak ditemukan' });
    }

    const incomingNotes = req.body.notes;

    if (!Array.isArray(incomingNotes)) {
      return res.status(400).json({
        success: false,
        message: 'Format catatan tidak valid. Gunakan format array { notes: [...] }',
      });
    }

    const syncedIds: any[] = [];
    for (const note of incomingNotes) {
      const created = await prisma.note.create({
        data: {
          userId,
          title: note.title || 'Catatan Baru',
          body: note.body || '',
          synced: true,
          updatedAt: BigInt(note.updatedAt || Date.now()),
        },
      });
      syncedIds.push(created.id);
    }

    const allNotes = await getUserNotes(userId);
    const serializedNotes = allNotes.map((n: any) => ({
      ...n,
      updatedAt: Number(n.updatedAt),
    }));

    return res.status(200).json({
      success: true,
      message: `Sinkronisasi berhasil. ${syncedIds.length} catatan tersinkronkan.`,
      data: {
        syncedIds,
        notes: serializedNotes,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Gagal menyinkronkan catatan.',
      error: error?.message || error,
    });
  }
}

/**
 * POST /api/notes
 * Tambah catatan tunggal
 */
export async function createNoteHandler(req: AuthenticatedRequest, res: Response): Promise<Response> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User ID tidak ditemukan' });
    }

    const { title, body } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Judul catatan tidak boleh kosong.',
      });
    }

    const newNote: any = await createNote(userId, title.trim(), body || '');

    return res.status(201).json({
      success: true,
      message: 'Catatan berhasil dibuat.',
      data: {
        note: {
          ...newNote,
          updatedAt: Number(newNote.updatedAt),
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Gagal membuat catatan.',
      error: error?.message || error,
    });
  }
}

export default {
  getNotesHandler,
  syncNotesHandler,
  createNoteHandler,
};