import { z } from 'zod';

/**
 * Schema untuk POST /api/evaluator/analyze
 * Dosen mengirim student_id (atau NIM), class_id, dan catatan opsional.
 */
export const AnalyzeRequestSchema = z.object({
  student_id: z.string().min(1, 'student_id wajib diisi'),
  class_id: z.string().min(1, 'class_id wajib diisi'),
  lecturer_note: z.string().optional(),
});

export type AnalyzeRequestDTO = z.infer<typeof AnalyzeRequestSchema>;

/**
 * Tipe hasil evaluasi yang dikembalikan AI (expected JSON structure)
 */
export interface AIEvaluationResult {
  status_risiko: 'Aman' | 'Perlu Perhatian' | 'Berisiko';
  ringkasan_analisis: string;
  rekomendasi: string;
}
