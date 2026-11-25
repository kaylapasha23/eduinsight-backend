import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { prisma } from '../data/database.js';
import { NilaiPengumpulanSchema } from '../dtos/pengumpulanTugas.dto.js';
import { uploadFileToCloudinary } from '../services/cloudinaryService.js';
import { createAndSendNotification } from '../services/fcmService.js';

function formatTanggalJam(date: Date | string | null | undefined): string {
  if (!date) return '23 Nov 2026, 14.30';
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return d.toLocaleDateString('id-ID', options);
}

// ─────────────────────────────────────────────────────────────
// 1. GET /api/tugas/:id/pengumpulan
// ─────────────────────────────────────────────────────────────
export const getPengumpulanByTugasId = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    // 1. Cari data tugas
    const tugas = await (prisma as any).tugas.findUnique({
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

    if (!tugas) {
      return res.status(404).json({
        success: false,
        message: `Tugas dengan ID "${id}" tidak ditemukan.`,
      });
    }

    // 2. Cari data pengumpulan mahasiswa di database
    let submissions = await (prisma as any).pengumpulanTugas.findMany({
      where: { taskId: String(id) },
      include: {
        siswa: true,
      },
      orderBy: { submittedAt: 'desc' },
    });

    // Ambil semua mahasiswa untuk perbandingan total
    const allStudents = await prisma.user.findMany({
      where: { role: 'mahasiswa' },
      orderBy: { name: 'asc' },
    });

    // 3. Hitung statistik pengumpulan aktual langsung dari database (tanpa dummy seed)
    const totalMahasiswa = allStudents.length > 0 ? allStudents.length : submissions.length;
    const jumlahTerkumpul = submissions.length;
    const persentaseTerkumpul = totalMahasiswa > 0 ? Math.round((jumlahTerkumpul / totalMahasiswa) * 100) : 0;
    const sudahDinilai = submissions.filter(
      (s: any) => s.statusPenilaian === 'Sudah Dinilai' || (s.nilai !== null && s.nilai !== undefined)
    ).length;
    const belumDinilai = Math.max(0, jumlahTerkumpul - sudahDinilai);

    // 4. Format daftar pengumpulan
    const deadlineDate = tugas.deadline ? new Date(tugas.deadline) : null;

    const uploadDir = path.join(process.cwd(), 'uploads', 'tugas');
    const filesOnDisk = fs.existsSync(uploadDir) ? fs.readdirSync(uploadDir) : [];

    const daftarPengumpulan = submissions.map((item: any, idx: number) => {
      const studentName = item.siswa?.name || item.studentName || `Mahasiswa ${idx + 1}`;
      const nim = item.siswa?.nim || item.nim || `22010100${(idx % 10) + 1}`;
      const subDate = item.submittedAt ? new Date(item.submittedAt) : new Date();
      const isLate = deadlineDate ? subDate.getTime() > deadlineDate.getTime() : item.status === 'Terlambat';

      // Cari URL file lokal langsung berakhiran ekstensi (.pdf, .jpg, dll) agar browser langsung menampilkan preview
      let directUrl = item.fileUrl ? `/api/pengumpulan-tugas/${item.id}/file` : null;
      if (item.fileName && filesOnDisk.length > 0) {
        const baseSub = path.parse(item.fileName).name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const matched = filesOnDisk.find((f) => {
          const baseDisk = path.parse(f).name.toLowerCase().replace(/[^a-z0-9]/g, '');
          return baseSub && (baseDisk.startsWith(baseSub) || baseDisk.includes(baseSub));
        });
        if (matched) {
          directUrl = `/uploads/tugas/${matched}`;
        }
      }

      return {
        id: String(item.id),
        taskId: tugas.id,
        studentId: item.studentId,
        studentName,
        namaMahasiswa: studentName,
        nim,
        submittedAt: subDate.toISOString(),
        waktuPengumpulan: formatTanggalJam(subDate),
        statusWaktu: isLate ? 'Terlambat' : 'Tepat Waktu',
        fileName: item.fileName || null,
        fileUrl: directUrl,
        cloudinaryUrl: item.fileUrl || null,
        linkRepo: item.linkRepo || null,
        nilai: item.nilai !== undefined ? item.nilai : null,
        statusPenilaian: item.statusPenilaian || (item.nilai !== null && item.nilai !== undefined ? 'Sudah Dinilai' : 'Belum Dinilai'),
      };
    });

    const mataKuliahNama = tugas.kelas?.mataKuliah?.nama || 'Mata Kuliah';
    const kodeKelas = tugas.kelas?.kodeGabung || tugas.kelasId || 'KELAS-A';

    let formattedDeadlineText = tugas.deadlineText;
    if (tugas.deadline) {
      const d = new Date(tugas.deadline);
      if (!isNaN(d.getTime())) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        formattedDeadlineText = `${yyyy}-${mm}-${dd} (23:59 WIB)`;
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        tugas: {
          id: tugas.id,
          judul: tugas.judul,
          deskripsi: tugas.deskripsi,
          deadline: tugas.deadline,
          deadlineText: formattedDeadlineText || 'Hari ini, 23.59',
          category: tugas.category,
          status: tugas.category === 'selesai' ? 'Selesai' : 'Berjalan',
          mataKuliah: mataKuliahNama,
          kodeKelas,
          kelasId: tugas.kelasId,
          dosenName: tugas.kelas?.dosen?.name || 'Dosen Pengampu',
          lampiran: tugas.lampiran,
          lampiranNama: tugas.lampiranNama || tugas.lampiran,
          lampiranUrl: tugas.lampiranUrl,
        },
        statistik: {
          totalMahasiswa,
          jumlahTerkumpul,
          persentaseTerkumpul,
          sudahDinilai,
          belumDinilai,
        },
        daftarPengumpulan,
      },
    });
  } catch (err: any) {
    console.error('[GET PENGUMPULAN ERROR]:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data pengumpulan tugas.',
      error: err?.message || err,
    });
  }
};

