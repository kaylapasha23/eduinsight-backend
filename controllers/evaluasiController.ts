import { Request, Response } from 'express';
import { prisma } from '../data/database.js';

// Ambil data evaluasi mahasiswa (AI Evaluation Card)
export const getEvaluasi = async (req: Request, res: Response): Promise<Response> => {
  try {
    const list = await prisma.evaluasi.findMany({
      orderBy: { createdAt: 'desc' },
    });

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

    return res.status(200).json({ success: true, message: 'Data evaluasi berhasil disimpan', data: newEval });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err });
  }
};

export default {
  getEvaluasi,
  saveEvaluasi,
};