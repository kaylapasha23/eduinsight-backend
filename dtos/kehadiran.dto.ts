import { z } from 'zod';

export const CreateKehadiranSchema = z.object({
  class_id: z.string().optional(),
  kelasId: z.string().optional(),
  student_name: z.string().optional(),
  studentName: z.string().optional(),
  name: z.string().optional(),
  nim: z.string().optional(),
  status: z.enum(['Hadir', 'Izin', 'Sakit', 'Alpa', 'Alpha']).optional().default('Hadir'),
  nomor: z.coerce.number().optional().default(1),
  topik: z.string().optional().default('Materi Perkuliahan'),
  tanggal: z.string().optional(),
  date: z.string().optional(),
  matkul_name: z.string().optional(),
});

export type CreateKehadiranDTO = z.infer<typeof CreateKehadiranSchema>;

export const KehadiranQuerySchema = z.object({
  class_id: z.union([z.string(), z.number()]).optional(),
  kelasId: z.union([z.string(), z.number()]).optional(),
  nomor: z.union([z.string(), z.number()]).optional(),
  meeting: z.union([z.string(), z.number()]).optional(),
  view: z.string().optional(),
});

export type KehadiranQueryDTO = z.infer<typeof KehadiranQuerySchema>;