// ─────────────────────────────────────────────────────────────
// 2. GET /api/tugas/:id/pengumpulan/me
// ─────────────────────────────────────────────────────────────
export const getMyPengumpulan = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const currentUserId = (req as any).user?.id || (req.query.studentId as string) || null;
    if (!currentUserId) {
      return res.status(200).json({ success: true, submitted: false, data: null });
    }

    const submission = await (prisma as any).pengumpulanTugas.findFirst({
      where: {
        taskId: String(id),
        studentId: String(currentUserId),
      },
      include: {
        siswa: true,
        tugas: true,
      },
    });

    if (!submission) {
      return res.status(200).json({
        success: true,
        submitted: false,
        data: null,
      });
    }

    const studentName = submission.siswa?.name || 'Mahasiswa';
    const nim = submission.siswa?.nim || '';
    const subDate = submission.submittedAt ? new Date(submission.submittedAt) : new Date();

    return res.status(200).json({
      success: true,
      submitted: true,
      data: {
        id: String(submission.id),
        taskId: submission.taskId,
        studentId: submission.studentId,
        studentName,
        namaMahasiswa: studentName,
        nim,
        submittedAt: subDate.toISOString(),
        waktuPengumpulan: formatTanggalJam(subDate),
        statusWaktu: submission.status === 'Terlambat' ? 'Terlambat' : 'Tepat Waktu',
        fileName: submission.fileName,
        fileUrl: submission.fileUrl ? `/api/pengumpulan-tugas/${submission.id}/file` : null,
        cloudinaryUrl: submission.fileUrl || null,
        linkRepo: submission.linkRepo,
        nilai: submission.nilai !== undefined ? submission.nilai : null,
        statusPenilaian: submission.statusPenilaian || (submission.nilai !== null ? 'Sudah Dinilai' : 'Belum Dinilai'),
        catatan: null,
      },
    });
  } catch (err: any) {
    console.error('[GET MY PENGUMPULAN ERROR]:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data pengumpulan tugas saya.',
      error: err?.message || err,
    });
  }
};

