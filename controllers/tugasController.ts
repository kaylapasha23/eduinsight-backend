import { Request, Response } from 'express';
import { prisma } from '../data/database.js';
import { validateJudulTugas } from '../dtos/tugas.dto.js';

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

    const penilaianList = await prisma.penilaian.findMany();
    // Hitung jumlah pengumpulan mahasiswa secara dinamis dari tabel pengumpulan_tugas
    const pengumpulanList = await prisma.pengumpulanTugas.findMany();
    const totalMahasiswa = await prisma.user.count({ where: { role: 'mahasiswa' } });

    const formatted = tugasList.map((t: any) => {
      // Periksa apakah tugas ini sudah dinilai oleh dosen untuk mahasiswa
      const matchingPenilaian = penilaianList.find((p: any) => 
        (p.kelasId === t.kelasId || !p.kelasId) &&
        (p.taskName?.toLowerCase().trim() === t.judul?.toLowerCase().trim() ||
         t.judul?.toLowerCase().trim().includes(p.taskName?.toLowerCase().trim()) ||
         p.taskName?.toLowerCase().trim().includes(t.judul?.toLowerCase().trim()))
      );

      const isGraded = Boolean(matchingPenilaian);
      const score = matchingPenilaian ? matchingPenilaian.score : null;

      // Hitung pengumpulan aktual dari database
      const realSubmittedCount = pengumpulanList.filter(
        (p: any) => p.taskId === t.id && (p.status === 'Diserahkan' || !p.status)
      ).length;

      return {
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
        is_graded: isGraded,
        isGraded: isGraded,
        score: score,
        nilai: score,
        submittedCount: realSubmittedCount,
        submitted_count: realSubmittedCount,
        totalStudents: totalMahasiswa || 30,
        total_students: totalMahasiswa || 30,
        attachment_name: t.lampiranNama || t.lampiran,
        lampiran_nama: t.lampiranNama || t.lampiran,
        lampiran_url: t.lampiranUrl,
        lampiranNama: t.lampiranNama || t.lampiran,
        lampiranUrl: t.lampiranUrl,
        created_at: t.createdAt,
      };
    });

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

    const matchingPenilaian = await prisma.penilaian.findFirst({
      where: {
        taskName: {
          contains: t.judul,
        },
      },
    });

    const isGraded = Boolean(matchingPenilaian);
    const score = matchingPenilaian ? matchingPenilaian.score : null;

      const realSubmittedCount = await prisma.pengumpulanTugas.count({
        where: {
          taskId: t.id,
          status: 'Diserahkan',
        },
      });
      const totalMahasiswa = await prisma.user.count({ where: { role: 'mahasiswa' } });

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
        is_graded: isGraded,
        isGraded: isGraded,
        score: score,
        nilai: score,
        submittedCount: realSubmittedCount,
        submitted_count: realSubmittedCount,
        totalStudents: totalMahasiswa || 30,
        total_students: totalMahasiswa || 30,
        attachment_name: t.lampiranNama || t.lampiran,
        lampiran_nama: t.lampiranNama || t.lampiran,
        lampiran_url: t.lampiranUrl,
        lampiranNama: t.lampiranNama || t.lampiran,
        lampiranUrl: t.lampiranUrl,
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
      const { class_id, kelasId, title, judul, description, deskripsi, deadline, deadline_text, category, attachment_name } = req.body;
      const taskTitle = (title || judul || '').trim();

      const validation = validateJudulTugas(taskTitle);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: validation.message || 'Judul tugas tidak valid.',
        });
      }

      const rawClassId = String(class_id || kelasId || '');
      let validKelas = rawClassId ? await prisma.kelas.findUnique({ where: { id: rawClassId } }) : null;
      if (!validKelas) {
        validKelas = await prisma.kelas.findFirst();
      }
      const targetKelasId = validKelas ? validKelas.id : 'kelas-ai';

      // Handle file lampiran dari Multer
      const file = req.file;
      let finalLampiranNama = attachment_name || null;
      let finalLampiranUrl: string | null = null;

      if (file) {
        finalLampiranNama = file.originalname;
        finalLampiranUrl = `/uploads/tugas/${file.filename}`;
      } else if (req.body.lampiranUrl || req.body.lampiranNama) {
        finalLampiranUrl = req.body.lampiranUrl || null;
        finalLampiranNama = req.body.lampiranNama || finalLampiranNama;
      }

      const taskDeskripsi = (description || deskripsi || '').trim();

      const newTugas = await prisma.tugas.create({
        data: {
          id: `tugas-${Date.now()}`,
          kelasId: targetKelasId,
          judul: taskTitle,
          deskripsi: taskDeskripsi,
          deadline: deadline ? new Date(deadline) : new Date(Date.now() + 24 * 60 * 60 * 1000),
          deadlineText: deadline_text || 'Hari ini, 23.59',
          category: category || 'segera',
          lampiran: finalLampiranNama,
          lampiranNama: finalLampiranNama,
          lampiranUrl: finalLampiranUrl,
        },
      });

      return res.status(201).json({
        success: true,
        message: 'Tugas berhasil ditambahkan',
        id: newTugas.id,
        data: newTugas,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || err });
    }
  };

// Mengubah tugas (kategori, judul, deskripsi, deadline, lampiran)
export const updateTugasCategory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { category, title, judul, description, deskripsi, deadline, deadline_text, attachment_name } = req.body;

    const dataToUpdate: any = {};
    if (category) dataToUpdate.category = category;
    if (title || judul) dataToUpdate.judul = title || judul;
    if (description !== undefined || deskripsi !== undefined) dataToUpdate.deskripsi = description || deskripsi || '';
    if (deadline) dataToUpdate.deadline = new Date(deadline);
    if (deadline_text) dataToUpdate.deadlineText = deadline_text;
    if (attachment_name !== undefined) dataToUpdate.lampiran = attachment_name;

    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({ success: false, message: 'Tidak ada data untuk diperbarui!' });
    }

    await prisma.tugas.update({
      where: { id: String(id) },
      data: dataToUpdate,
    });

    return res.status(200).json({ success: true, message: 'Data tugas berhasil diperbarui' });
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