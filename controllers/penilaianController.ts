import { Request, Response } from 'express';
import { prisma } from '../data/database.js';
import { createAndSendNotification } from '../services/fcmService.js';

// Ambil semua data penilaian semester (mendukung format Web & Mobile dengan pagination)
export const getAllPenilaian = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { kelasId, class_id, page = '1', limit = '10' } = req.query;
    const filterKelasId = (kelasId || class_id) as string | undefined;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    // 1. Dapatkan daftar mahasiswa aktif (total 4 mahasiswa) dengan pagination
    const [totalMhs, mhsUsers] = await Promise.all([
      prisma.user.count({ where: { role: 'mahasiswa' } }),
      prisma.user.findMany({
        where: { role: 'mahasiswa' },
        orderBy: { name: 'asc' },
        skip,
        take: limitNum,
      }),
    ]);

    // 2. Ambil seluruh catatan penilaian untuk kelas yang dipilih (jika ada filter)
    const whereClause = filterKelasId ? { kelasId: filterKelasId } : {};
    const existingPenilaianList = await prisma.penilaian.findMany({
      where: whereClause,
      include: {
        kelas: {
          include: {
            mataKuliah: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 3. Kelompokkan catatan nilai per nama mahasiswa (case-insensitive)
    const scoresByStudent = new Map<string, any[]>();
    for (const p of existingPenilaianList) {
      const key = (p.studentName || '').toLowerCase().trim();
      if (!scoresByStudent.has(key)) {
        scoresByStudent.set(key, []);
      }
      scoresByStudent.get(key)!.push(p);
    }

    // 4. Buat 1 baris tepat per mahasiswa (tidak ada duplikasi nama atau variabel per tugas)
    const formatted = mhsUsers.map((user, idx) => {
      const key = (user.name || '').toLowerCase().trim();
      const studentPenilaians = scoresByStudent.get(key) || [];

      // Ambil nilai akhir yang tersimpan di DB jika dosen sudah pernah input
      let scoreVal = 0;
      let latestCreatedAt = user.createdAt;
      let matchedKelas = studentPenilaians[0]?.kelas || null;

      if (studentPenilaians.length > 0) {
        // Ambil nilai Penilaian Akhir atau nilai terbaru yang tersimpan
        const finalItem = studentPenilaians.find(p => p.taskName === 'Penilaian Akhir') || studentPenilaians[0];
        scoreVal = finalItem.score || 0;
        latestCreatedAt = finalItem.createdAt;
      } else {
        // Default 0 jika dosen belum pernah menginput nilai untuk kelas ini
        scoreVal = 0;
      }

      return {
        id: user.id || `mhs-${idx + 1}`,
        kelasId: filterKelasId || studentPenilaians[0]?.kelasId || 'kelas-ai',
        class_id: filterKelasId || studentPenilaians[0]?.kelasId || 'kelas-ai',
        studentName: user.name,
        student_name: user.name,
        name: user.name,
        nim: user.nim || `22010100${idx + 1}`,
        taskName: 'Penilaian Semester',
        task_name: 'Penilaian Semester',
        score: scoreVal,
        tugas: scoreVal,
        kuis: scoreVal,
        uts: scoreVal,
        uas: scoreVal,
        kehadiran: 'Hadir',
        catatan: scoreVal > 0 ? 'Hasil pengerjaan tugas konsisten dan rapi.' : 'Belum ada penilaian.',
        createdAt: latestCreatedAt,
        kelas: matchedKelas,
      };
    });

    return res.status(200).json({
      success: true,
      data: formatted,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalMhs,
        totalPages: Math.ceil(totalMhs / limitNum),
      },
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

    // Cari ID user mahasiswa untuk pengiriman notifikasi terarah (bukan broadcast)
    const targetUser = await prisma.user.findFirst({
      where: {
        role: 'mahasiswa',
        name: { equals: sName },
      },
      select: { id: true },
    });

    if (existingPenilaian) {
      const updated = await prisma.penilaian.update({
        where: { id: existingPenilaian.id },
        data: {
          score: finalScore,
          createdAt: new Date(),
        },
      });

      // Pemicu notifikasi nilai ke mahasiswa bersangkutan
      if (targetUser) {
        try {
          const recentNotif = await prisma.notification.findFirst({
            where: {
              userId: targetUser.id,
              type: 'penilaian',
              createdAt: { gte: new Date(Date.now() - 15_000) },
            },
          });

          if (!recentNotif) {
            const kelasData = await prisma.kelas.findUnique({
              where: { id: targetKelasId },
              include: { mataKuliah: true },
            });
            const matkulName = kelasData?.mataKuliah?.nama || 'Mata Kuliah';

            await createAndSendNotification({
              userId: targetUser.id,
              type: 'penilaian',
              title: `Update Nilai: ${tName}`,
              body: `Nilai kamu untuk ${tName} (${matkulName}) telah diperbarui: ${finalScore}`,
              targetId: updated.id,
              targetType: 'penilaian',
              payload: {
                studentName: sName,
                taskName: tName,
                score: finalScore,
                matkul: matkulName,
              },
            });
          }
        } catch (_) {}
      }

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

    // Pemicu notifikasi nilai baru ke mahasiswa bersangkutan
    if (targetUser) {
      try {
        const recentNotif = await prisma.notification.findFirst({
          where: {
            userId: targetUser.id,
            type: 'penilaian',
            createdAt: { gte: new Date(Date.now() - 15_000) },
          },
        });

        if (!recentNotif) {
          const kelasData = await prisma.kelas.findUnique({
            where: { id: targetKelasId },
            include: { mataKuliah: true },
          });
          const matkulName = kelasData?.mataKuliah?.nama || 'Mata Kuliah';

          await createAndSendNotification({
            userId: targetUser.id,
            type: 'penilaian',
            title: `Nilai Baru: ${tName}`,
            body: `Dosen telah merilis nilai untuk ${tName} (${matkulName}): ${finalScore}`,
            targetId: created.id,
            targetType: 'penilaian',
            payload: {
              studentName: sName,
              taskName: tName,
              score: finalScore,
              matkul: matkulName,
            },
          });
        }
      } catch (_) {}
    }

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