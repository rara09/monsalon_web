// schemas/loginSchema.ts
import { z } from 'zod';

export const clientSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Minimum 2 caractères')
    .max(100, 'Maximum 100 caractères'),
  lastName: z
    .string()
    .min(2, 'Minimum 2 caractères')
    .max(100, 'Maximum 100 caractères'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Numéro de téléphone invalide'),
  // email: z.string().email('Email invalide'),
});

export type ClientForm = z.infer<typeof clientSchema>;
