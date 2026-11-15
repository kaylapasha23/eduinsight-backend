import { Request, Response } from 'express';
import { prisma } from '../data/database.js';

// Ambil semua data penilaian semester (mendukung format Web & Mobile)
export const getAllPenilaian = async (req: Request, res: Response): Promise<Response> => {
  try {
    const list = await prisma.penilaian.findMany({
      include: {
        kelas: {
          include: {
            mataKuliah: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      data: list,
      updated_at: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err });
  }
};

// Tambah data penilaian baru
export const createPenilaian = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { class_id, student_name, task_name, score } = req.body;

    if (!student_name || !task_name) {
      return res.status(400).json({ success: false, message: 'student_name dan task_name wajib diisi!' });
    }

    let targetKelasId = class_id;
    if (!targetKelasId) {
      const firstKelas = await prisma.kelas.findFirst();
      targetKelasId = firstKelas ? firstKelas.id : 'kelas-pfa';
    }

    const created = await prisma.penilaian.create({
      data: {
        id: `penilaian-${Date.now()}`,
        kelasId: targetKelasId,
        studentName: student_name,
        taskName: task_name,
        score: score ? parseInt(score, 10) : 0,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Data penilaian berhasil ditambahkan',
      data: created,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err });
  }
};

// Hapus data penilaian
export const deletePenilaian = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    await prisma.penilaian.delete({ where: { id: String(id) } });
    return res.status(200).json({ success: true, message: 'Data penilaian berhasil dihapus' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err });
  }
};

export default {
  getAllPenilaian,
  createPenilaian,
  deletePenilaian,
};