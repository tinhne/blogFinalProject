import { z } from 'zod';
import fromZodSchema from 'zod-to-json-schema';

import { dateOfBirthSchema, passwordSchema, genderEnum, successWrapperSchema } from './shared';

// User update schema
export const userUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  avatarUrl: z.string().url().optional(),
  dateOfBirth: dateOfBirthSchema,
  gender: genderEnum.optional(),
  address: z.string().optional(),
});

// Change password schema
export const userChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: passwordSchema,
});

// User profile response schema
export const userProfileResponseSchema = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  avatarUrl: z.string().optional(),
  dateOfBirth: dateOfBirthSchema,
  gender: genderEnum.optional(),
  address: z.string().optional(),
});

// Login sessions response schema
export const loginSessionsResponseSchema = z.array(
  z.object({
    id: z.string().uuid(),
    userAgent: z.string(),
    ipAddress: z.string(),
    createdAt: z.string().datetime(),
    lastUsedAt: z.string().datetime().optional(),
  })
);
// Bọc schema trong một successWrapperSchema
const userProfileSuccessSchema = successWrapperSchema(userProfileResponseSchema);

// JSON Schema for Swagger
export const userUpdateJsonSchema = fromZodSchema(userUpdateSchema, { target: 'openApi3' });
export const userChangePasswordJsonSchema = fromZodSchema(userChangePasswordSchema, { target: 'openApi3' });
export const userProfileResponseJsonSchema = fromZodSchema(userProfileSuccessSchema, { target: 'openApi3' });
export const loginSessionsResponseJsonSchema = fromZodSchema(loginSessionsResponseSchema, { target: 'openApi3' });

// TypeScript types
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type UserChangePasswordInput = z.infer<typeof userChangePasswordSchema>;
export type UserProfileResponse = z.infer<typeof userProfileResponseSchema>;
export type LoginSessionsResponse = z.infer<typeof loginSessionsResponseSchema>;