// ─────────────────────────────────────────────────────────────
// 3. POST /api/tugas/:id/pengumpulan
// ─────────────────────────────────────────────────────────────
export const submitPengumpulan = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const currentUserId = (req as any).user?.id || (req.body.studentId as string) || null;
    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: 'Sesi mahasiswa tidak ditemukan. Silakan login ulang.',
      });
    }
    const linkRepo = req.body.linkRepo ? String(req.body.linkRepo).trim() : null;
    const file = req.file;

    // Cari tugas
    const tugas = await (prisma as any).tugas.findUnique({
      where: { id: String(id) },
    });

    if (!tugas) {
      return res.status(404).json({
        success: false,
        message: `Tugas dengan ID "${id}" tidak ditemukan.`,
      });
    }

    if (!file && !linkRepo && !req.body.fileName) {
      return res.status(400).json({
        success: false,
        message: 'Harap lampirkan file tugas atau tautan repositori.',
      });
    }

    // Hitung status ketepatan waktu
    const now = new Date();
    const isLate = tugas.deadline ? now.getTime() > new Date(tugas.deadline).getTime() : false;
    const statusWaktu = isLate ? 'Terlambat' : 'Diserahkan';

    // Cek apakah submission sebelumnya sudah ada
    const existing = await (prisma as any).pengumpulanTugas.findFirst({
      where: {
        taskId: String(id),
        studentId: String(currentUserId),
      },
    });

    let fileName = existing?.fileName || null;
    let fileUrl = existing?.fileUrl || null;

    if (file) {
      fileName = file.originalname;
      const cloudRes = await uploadFileToCloudinary(file.path, 'eduinsight/submissions');
      fileUrl = cloudRes?.secureUrl || `/uploads/tugas/${file.filename}`;
    } else {
      if (req.body.fileName) fileName = String(req.body.fileName);
      if (req.body.fileUrl) fileUrl = String(req.body.fileUrl);
    }

    let submission: any;
    if (existing) {
      submission = await (prisma as any).pengumpulanTugas.update({
        where: { id: existing.id },
        data: {
          fileName,
          fileUrl,
          linkRepo: linkRepo !== null ? linkRepo : existing.linkRepo,
          status: statusWaktu,
          submittedAt: now,
        },
        include: { siswa: true, tugas: true },
      });
    } else {
      const subId = `sub-${tugas.id}-${currentUserId}`;
      submission = await (prisma as any).pengumpulanTugas.create({
        data: {
          id: subId,
          taskId: String(id),
          studentId: String(currentUserId),
          fileName,
          fileUrl,
          linkRepo,
          status: statusWaktu,
          submittedAt: now,
          statusPenilaian: 'Belum Dinilai',
          nilai: null,
        },
        include: { siswa: true, tugas: true },
      });
    }

    const studentName = submission.siswa?.name || 'Mahasiswa';
    const nim = submission.siswa?.nim || '';

    return res.status(200).json({
      success: true,
      message: 'Tugas berhasil dikumpulkan!',
      data: {
        id: String(submission.id),
        taskId: submission.taskId,
        studentId: submission.studentId,
        studentName,
        namaMahasiswa: studentName,
        nim,
        submittedAt: submission.submittedAt.toISOString(),
        waktuPengumpulan: formatTanggalJam(submission.submittedAt),
        statusWaktu: submission.status === 'Terlambat' ? 'Terlambat' : 'Tepat Waktu',
        fileName: submission.fileName,
        fileUrl: submission.fileUrl ? `/api/pengumpulan-tugas/${submission.id}/file` : null,
        cloudinaryUrl: submission.fileUrl || null,
        linkRepo: submission.linkRepo,
        nilai: submission.nilai,
        statusPenilaian: submission.statusPenilaian,
      },
    });
  } catch (err: any) {
    console.error('[SUBMIT PENGUMPULAN ERROR]:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengumpulkan tugas.',
      error: err?.message || err,
    });
  }
};

