import { z } from 'zod';

export const CreatePenilaianSchema = z.object({
  class_id: z.string().optional(),
  kelasId: z.string().optional(),
  student_name: z.string().optional(),
  studentName: z.string().optional(),
  name: z.string().optional(),
  task_name: z.string().optional(),
  taskName: z.string().optional(),
  score: z.coerce.number().min(0, 'Nilai minimal 0').max(100, 'Nilai maksimal 100').optional().default(80),
}).refine((data) => Boolean(data.student_name || data.studentName || data.name), {
  message: 'Nama mahasiswa wajib diisi',
  path: ['student_name'],
});

export type CreatePenilaianDTO = z.infer<typeof CreatePenilaianSchema>;
