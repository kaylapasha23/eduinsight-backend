import { Request, Response } from 'express';
import { prisma } from '../data/database.js';
import { runEvaluatorPipeline } from '../services/evaluatorService.js';
import { Logger } from '../utils/logger.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { createAndSendNotification } from '../services/fcmService.js';

/**
- POST /api/evaluator/analyze
 *
- Body (sudah divalidasi Zod):
-   student_id   – id user atau NIM mahasiswa
-   class_id     – id kelas
-   lecturer_note – catatan dosen (opsional)
 */
export const analyzeStudent = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  const { student_id, class_id, lecturer_note } = req.body;
  const lecturerName = req.user?.name ?? 'Dosen';

  Logger.info(`[Evaluator] Memulai analisis: student=${student_id} kelas=${class_id}`);

  try {
    // ── Jalankan pipeline AI ──────────────────────────────────────────
    const { user, kelas, stats, aiResult } = await runEvaluatorPipeline(
      student_id,
      class_id,
      lecturer_note,
    );

    // ── Susun data untuk disimpan ke tabel evaluasi ───────────────────
    const validKelasId = kelas?.id || class_id;
    const evalId = `eval-${user.id}-${validKelasId}`;

    const messages = [
      { text: aiResult.ringkasan_analisis, isPositive: aiResult.status_risiko === 'Aman' },
      { text: aiResult.rekomendasi, isPositive: false },
    ];

    const dataToSave = {
      kelasId: validKelasId,
      studentName: user.name,
      nilaiAkhir: stats.rataRataNilai,
      trenKehadiran: `${stats.persentaseKehadiran}%`,
      indikatorRisiko: aiResult.status_risiko,
      insightPerforma: aiResult.ringkasan_analisis,
      catatanDosen: lecturer_note ?? null,
      dateText: new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      lecturerName,
      messages: JSON.stringify(messages),
      lecturerNote: lecturer_note ?? null,
    };

    // ── Upsert ke tabel evaluasi (update jika sudah ada, insert jika baru) ─
    const saved = await (prisma as any).evaluasi.upsert({
      where: { id: evalId },
      update: dataToSave,
      create: { id: evalId, ...dataToSave },
    });

    Logger.success(`[Evaluator] Evaluasi berhasil disimpan: ${evalId}`, {
      status: aiResult.status_risiko,
    });

    // Pemicu notifikasi evaluasi AI ke mahasiswa (dengan rate-limit 60 detik)
    try {
      // Cek apakah sudah ada notifikasi evaluasi untuk user ini dalam 60 detik terakhir
      const recentNotif = await (prisma as any).notification.findFirst({
        where: {
          type: 'evaluasi',
          userId: user.id,
          createdAt: { gte: new Date(Date.now() - 60_000) },
        },
      });
      if (!recentNotif) {
        await createAndSendNotification({
          userId: user.id,
          type: 'evaluasi',
          title: `Evaluasi AI Akademik Diperbarui`,
          body: lecturer_note 
            ? `Dosen memberikan catatan: "${lecturer_note}"`
            : `Hasil evaluasi performa akademik terbaru: ${aiResult.status_risiko} (Nilai: ${stats.rataRataNilai})`,
          targetId: saved.id,
          targetType: 'evaluasi',
          payload: {
            evalId: saved.id,
            studentName: user.name,
            kelasId: validKelasId,
          },
        });
      }
    } catch (_) {}

    // ── Kirim response ke frontend ────────────────────────────────────
    return res.status(200).json({
      success: true,
      message: 'Evaluasi AI berhasil dijalankan dan disimpan.',
      data: {
        id: saved.id,
        studentName: user.name,
        nim: user.nim ?? null,
        kelasId: validKelasId,
        status_risiko: aiResult.status_risiko,
        ringkasan_analisis: aiResult.ringkasan_analisis,
        rekomendasi: aiResult.rekomendasi,
        trenKehadiran: dataToSave.trenKehadiran,
        nilaiAkhir: dataToSave.nilaiAkhir,
        lecturerNote: lecturer_note ?? null,
        dateText: dataToSave.dateText,
        lecturerName,
      },
    });
  } catch (err: any) {
    Logger.error('[Evaluator] Pipeline gagal', err);
    return res.status(500).json({
      success: false,
      message: err?.message || 'Terjadi kesalahan saat menjalankan evaluasi AI.',
    });
  }
};

export default { analyzeStudent };
