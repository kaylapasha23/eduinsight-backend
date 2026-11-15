import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenAI } from '@google/genai';
import { prisma } from '../data/database.js';
import { AIEvaluationResult } from '../dtos/evaluator.dto.js';
import { Logger } from '../utils/logger.js';

function getGenAI() {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
}

// ─────────────────────────────────────────────
// 1. Ambil data akademik dari database
// ─────────────────────────────────────────────
export async function fetchAcademicData(studentId: string, classId: string) {
  // Cari user (bisa by id, NIM, atau name)
  const user = await (prisma as any).user.findFirst({
    where: {
      OR: [
        { id: studentId },
        { nim: studentId },
        { name: studentId },
        { name: { contains: studentId.split(' ')[0] } },
      ],
    },
  });

  if (!user) {
    throw new Error(`Mahasiswa dengan id/NIM/nama "${studentId}" tidak ditemukan.`);
  }

  // Cari kelas:
  // 1. Coba by id langsung
  let kelas = await (prisma as any).kelas.findUnique({
    where: { id: classId },
    include: { mataKuliah: true },
  });

  // 2. Jika belum ketemu, cari by kodeGabung atau nama mata kuliah
  if (!kelas) {
    const cleanName = classId.split(' - ')[0].trim();
    kelas = await (prisma as any).kelas.findFirst({
      where: {
        OR: [
          { id: classId },
          { kodeGabung: classId },
          { kodeGabung: cleanName },
          {
            mataKuliah: {
              nama: { contains: cleanName },
            },
          },
          {
            ruangan: { contains: classId },
          },
        ],
      },
      include: { mataKuliah: true },
    });
  }

  // 3. Fallback: ambil kelas pertama jika tetap tidak ketemu
  if (!kelas) {
    kelas = await (prisma as any).kelas.findFirst({
      include: { mataKuliah: true },
    });
  }

  if (!kelas) {
    throw new Error(`Kelas "${classId}" tidak ditemukan.`);
  }

  const userFirstName = user.name.split(' ')[0];

  // Ambil kehadiran di kelas tersebut untuk mahasiswa
  let kehadiran = await (prisma as any).kehadiran.findMany({
    where: {
      kelasId: kelas.id,
      studentName: { contains: userFirstName },
    },
  });

  // Fallback: jika di kelas ini belum ada rekam presensi, cari presensi mahasiswa di kelas lain sebagai acuan
  if (kehadiran.length === 0) {
    kehadiran = await (prisma as any).kehadiran.findMany({
      where: {
        studentName: { contains: userFirstName },
      },
    });
  }

  // Ambil penilaian (tugas/kuis/UTS/UAS)
  let penilaian = await (prisma as any).penilaian.findMany({
    where: {
      kelasId: kelas.id,
      studentName: { contains: userFirstName },
    },
  });

  // Fallback: jika di kelas ini belum ada penilaian, cari penilaian mahasiswa di kelas lain
  if (penilaian.length === 0) {
    penilaian = await (prisma as any).penilaian.findMany({
      where: {
        studentName: { contains: userFirstName },
      },
    });
  }

  return { user, kelas, kehadiran, penilaian };
}

// ─────────────────────────────────────────────
// 2. Hitung statistik dari data mentah
// ─────────────────────────────────────────────
function computeStats(kehadiran: any[], penilaian: any[]) {
  const totalPertemuan = kehadiran.length;
  const hadirCount = kehadiran.filter((k) => k.status === 'Hadir').length;
  const persentaseKehadiran =
    totalPertemuan > 0 ? Math.round((hadirCount / totalPertemuan) * 100) : 0;

  const nilaiList = penilaian.map((p) => p.score as number);
  const rataRataNilai =
    nilaiList.length > 0
      ? Math.round(nilaiList.reduce((a, b) => a + b, 0) / nilaiList.length)
      : 0;

  const statusKehadiran = kehadiran.map((k) => ({ topik: k.topik, status: k.status, tanggal: k.tanggal }));
  const detailPenilaian = penilaian.map((p) => ({ taskName: p.taskName, score: p.score }));

  return { totalPertemuan, hadirCount, persentaseKehadiran, rataRataNilai, statusKehadiran, detailPenilaian };
}

