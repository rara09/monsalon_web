// schemas/loginSchema.ts
import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Minimum 2 caractères')
    .max(100, 'Maximum 100 caractères'),
  lastName: z
    .string()
    .min(2, 'Minimum 2 caractères')
    .max(100, 'Maximum 100 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
});

export type RegisterForm = z.infer<typeof registerSchema>;