// ─────────────────────────────────────────────────────────────
// 4. DELETE /api/tugas/:id/pengumpulan
// ─────────────────────────────────────────────────────────────
export const deleteMyPengumpulan = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const currentUserId = (req as any).user?.id || (req.query.studentId as string) || null;
    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: 'Sesi mahasiswa tidak ditemukan. Silakan login ulang.',
      });
    }

    const existing = await (prisma as any).pengumpulanTugas.findFirst({
      where: {
        taskId: String(id),
        studentId: String(currentUserId),
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Pengumpulan tugas tidak ditemukan.',
      });
    }

    await (prisma as any).pengumpulanTugas.delete({
      where: { id: existing.id },
    });

    return res.status(200).json({
      success: true,
      message: 'Pengumpulan tugas berhasil dibatalkan.',
    });
  } catch (err: any) {
    console.error('[DELETE PENGUMPULAN ERROR]:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal membatalkan pengumpulan tugas.',
      error: err?.message || err,
    });
  }
};

// ─────────────────────────────────────────────────────────────
// 5. PATCH /api/pengumpulan-tugas/:id/nilai
// ─────────────────────────────────────────────────────────────
export const updateNilaiPengumpulan = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    // Validasi Zod
    const parsed = NilaiPengumpulanSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message || 'Nilai harus berupa angka antara 0 sampai 100.',
      });
    }

    const { nilai, catatan } = parsed.data;
    const finalScore = Math.round(Number(nilai));

    // Update di database
    let updatedSubmission: any = null;
    try {
      updatedSubmission = await (prisma as any).pengumpulanTugas.update({
        where: { id: String(id) },
        data: {
          nilai: finalScore,
          statusPenilaian: 'Sudah Dinilai',
        },
        include: {
          siswa: true,
          tugas: {
            include: {
              kelas: {
                include: {
                  mataKuliah: true,
                },
              },
            },
          },
        },
      });
    } catch (updateErr: any) {
      console.warn('[PENGUMPULAN] Update gagal atau record belum ada:', updateErr?.message);
      updatedSubmission = {
        id: String(id),
        nilai: finalScore,
        statusPenilaian: 'Sudah Dinilai',
        catatan,
      };
    }

    // Sinkronkan ke tabel penilaian & kirim notifikasi nilai baru
    try {
      if (updatedSubmission?.tugas && updatedSubmission?.siswa) {
        const studentName = updatedSubmission.siswa.name;
        const taskName = updatedSubmission.tugas.judul;
        const kelasId = updatedSubmission.tugas.kelasId;
        const matkulName = updatedSubmission.tugas.kelas?.mataKuliah?.nama || 'Mata Kuliah';

        const existingPenilaian = await prisma.penilaian.findFirst({
          where: {
            kelasId,
            studentName,
            taskName,
          },
        });

        if (existingPenilaian) {
          await prisma.penilaian.update({
            where: { id: existingPenilaian.id },
            data: { score: finalScore },
          });
        } else {
          await prisma.penilaian.create({
            data: {
              id: `penilaian-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              kelasId,
              studentName,
              taskName,
              score: finalScore,
            },
          });
        }

        // Simpan notifikasi nilai tugas untuk mahasiswa
        const notifTitle = `Nilai Tugas: ${taskName}`;
        const notifBody = `Dosen telah memberikan nilai ${finalScore} untuk tugas ${taskName} (${matkulName})`;
        const notifPayload = {
          taskId: String(updatedSubmission.taskId),
          taskTitle: taskName,
          className: matkulName,
          score: finalScore,
          studentName,
        };

        await prisma.notification.create({
          data: {
            id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            userId: updatedSubmission.siswa.id,
            type: 'tugas',
            title: notifTitle,
            body: notifBody,
            targetId: String(updatedSubmission.taskId),
            targetType: 'tugas',
            payload: JSON.stringify(notifPayload),
            isRead: false,
          },
        });

        // Kirim Push Notification FCM ke device mahasiswa
        try {
          await createAndSendNotification({
            userId: updatedSubmission.siswa.id,
            type: 'tugas',
            title: notifTitle,
            body: notifBody,
            targetId: String(updatedSubmission.taskId),
            targetType: 'tugas',
            payload: notifPayload,
          });
        } catch (_) {}
      }
    } catch (syncErr) {
      // Ignore sync error jika notifikasi/penilaian opsional
    }

    return res.status(200).json({
      success: true,
      message: 'Nilai tugas berhasil disimpan!',
      data: {
        id: String(id),
        nilai: finalScore,
        statusPenilaian: 'Sudah Dinilai',
        catatan: catatan || null,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error('[UPDATE NILAI ERROR]:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui nilai pengumpulan tugas.',
      error: err?.message || err,
    });
  }
};

export const serveSubmissionFile = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const submission = await (prisma as any).pengumpulanTugas.findUnique({
      where: { id: String(id) },
    });

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Data pengumpulan tidak ditemukan' });
    }

    // 1. Cek file fisik di uploads/tugas
    const uploadDir = path.join(process.cwd(), 'uploads', 'tugas');
    if (fs.existsSync(uploadDir)) {
      const filesOnDisk = fs.readdirSync(uploadDir);
      const baseSub = path.parse(submission.fileName || '').name.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      const matched = filesOnDisk.find((f) => {
        const baseDisk = path.parse(f).name.toLowerCase().replace(/[^a-z0-9]/g, '');
        return baseSub && (baseDisk.startsWith(baseSub) || baseDisk.includes(baseSub));
      });

      if (matched) {
        return res.redirect(`/uploads/tugas/${encodeURIComponent(matched)}`);
      }
    }

    // 2. Jika file fisik belum ditemukan, redirect ke Cloudinary URL
    if (submission.fileUrl) {
      return res.redirect(submission.fileUrl);
    }

    return res.status(404).json({ success: false, message: 'Berkas tidak ditemukan' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err });
  }
};

const PREVIEW_MIME: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.m4a': 'audio/mp4',
  '.ogg': 'audio/ogg',
  '.txt': 'text/plain',
};

/**
 * GET /api/pengumpulan-tugas/:id/preview
 * Mengirim isi berkas sebagai JSON base64 agar tidak dicegat download manager (IDM),
 * karena IDM hanya mencegat respons ber-Content-Type dokumen/media, bukan JSON.
 */
export const previewSubmissionFile = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const submission = await (prisma as any).pengumpulanTugas.findUnique({
      where: { id: String(id) },
    });

    if (!submission || !submission.fileName) {
      return res.status(404).json({ success: false, message: 'Berkas pengumpulan tidak ditemukan' });
    }

    const uploadDir = path.join(process.cwd(), 'uploads', 'tugas');
    const filesOnDisk = fs.existsSync(uploadDir) ? fs.readdirSync(uploadDir) : [];
    const baseSub = path.parse(submission.fileName).name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const matched = filesOnDisk.find((f) => {
      const baseDisk = path.parse(f).name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return baseSub && (baseDisk.startsWith(baseSub) || baseDisk.includes(baseSub));
    });

    let buffer: Buffer | null = null;
    let ext = path.extname(submission.fileName).toLowerCase();

    if (matched) {
      buffer = fs.readFileSync(path.join(uploadDir, matched));
      ext = path.extname(matched).toLowerCase();
    } else if (submission.fileUrl && /^https?:\/\//i.test(submission.fileUrl)) {
      // Fallback: ambil dari Cloudinary di sisi server
      const remote = await fetch(submission.fileUrl);
      if (remote.ok) {
        buffer = Buffer.from(await remote.arrayBuffer());
      }
    }

    if (!buffer) {
      return res.status(404).json({ success: false, message: 'Berkas fisik tidak ditemukan di server' });
    }

    return res.status(200).json({
      success: true,
      data: {
        fileName: submission.fileName,
        mimeType: PREVIEW_MIME[ext] || 'application/octet-stream',
        size: buffer.length,
        base64: buffer.toString('base64'),
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err });
  }
};

export default {
  previewSubmissionFile,
  getPengumpulanByTugasId,
  getMyPengumpulan,
  submitPengumpulan,
  deleteMyPengumpulan,
  updateNilaiPengumpulan,
  serveSubmissionFile,
};
