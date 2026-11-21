import { z } from 'zod';

export const NilaiPengumpulanSchema = z.object({
  nilai: z.union([
    z.number().min(0, 'Nilai minimal 0').max(100, 'Nilai maksimal 100'),
    z.string().regex(/^\d+(\.\d+)?$/, 'Nilai harus berupa angka').transform(Number).pipe(
      z.number().min(0, 'Nilai minimal 0').max(100, 'Nilai maksimal 100')
    ),
  ]),
  catatan: z.string().optional(),
});

export type NilaiPengumpulanDTO = z.infer<typeof NilaiPengumpulanSchema>;
