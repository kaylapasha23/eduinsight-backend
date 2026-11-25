import { Router, Request, Response } from 'express';
import { prisma } from '../data/database.js';
import { optionalAuthMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Helper untuk konversi skor angka ke grade huruf dan bobot SKS
function scoreToGrade(score: number): { grade: string; point: number } {
  if (score >= 85) return { grade: 'A', point: 4.0 };
  if (score >= 80) return { grade: 'A-', point: 3.75 };
  if (score >= 75) return { grade: 'B+', point: 3.5 };
  if (score >= 70) return { grade: 'B', point: 3.0 };
  if (score >= 65) return { grade: 'B-', point: 2.75 };
  if (score >= 60) return { grade: 'C+', point: 2.5 };
  if (score >= 55) return { grade: 'C', point: 2.0 };
  if (score >= 40) return { grade: 'D', point: 1.0 };
  return { grade: 'E', point: 0.0 };
}

// GET /api/nilai-semester - Mengembalikan struktur KHS dinamis sesuai input dosen
router.get('/', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const queryStudent = (req.query.studentName || req.query.name || req.query.student_name) as string | undefined;

    // Tentukan mahasiswa target secara ketat berdasarkan query atau user yang sedang login
    let targetStudentName = queryStudent ? String(queryStudent).trim() : undefined;
    if (!targetStudentName && user && user.role === 'mahasiswa') {
      targetStudentName = String(user.name || '').trim();
    }

    // Ambil seluruh 10 kelas & mata kuliah aktif
    const classes = await prisma.kelas.findMany({
      include: { mataKuliah: true },
      orderBy: { id: 'asc' },
    });

    // Ambil nilai yang diinput dosen HANYA untuk mahasiswa target (kosong jika tidak ada target)
    const scores = targetStudentName
      ? await prisma.penilaian.findMany({
          where: {
            studentName: { equals: targetStudentName },
          },
          orderBy: { createdAt: 'desc' },
        })
      : [];

    // Kelompokkan skor berdasarkan kelasId
    const scoreMap = new Map<string, number>();
    for (const p of scores) {
      if (!scoreMap.has(p.kelasId)) {
        scoreMap.set(p.kelasId, p.score);
      }
    }

    let totalSks = 0;
    let totalBobotXNilai = 0;
    let gradedSks = 0;

    const matkulList = classes.map((k, idx) => {
      const mkName = k.mataKuliah?.nama || 'Mata Kuliah';
      const mkKode = k.mataKuliah?.kode || `MK-${idx + 1}`;
      const sks = k.mataKuliah?.sks || 3;
      totalSks += sks;

      const hasScore = scoreMap.has(k.id);
      let grade = '-';
      let scoreVal = 0;

      if (hasScore && scoreMap.get(k.id)! > 0) {
        scoreVal = scoreMap.get(k.id)!;
        const conv = scoreToGrade(scoreVal);
        grade = conv.grade;
        totalBobotXNilai += conv.point * sks;
        gradedSks += sks;
      }

      return {
        nomor: idx + 1,
        nama: mkName,
        kode: mkKode,
        sks: sks,
        grade: grade,
        score: scoreVal,
      };
    });

    const ips = gradedSks > 0 ? parseFloat((totalBobotXNilai / gradedSks).toFixed(2)) : 0.0;

    const semesterData = [
      {
        judul: 'Semester Satu',
        tahunAjaran: 'Ganjil Tahun Ajaran 2026/2027',
        ips: ips,
        totalSks: totalSks,
        matkul: matkulList,
      },
    ];

    return res.status(200).json({
      success: true,
      data: semesterData,
      studentName: targetStudentName,
      updated_at: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[NILAI-SEMESTER ERROR]:', err);
    return res.status(500).json({ success: false, error: err?.message || err });
  }
});

export default router;
