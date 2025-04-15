import { z } from 'zod';
import fromZodSchema from 'zod-to-json-schema';

import { dateOfBirthSchema, genderEnum } from './shared';

export const userResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  avatarUrl: z.string().url().nullable().optional(),
  dateOfBirth: dateOfBirthSchema,
  gender: genderEnum,
  address: z.string(),
  isVerified: z.boolean(),
  createdAt: z.string().datetime(), // ISO string từ Prisma
});
export const userListResponseSchema = z.array(userResponseSchema);

export const dashboardResponseSchema = z.object({
  totalUsers: z.number(),
  totalPosts: z.number(),
  totalComments: z.number(),
});
export const dashboardResponseJsonSchema = fromZodSchema(dashboardResponseSchema, { target: 'openApi3' });
export const userResponseJsonSchema = fromZodSchema(userResponseSchema, { target: 'openApi3' });

export const userListResponseJsonSchema = fromZodSchema(userListResponseSchema, { target: 'openApi3' });

export type UserResponse = z.infer<typeof userResponseSchema>;
export type UserListResponse = z.infer<typeof userListResponseSchema>;
export type DashboardResponse = z.infer<typeof dashboardResponseSchema>;
