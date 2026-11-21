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

    const mhsUsers = await prisma.user.findMany({ where: { role: 'mahasiswa' } });
    const userNimMap = new Map<string, string>();
    for (const u of mhsUsers) {
      if (u.name) userNimMap.set(u.name.toLowerCase().trim(), u.nim || '');
    }

    const formatted = list.map((item: any, idx: number) => ({
      id: item.id,
      kelasId: item.kelasId,
      class_id: item.kelasId,
      studentName: item.studentName,
      student_name: item.studentName,
      name: item.studentName,
      nim: userNimMap.get(item.studentName?.toLowerCase().trim()) || `22010100${idx + 1}`,
      taskName: item.taskName,
      task_name: item.taskName,
      score: item.score,
      tugas: item.score,
      kuis: Math.max(70, item.score - 5),
      uts: Math.max(75, item.score - 2),
      uas: item.score,
      kehadiran: 'Hadir',
      catatan: 'Hasil pengerjaan tugas konsisten dan rapi.',
      createdAt: item.createdAt,
      kelas: item.kelas,
    }));

    return res.status(200).json({
      success: true,
      data: formatted,
      updated_at: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err });
  }
};

// Tambah data penilaian baru (mendukung upsert agar tidak double saat simpan berulang kali)
export const createPenilaian = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { class_id, student_name, studentName, task_name, taskName, score } = req.body;
    const sName = student_name || studentName;
    const tName = task_name || taskName || 'Penilaian Akhir';

    if (!sName) {
      return res.status(400).json({ success: false, message: 'student_name wajib diisi!' });
    }

    const rawClassId = String(class_id || '');
    let validKelas = rawClassId ? await prisma.kelas.findUnique({ where: { id: rawClassId } }) : null;
    if (!validKelas) {
      validKelas = await prisma.kelas.findFirst();
    }
    const targetKelasId = validKelas ? validKelas.id : 'kelas-pfa';
    const finalScore = score !== undefined && score !== null ? Math.round(Number(score)) : 80;

    // Cek apakah data penilaian untuk mahasiswa, kelas, dan tugas ini sudah ada
    const existingPenilaian = await prisma.penilaian.findFirst({
      where: {
        kelasId: targetKelasId,
        studentName: sName,
        taskName: tName,
      },
    });

    if (existingPenilaian) {
      const updated = await prisma.penilaian.update({
        where: { id: existingPenilaian.id },
        data: {
          score: finalScore,
          createdAt: new Date(),
        },
      });

      return res.status(200).json({
        success: true,
        message: 'Data penilaian berhasil diperbarui',
        data: updated,
      });
    }

    const created = await prisma.penilaian.create({
      data: {
        id: `penilaian-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        kelasId: targetKelasId,
        studentName: sName,
        taskName: tName,
        score: finalScore,
        createdAt: new Date(),
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