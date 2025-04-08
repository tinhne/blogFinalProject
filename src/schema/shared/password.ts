import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .max(16, { message: 'Password must not exceed 16 characters' })
  .regex(/[a-z]/, { message: 'Must contain a lowercase letter' })
  .regex(/[A-Z]/, { message: 'Must contain an uppercase letter' })
  .regex(/[0-9]/, { message: 'Must contain a number' })
  .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: 'Must contain a special character' });
