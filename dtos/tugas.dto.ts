import { z } from 'zod';

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
}).refine((data) => Boolean(data.title || data.judul), {
  message: 'Judul tugas wajib diisi',
  path: ['title'],
});

export type CreateTugasDTO = z.infer<typeof CreateTugasSchema>;

export const UpdateTugasCategorySchema = z.object({
  category: z.enum(['segera', 'selesai', 'terlambat']).optional().default('segera'),
});

export type UpdateTugasCategoryDTO = z.infer<typeof UpdateTugasCategorySchema>;
