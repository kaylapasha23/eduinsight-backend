import { z } from 'zod';

export const CreateClassSchema = z.object({
  name: z.string().nonempty('Nama mata kuliah wajib diisi').min(2, 'Nama mata kuliah minimal 2 karakter').trim(),
  code: z.string().optional(),
  sks: z.coerce.number().min(1).max(6).optional().default(3),
  ruangan: z.string().optional(),
  classRoom: z.string().optional(),
  schedule: z.string().optional(),
  schedule_day: z.string().optional(),
  schedule_time: z.string().optional(),
});

export type CreateClassDTO = z.infer<typeof CreateClassSchema>;

export const ClassQuerySchema = z.object({
  day: z.string().optional(),
});

export type ClassQueryDTO = z.infer<typeof ClassQuerySchema>;
