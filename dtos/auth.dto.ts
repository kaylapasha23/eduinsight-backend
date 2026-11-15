import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email('Format email tidak valid').trim().toLowerCase().nonempty('Email wajib diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  name: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().nonempty('Email wajib diisi'),
  password: z.string().nonempty('Password wajib diisi'),
});

export type LoginDTO = z.infer<typeof LoginSchema>;

export const ResetPasswordSchema = z
  .object({
    email: z.string().email('Format email tidak valid').trim().toLowerCase().nonempty('Email wajib diisi'),
    newPassword: z.string().min(6, 'Password baru minimal 6 karakter'),
    confirmPassword: z.string().min(6, 'Konfirmasi password minimal 6 karakter'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Konfirmasi password tidak cocok dengan password baru',
    path: ['confirmPassword'],
  });

export type ResetPasswordDTO = z.infer<typeof ResetPasswordSchema>;
