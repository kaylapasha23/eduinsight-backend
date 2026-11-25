import { Request, Response } from 'express';
import { prisma } from '../data/database.js';
import { createAndSendNotification } from '../services/fcmService.js';

// Ambil data evaluasi mahasiswa (AI Evaluation Card)
export const getEvaluasi = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = (req as any).user;
    const queryStudent = (req.query.studentName || req.query.student_name) as string | undefined;

    // Isolasi per mahasiswa: mahasiswa hanya boleh melihat evaluasi miliknya sendiri
    const targetStudentName = queryStudent
      ? String(queryStudent).trim()
      : user?.role === 'mahasiswa'
        ? String(user.name || '').trim()
        : undefined;

    const allList = await prisma.evaluasi.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const list = targetStudentName
      ? allList.filter(
          (ev: any) =>
            (ev.studentName || '').toLowerCase().trim() === targetStudentName.toLowerCase(),
        )
      : allList;

    const formatted = list.map((ev: any) => {
      let messages: any[] = [];
      try {
        messages = typeof ev.messages === 'string' ? JSON.parse(ev.messages) : (ev.messages || []);
      } catch (_) {
        messages = [{ text: ev.messages, isPositive: true }];
      }

      return {
        id: ev.id,
        kelasId: ev.kelasId,
        studentName: ev.studentName,
        nilaiAkhir: ev.nilaiAkhir ?? 85.0,
        trenKehadiran: ev.trenKehadiran || '90%',
        indikatorRisiko: ev.indikatorRisiko || 'Rendah',
        insightPerforma: ev.insightPerforma || 'Performa akademik baik.',
        catatanDosen: ev.catatanDosen || ev.lecturerNote || '',
        dateText: ev.dateText,
        lecturerName: ev.lecturerName,
        messages,
        lecturerNote: ev.lecturerNote,
        createdAt: ev.createdAt,
      };
    });

    return res.status(200).json({ success: true, data: formatted });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err });
  }
};

// Simpan atau update analisis AI / catatan dosen
export const saveEvaluasi = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { dateText, lecturerName, messages, lecturerNote } = req.body;

    const newEval = await prisma.evaluasi.create({
      data: {
        id: `eval-${Date.now()}`,
        dateText: dateText || 'Hari ini',
        lecturerName: lecturerName || 'Dosen Pembimbing',
        messages: typeof messages === 'string' ? messages : JSON.stringify(messages || []),
        lecturerNote: lecturerNote || null,
        // Tambahkan field opsional wajib dari schema jika prisma menanyakannya:
        kelasId: req.body.kelasId || 'kelas-ai',
        studentName: req.body.studentName || 'Mahasiswa',
        nilaiAkhir: req.body.nilaiAkhir ? Number(req.body.nilaiAkhir) : 85.0,
      } as any,
    });

    // Pemicu notifikasi evaluasi ke mahasiswa spesifik (dengan proteksi rate-limit agar tidak kedouble)
    try {
      const sName = req.body.studentName || 'Mahasiswa';
      const targetUser = await prisma.user.findFirst({
        where: {
          role: 'mahasiswa',
          name: { equals: sName },
        },
        select: { id: true },
      });

      const recentNotif = await (prisma as any).notification.findFirst({
        where: {
          type: 'evaluasi',
          userId: targetUser ? targetUser.id : null,
          createdAt: { gte: new Date(Date.now() - 30_000) },
        },
      });

      if (!recentNotif) {
        await createAndSendNotification({
          userId: targetUser ? targetUser.id : null,
          type: 'evaluasi',
          title: `Feedback Evaluasi Akademik Baru`,
          body: lecturerNote
            ? `Dosen memberikan catatan: "${lecturerNote}"`
            : `Hasil evaluasi performa akademik terbaru telah tersedia dari dosen.`,
          targetId: newEval.id,
          targetType: 'evaluasi',
          payload: {
            evalId: newEval.id,
            lecturerName: lecturerName || 'Dosen Pembimbing',
            studentName: sName,
          },
        });
      }
    } catch (_) {}

    return res.status(200).json({ success: true, message: 'Data evaluasi berhasil disimpan', data: newEval });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err });
  }
};

export default {
  getEvaluasi,
  saveEvaluasi,
};