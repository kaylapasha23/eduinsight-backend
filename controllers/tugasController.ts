import { Request, Response } from 'express';
import { prisma } from '../data/database.js';

// Mengambil semua data tugas
export const getAllTugas = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { category } = req.query;
    const where = category ? { category: String(category) } : {};

    const tugasList = await prisma.tugas.findMany({
      where,
      include: {
        kelas: {
          include: {
            mataKuliah: true,
            dosen: true,
          },
        },
      },
      orderBy: { deadline: 'asc' },
    });

    const formatted = tugasList.map((t: any) => ({
      id: t.id,
      class_id: t.kelasId,
      class_name: t.kelas?.mataKuliah?.nama || 'Mata Kuliah',
      subject: t.kelas?.mataKuliah?.nama || 'Mata Kuliah',
      nama_kelas: t.kelas?.mataKuliah?.nama || 'Mata Kuliah',
      class_code: t.kelas?.kodeGabung || '',
      dosen_name: t.kelas?.dosen?.name || 'Dosen Pengampu',
      title: t.judul,
      description: t.deskripsi,
      deadline: t.deadline ? t.deadline.toISOString().split('T')[0] : (t.deadlineText || 'Hari ini'),
      dueDate: t.deadline ? t.deadline.toISOString().split('T')[0] : (t.deadlineText || 'Hari ini'),
      deadline_text: t.deadlineText || 'Hari ini, 23.59',
      category: t.category,
      status: t.category === 'selesai' ? 'Selesai' : 'Berjalan',
      submittedCount: 25,
      submitted_count: 25,
      totalStudents: 30,
      total_students: 30,
      attachment_name: t.lampiran,
      created_at: t.createdAt,
    }));

    return res.status(200).json(formatted);
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err });
  }
};

// Mengambil detail tugas berdasarkan ID
export const getTugasById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const t = await prisma.tugas.findUnique({
      where: { id: String(id) },
      include: {
        kelas: {
          include: {
            mataKuliah: true,
            dosen: true,
          },
        },
      },
    });

    if (!t) {
      return res.status(404).json({ success: false, message: 'Tugas tidak ditemukan' });
    }

    const formatted = {
      id: t.id,
      class_id: t.kelasId,
      class_name: t.kelas?.mataKuliah?.nama || 'Mata Kuliah',
      subject: t.kelas?.mataKuliah?.nama || 'Mata Kuliah',
      nama_kelas: t.kelas?.mataKuliah?.nama || 'Mata Kuliah',
      class_code: t.kelas?.kodeGabung || '',
      dosen_name: t.kelas?.dosen?.name || 'Dosen Pengampu',
      title: t.judul,
      description: t.deskripsi,
      deadline: t.deadline ? t.deadline.toISOString().split('T')[0] : (t.deadlineText || 'Hari ini'),
      dueDate: t.deadline ? t.deadline.toISOString().split('T')[0] : (t.deadlineText || 'Hari ini'),
      deadline_text: t.deadlineText || 'Hari ini, 23.59',
      category: t.category,
      status: t.category === 'selesai' ? 'Selesai' : 'Berjalan',
      submittedCount: 25,
      submitted_count: 25,
      totalStudents: 30,
      total_students: 30,
      attachment_name: t.lampiran,
      created_at: t.createdAt,
    };

    return res.status(200).json(formatted);
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err });
  }
};

// Menambah tugas baru
export const createTugas = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { class_id, title, description, deadline, deadline_text, category, attachment_name } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title wajib diisi!' });
    }

    const rawClassId = String(class_id || '');
    let validKelas = rawClassId ? await prisma.kelas.findUnique({ where: { id: rawClassId } }) : null;
    if (!validKelas) {
      validKelas = await prisma.kelas.findFirst();
    }
    const targetKelasId = validKelas ? validKelas.id : 'kelas-ai';

    const newTugas = await prisma.tugas.create({
      data: {
        id: `tugas-${Date.now()}`,
        kelasId: targetKelasId,
        judul: title,
        deskripsi: description || '',
        deadline: deadline ? new Date(deadline) : new Date(Date.now() + 24 * 60 * 60 * 1000),
        deadlineText: deadline_text || 'Hari ini, 23.59',
        category: category || 'segera',
        lampiran: attachment_name || null,
      },
    });

    return res.status(201).json({ success: true, message: 'Tugas berhasil ditambahkan', id: newTugas.id });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err });
  }
};

// Mengubah kategori status tugas
export const updateTugasCategory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({ success: false, message: 'Field category wajib diisi!' });
    }

    await prisma.tugas.update({
      where: { id: String(id) },
      data: { category },
    });

    return res.status(200).json({ success: true, message: 'Status tugas berhasil diperbarui' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err });
  }
};

// Menghapus tugas
export const deleteTugas = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    await prisma.tugas.delete({ where: { id: String(id) } });
    return res.status(200).json({ success: true, message: `Tugas dengan ID ${id} berhasil dihapus` });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err });
  }
};

export default {
  getAllTugas,
  getTugasById,
  createTugas,
  updateTugasCategory,
  deleteTugas,
};