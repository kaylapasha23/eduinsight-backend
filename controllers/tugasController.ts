import { Request, Response } from 'express';
import { prisma } from '../data/database.js';
import { validateJudulTugas } from '../dtos/tugas.dto.js';
import { createAndSendNotification } from '../services/fcmService.js';

// Mengambil semua data tugas
export const getAllTugas = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { category, kelasId, class_id } = req.query;
    const where: any = {};
    if (category) where.category = String(category);
    if (kelasId || class_id) where.kelasId = String(kelasId || class_id);

    const tugasList = await prisma.tugas.findMany({
      where,
      include: {
        kelas: {
          include: {
            mataKuliah: true,
            dosen: true,
          },
        },
        pengumpulan: {
          include: {
            siswa: true,
          },
        },
      },
      orderBy: { deadline: 'asc' },
    });

    const totalMahasiswa = await prisma.user.count({ where: { role: 'mahasiswa' } });

    const formatted = tugasList.map((t: any) => {
      const submissions = t.pengumpulan || [];
      const realSubmittedCount = submissions.length;
      const unratedCount = submissions.filter(
        (p: any) => p.statusPenilaian === 'Belum Dinilai' || p.nilai === null || p.nilai === undefined
      ).length;

      // Status tugas untuk UI:
      // 1. Kategori 'selesai' -> 'Selesai'
      // 2. Ada pengumpulan yang belum dinilai -> 'Belum Dinilai'
      // 3. Lainnya -> 'Berjalan'
      let computedStatus = 'Berjalan';
      if (t.category === 'selesai') {
        computedStatus = 'Selesai';
      } else if (realSubmittedCount > 0 && unratedCount > 0) {
        computedStatus = 'Belum Dinilai';
      } else {
        computedStatus = 'Berjalan';
      }

      return {
        id: t.id,
        class_id: t.kelasId,
        kelasId: t.kelasId,
        class_name: t.kelas?.mataKuliah?.nama || 'Mata Kuliah',
        subject: t.kelas?.mataKuliah?.nama || 'Mata Kuliah',
        nama_kelas: t.kelas?.mataKuliah?.nama || 'Mata Kuliah',
        class_code: t.kelas?.kodeGabung || '',
        dosen_name: t.kelas?.dosen?.name || 'Dosen Pengampu',
        title: t.judul,
        judul: t.judul,
        description: t.deskripsi,
        deskripsi: t.deskripsi,
        deadline: t.deadline ? t.deadline.toISOString().split('T')[0] : (t.deadlineText || 'Hari ini'),
        dueDate: t.deadline ? t.deadline.toISOString().split('T')[0] : (t.deadlineText || 'Hari ini'),
        deadline_text: t.deadlineText || 'Hari ini, 23.59',
        deadlineText: t.deadlineText || 'Hari ini, 23.59',
        category: t.category,
        status: computedStatus,
        submittedCount: realSubmittedCount,
        submitted_count: realSubmittedCount,
        totalStudents: totalMahasiswa || 4,
        total_students: totalMahasiswa || 4,
        attachment_name: t.lampiranNama || t.lampiran,
        lampiran_nama: t.lampiranNama || t.lampiran,
        lampiran_url: t.lampiranUrl,
        lampiranNama: t.lampiranNama || t.lampiran,
        lampiranUrl: t.lampiranUrl,
        lampiran: t.lampiran,
        created_at: t.createdAt,
        createdAt: t.createdAt,
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
        pengumpulan: {
          include: {
            siswa: true,
          },
        },
      },
    });

    if (!t) {
      return res.status(404).json({ success: false, message: 'Tugas tidak ditemukan' });
    }

    const submissions = t.pengumpulan || [];
    const realSubmittedCount = submissions.length;
    const unratedCount = submissions.filter(
      (p: any) => p.statusPenilaian === 'Belum Dinilai' || p.nilai === null || p.nilai === undefined
    ).length;

    let computedStatus = 'Berjalan';
    if (t.category === 'selesai') {
      computedStatus = 'Selesai';
    } else if (realSubmittedCount > 0 && unratedCount > 0) {
      computedStatus = 'Belum Dinilai';
    } else {
      computedStatus = 'Berjalan';
    }

    const totalMahasiswa = await prisma.user.count({ where: { role: 'mahasiswa' } });

    const formatted = {
      id: t.id,
      class_id: t.kelasId,
      kelasId: t.kelasId,
      class_name: t.kelas?.mataKuliah?.nama || 'Mata Kuliah',
      subject: t.kelas?.mataKuliah?.nama || 'Mata Kuliah',
      nama_kelas: t.kelas?.mataKuliah?.nama || 'Mata Kuliah',
      class_code: t.kelas?.kodeGabung || '',
      dosen_name: t.kelas?.dosen?.name || 'Dosen Pengampu',
      title: t.judul,
      judul: t.judul,
      description: t.deskripsi,
      deskripsi: t.deskripsi,
      deadline: t.deadline ? t.deadline.toISOString().split('T')[0] : (t.deadlineText || 'Hari ini'),
      dueDate: t.deadline ? t.deadline.toISOString().split('T')[0] : (t.deadlineText || 'Hari ini'),
      deadline_text: t.deadlineText || 'Hari ini, 23.59',
      deadlineText: t.deadlineText || 'Hari ini, 23.59',
      category: t.category,
      status: computedStatus,
      submittedCount: realSubmittedCount,
      submitted_count: realSubmittedCount,
      totalStudents: totalMahasiswa || 4,
      total_students: totalMahasiswa || 4,
      attachment_name: t.lampiranNama || t.lampiran,
      lampiran_nama: t.lampiranNama || t.lampiran,
      lampiran_url: t.lampiranUrl,
      lampiranNama: t.lampiranNama || t.lampiran,
      lampiranUrl: t.lampiranUrl,
      lampiran: t.lampiran,
      created_at: t.createdAt,
      createdAt: t.createdAt,
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

    // Olah deadline date & deadline text agar akurat sesuai input pengguna
    let finalDeadlineDate: Date;
    let finalDeadlineText: string;

    if (deadline) {
      const dateStr = String(deadline).trim();
      if (dateStr.includes('T')) {
        finalDeadlineDate = new Date(dateStr);
      } else {
        finalDeadlineDate = new Date(`${dateStr}T23:59:00`);
        if (isNaN(finalDeadlineDate.getTime())) {
          finalDeadlineDate = new Date(dateStr);
        }
      }

      if (deadline_text && deadline_text.trim()) {
        finalDeadlineText = deadline_text.trim();
      } else {
        const yyyy = finalDeadlineDate.getFullYear();
        const mm = String(finalDeadlineDate.getMonth() + 1).padStart(2, '0');
        const dd = String(finalDeadlineDate.getDate()).padStart(2, '0');
        finalDeadlineText = `${yyyy}-${mm}-${dd} (23:59 WIB)`;
      }
    } else {
      finalDeadlineDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      finalDeadlineText = deadline_text || 'Hari ini, 23.59';
    }

    const newTugas = await prisma.tugas.create({
      data: {
        id: `tugas-${Date.now()}`,
        kelasId: targetKelasId,
        judul: taskTitle,
        deskripsi: taskDeskripsi,
        deadline: finalDeadlineDate,
        deadlineText: finalDeadlineText,
        category: category || 'segera',
        lampiran: finalLampiranNama,
        lampiranNama: finalLampiranNama,
        lampiranUrl: finalLampiranUrl,
      },
    });

    // Pemicu notifikasi ke mahasiswa
    try {
      const kelasData = await prisma.kelas.findUnique({
        where: { id: targetKelasId },
        include: { mataKuliah: true },
      });
      const className = kelasData?.mataKuliah?.nama || 'Mata Kuliah';

      await createAndSendNotification({
        type: 'tugas',
        title: `Tugas Baru: ${taskTitle}`,
        body: `Dosen menambahkan tugas "${taskTitle}" (${className}). Deadline: ${newTugas.deadlineText || 'Hari ini, 23.59'}`,
        targetId: newTugas.id,
        targetType: 'tugas',
        payload: {
          taskTitle: taskTitle,
          className: className,
          taskId: newTugas.id,
        },
      });
    } catch (errNotif) {
      console.error('[Notification Error]:', errNotif);
    }

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

// Mengubah tugas
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
    const existingTugas = await prisma.tugas.findUnique({ where: { id: String(id) } });
    await prisma.tugas.delete({ where: { id: String(id) } });

    if (existingTugas) {
      try {
        await createAndSendNotification({
          type: 'tugas',
          title: `Tugas Dihapus`,
          body: `Tugas "${existingTugas.judul}" telah dihapus oleh dosen.`,
          targetId: String(id),
          targetType: 'tugas',
          payload: {
            taskTitle: existingTugas.judul,
            taskId: existingTugas.id,
          },
        });
      } catch (errNotif) {}
    }

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
