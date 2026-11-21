import { z } from 'zod';

export function validateJudulTugas(title: string): { valid: boolean; message?: string } {
  const trimmed = (title || '').trim();
  if (!trimmed) {
    return { valid: false, message: 'Judul tugas wajib diisi.' };
  }
  if (trimmed.length < 4) {
    return { valid: false, message: 'Judul tugas minimal 4 karakter.' };
  }
  if (trimmed.length > 150) {
    return { valid: false, message: 'Judul tugas maksimal 150 karakter.' };
  }
  // Cek karakter sama berulang (contoh: aaaaa, 11111, .....)
  if (/^(.)\1+$/i.test(trimmed)) {
    return {
      valid: false,
      message: 'Judul tugas tidak boleh berupa karakter berulang sembarang (contoh: aaaaa).',
    };
  }
  // Cek jumlah variasi karakter unik (misal: "aaaaa", "ababab")
  const uniqueChars = new Set(trimmed.toLowerCase().replace(/\s+/g, ''));
  if (uniqueChars.size < 3) {
    return {
      valid: false,
      message: 'Judul tugas harus bermakna dan jelas (tidak boleh sembarang).',
    };
  }
  // Harus mengandung setidaknya satu huruf alfabet
  if (!/[a-zA-Z]/.test(trimmed)) {
    return {
      valid: false,
      message: 'Judul tugas harus mengandung huruf alfabet.',
    };
  }
  return { valid: true };
}

export const CreateTugasSchema = z.object({
  class_id: z.string().optional(),
  kelasId: z.string().optional(),
  title: z.string().optional(),
  judul: z.string().optional(),
  description: z.string().optional(),
  deskripsi: z.string().optional(),
  deadline: z.string().optional(),
  deadline_text: z.string().optional(),
  category: z.enum(['segera', 'selesai', 'terlambat']).optional().default('segera'),
  attachment_name: z.string().nullable().optional(),
}).superRefine((data, ctx) => {
  const judul = data.title || data.judul || '';
  const result = validateJudulTugas(judul);
  if (!result.valid) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: result.message || 'Judul tugas tidak valid.',
      path: ['title'],
    });
  }
});

export type CreateTugasDTO = z.infer<typeof CreateTugasSchema>;

export const UpdateTugasCategorySchema = z.object({
  category: z.enum(['segera', 'selesai', 'terlambat']).optional(),
  title: z.string().optional(),
  judul: z.string().optional(),
  description: z.string().optional(),
  deskripsi: z.string().optional(),
  deadline: z.string().optional(),
  deadline_text: z.string().optional(),
  attachment_name: z.string().nullable().optional(),
});

export type UpdateTugasCategoryDTO = z.infer<typeof UpdateTugasCategorySchema>;