// ─────────────────────────────────────────────
// 3. Susun prompt untuk Gemini
// ─────────────────────────────────────────────
function buildPrompt(
  user: any,
  kelas: any,
  stats: ReturnType<typeof computeStats>,
  lecturerNote?: string,
): string {
  const kehadiranDetail = stats.statusKehadiran
    .map((k) => `  - ${k.tanggal}: ${k.topik} → ${k.status}`)
    .join('\n');

  const nilaiDetail = stats.detailPenilaian
    .map((p) => `  - ${p.taskName}: ${p.score}`)
    .join('\n');

  const catatanDosen = lecturerNote
    ? `\nCatatan tambahan dari dosen: "${lecturerNote}"`
    : '';

  return `Kamu adalah asisten akademik AI untuk sistem EduInsight.
Analisis performa mahasiswa berikut dan kembalikan HANYA objek JSON (tanpa teks lain, tanpa markdown).

Data Mahasiswa:
  Nama        : ${user.name}
  NIM         : ${user.nim || '-'}
  Kelas       : ${kelas.id} (Kode: ${kelas.kodeGabung || kelas.id})

Data Kehadiran (${stats.hadirCount}/${stats.totalPertemuan} pertemuan hadir = ${stats.persentaseKehadiran}%):
${kehadiranDetail || '  (tidak ada data kehadiran)'}

Data Penilaian (rata-rata: ${stats.rataRataNilai}):
${nilaiDetail || '  (tidak ada data penilaian)'}
${catatanDosen}

Kembalikan JSON dengan format TEPAT berikut (tidak ada key lain):
{
  "status_risiko": "Aman" | "Perlu Perhatian" | "Berisiko",
  "ringkasan_analisis": "<string: analisis tren nilai dan kehadiran>",
  "rekomendasi": "<string: saran belajar / intervensi dosen>"
}

Aturan status_risiko:
- "Aman"           : kehadiran >= 80% DAN rata-rata nilai >= 75
- "Perlu Perhatian": kehadiran >= 70% ATAU rata-rata nilai >= 60 (tapi tidak keduanya memenuhi Aman)
- "Berisiko"       : kehadiran < 70% ATAU rata-rata nilai < 60`;
}

// ─────────────────────────────────────────────
// 4. Panggil Gemini API
// ─────────────────────────────────────────────
async function callGeminiAI(prompt: string): Promise<AIEvaluationResult> {
  const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

  Logger.info('[AI Evaluator] Memanggil Gemini AI...', { model });

  const ai = getGenAI();
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      temperature: 0.3,
    },
  });

  const rawText = response.text ?? '';
  Logger.debug('[AI Evaluator] Raw response dari Gemini', rawText.slice(0, 300));

  // Bersihkan markdown code fence jika ada
  const cleaned = rawText.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleaned) as AIEvaluationResult;

  // Validasi field
  const validStatus = ['Aman', 'Perlu Perhatian', 'Berisiko'];
  if (!validStatus.includes(parsed.status_risiko)) {
    parsed.status_risiko = 'Perlu Perhatian';
  }

  return parsed;
}

// ─────────────────────────────────────────────
// 5. Main service: jalankan seluruh pipeline
// ─────────────────────────────────────────────
export async function runEvaluatorPipeline(
  studentId: string,
  classId: string,
  lecturerNote?: string,
) {
  // Step 1 – ambil data
  const { user, kelas, kehadiran, penilaian } = await fetchAcademicData(studentId, classId);

  // Step 2 – hitung statistik
  const stats = computeStats(kehadiran, penilaian);

  // Step 3 – susun prompt
  const prompt = buildPrompt(user, kelas, stats, lecturerNote);

  // Step 4 – panggil AI
  const aiResult = await callGeminiAI(prompt);

  // Step 5 – return semua data untuk disimpan di controller
  return {
    user,
    kelas,
    stats,
    aiResult,
  };
}
