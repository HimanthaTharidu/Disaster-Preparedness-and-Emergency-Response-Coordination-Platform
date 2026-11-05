import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email(),
  phoneNumber: z.string().trim().min(7).max(20).regex(/^[+]?[-\d\s().]+$/).optional(),
  password: z.string().min(8),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});
