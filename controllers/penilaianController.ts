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

    // 2. Ambil seluruh catatan penilaian manual dan data pengumpulan tugas dari database
    const whereClause = filterKelasId ? { kelasId: filterKelasId } : {};
    const [existingPenilaianList, allSubmissions] = await Promise.all([
      prisma.penilaian.findMany({
        where: whereClause,
        include: {
          kelas: {
            include: {
              mataKuliah: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      // AMBIL NILAI TUGAS LANGSUNG DARI DATABASE PENGUMPULAN TUGAS
      (prisma as any).pengumpulanTugas.findMany({
        where: {
          ...(filterKelasId ? { tugas: { kelasId: filterKelasId } } : {}),
        },
        include: {
          siswa: true,
          tugas: true,
        },
      }),
    ]);

    // 3. Kelompokkan catatan nilai per nama mahasiswa & pengumpulan tugas per student
    const scoresByStudent = new Map<string, any[]>();
    for (const p of existingPenilaianList) {
      const key = (p.studentName || '').toLowerCase().trim();
      if (!scoresByStudent.has(key)) {
        scoresByStudent.set(key, []);
      }
      scoresByStudent.get(key)!.push(p);
    }

    const submissionsByStudent = new Map<string, any[]>();
    for (const sub of allSubmissions) {
      const sId = sub.studentId || sub.siswa?.id;
      if (sId) {
        if (!submissionsByStudent.has(sId)) {
          submissionsByStudent.set(sId, []);
        }
        submissionsByStudent.get(sId)!.push(sub);
      }
      const sNameKey = (sub.siswa?.name || sub.studentName || '').toLowerCase().trim();
      if (sNameKey) {
        if (!submissionsByStudent.has(sNameKey)) {
          submissionsByStudent.set(sNameKey, []);
        }
        submissionsByStudent.get(sNameKey)!.push(sub);
      }
    }

    // 4. Format nilai setiap mahasiswa: nilai tugas diambil dari database pengumpulan tugas
    const formatted = mhsUsers.map((user, idx) => {
      const key = (user.name || '').toLowerCase().trim();
      const studentPenilaians = scoresByStudent.get(key) || [];
      const studentSubs = submissionsByStudent.get(user.id) || submissionsByStudent.get(key) || [];

      // HITUNG NILAI TUGAS DARI DATABASE PENGUMPULAN TUGAS MAHASISWA
      const gradedSubs = studentSubs.filter(
        (s: any) => s.nilai !== null && s.nilai !== undefined && !isNaN(Number(s.nilai))
      );

      let nilaiTugas = 0;
      if (gradedSubs.length > 0) {
        const sumTugas = gradedSubs.reduce((acc: number, curr: any) => acc + Number(curr.nilai), 0);
        nilaiTugas = Math.round(sumTugas / gradedSubs.length);
      } else {
        const manualTugas = studentPenilaians.find((p) => p.taskName.toLowerCase().includes('tugas'));
        if (manualTugas && manualTugas.score !== null) {
          nilaiTugas = manualTugas.score;
        }
      }

      // Nilai Kuis, UTS, UAS dari tabel penilaian
      const kuisItem = studentPenilaians.find((p) => p.taskName.toLowerCase().includes('kuis'));
      const utsItem = studentPenilaians.find((p) => p.taskName.toLowerCase().includes('uts'));
      const uasItem = studentPenilaians.find((p) => p.taskName.toLowerCase().includes('uas'));
      const akhirItem = studentPenilaians.find((p) => p.taskName.toLowerCase().includes('akhir'));

      const nilaiKuis = kuisItem?.score ?? (akhirItem?.score ? Math.max(0, akhirItem.score - 5) : 0);
      const nilaiUts = utsItem?.score ?? (akhirItem?.score ? akhirItem.score : 0);
      const nilaiUas = uasItem?.score ?? (akhirItem?.score ? akhirItem.score : 0);

      // Hitung skor akhir kumulatif (Tugas 25%, Kuis 15%, UTS 25%, UAS 35%)
      const finalScore = Math.round(
        nilaiTugas * 0.25 + nilaiKuis * 0.15 + nilaiUts * 0.25 + nilaiUas * 0.35
      );

      const matchedKelas = studentPenilaians[0]?.kelas || null;

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
        score: finalScore || (gradedSubs.length > 0 ? nilaiTugas : 0),
        tugas: nilaiTugas,
        kuis: nilaiKuis,
        uts: nilaiUts,
        uas: nilaiUas,
        kehadiran: 'Hadir',
        catatan:
          gradedSubs.length > 0
            ? `Nilai tugas (${nilaiTugas}) diambil langsung dari database pengumpulan tugas (${gradedSubs.length} tugas dinilai).`
            : 'Belum ada penilaian pengumpulan tugas.',
        createdAt: user.createdAt,
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

    // Sinkronkan ke database pengumpulan tugas jika nilai tugas diubah
    if (req.body.tugas !== undefined || (tName && tName.toLowerCase().includes('tugas'))) {
      const tugasScoreVal = req.body.tugas !== undefined ? Math.round(Number(req.body.tugas)) : finalScore;
      if (targetUser) {
        try {
          const latestSub = await (prisma as any).pengumpulanTugas.findFirst({
            where: {
              studentId: targetUser.id,
              ...(targetKelasId ? { tugas: { kelasId: targetKelasId } } : {}),
            },
            orderBy: { submittedAt: 'desc' },
          });
          if (latestSub) {
            await (prisma as any).pengumpulanTugas.update({
              where: { id: latestSub.id },
              data: {
                nilai: tugasScoreVal,
                statusPenilaian: 'Sudah Dinilai',
              },
            });
          }
        } catch (_) {}
      }
    }

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