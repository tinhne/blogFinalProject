// user.schema.ts
import { z } from 'zod';
import fromZodSchema from 'zod-to-json-schema';

// User update schema
export const userUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  avatarUrl: z.string().url().optional(),
  dateOfBirth: z.string().datetime().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'UNSPECIFIED']).optional(),
  address: z.string().optional(),
});

// Change password schema
export const userChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(16, { message: 'Password must not exceed 16 characters' })
    .regex(/[a-z][0-9]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: 'Password must contain at least one special character' }),
});

// User profile response schema
export const userProfileResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  avatarUrl: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'UNSPECIFIED']),
  address: z.string().optional(),
  isVerified: z.boolean(),
  isAdmin: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
  _count: z
    .object({
      posts: z.number(),
      comments: z.number(),
    })
    .optional(),
});

// User posts response schema
// export const userPostsResponseSchema = z.object({
//   posts: z.array(
//     z.object({
//       id: z.string().uuid(),
//       title: z.string(),
//       slug: z.string(),
//       excerpt: z.string(),
//       status: z.enum(['PUBLIC', 'PRIVATE', 'DRAFT']),
//       featuredImage: z.string().url().optional(),
//       viewCount: z.number(),
//       createdAt: z.string().datetime(),
//       updatedAt: z.string().datetime(),
//       category: z
//         .object({
//           id: z.string().uuid(),
//           name: z.string(),
//           slug: z.string(),
//         })
//         .optional(),
//       _count: z.object({
//         comments: z.number(),
//       }),
//     })
//   ),
//   meta: z.object({
//     totalCount: z.number(),
//     currentPage: z.number(),
//     totalPages: z.number(),
//     perPage: z.number(),
//   }),
// });

// User comments response schema
// export const userCommentsResponseSchema = z.object({
//   comments: z.array(
//     z.object({
//       id: z.string().uuid(),
//       content: z.string(),
//       status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
//       createdAt: z.string().datetime(),
//       updatedAt: z.string().datetime(),
//       post: z.object({
//         id: z.string().uuid(),
//         title: z.string(),
//         slug: z.string(),
//       }),
//     })
//   ),
//   meta: z.object({
//     totalCount: z.number(),
//     currentPage: z.number(),
//     totalPages: z.number(),
//     perPage: z.number(),
//   }),
// });

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
const successWrapperSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    statusCode: z.number(),
    data: dataSchema,
    message: z.string().optional(),
  });
const userProfileSuccessSchema = successWrapperSchema(userProfileResponseSchema);

// JSON Schema for Swagger
export const userUpdateJsonSchema = fromZodSchema(userUpdateSchema, { target: 'openApi3' });
export const userChangePasswordJsonSchema = fromZodSchema(userChangePasswordSchema, { target: 'openApi3' });
export const userProfileResponseJsonSchema = fromZodSchema(userProfileSuccessSchema, { target: 'openApi3' });
// export const userPostsResponseJsonSchema = fromZodSchema(userPostsResponseSchema, { target: 'openApi3' });
// export const userCommentsResponseJsonSchema = fromZodSchema(userCommentsResponseSchema, { target: 'openApi3' });
export const loginSessionsResponseJsonSchema = fromZodSchema(loginSessionsResponseSchema, { target: 'openApi3' });

// TypeScript types
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type UserChangePasswordInput = z.infer<typeof userChangePasswordSchema>;
export type UserProfileResponse = z.infer<typeof userProfileResponseSchema>;
// export type UserPostsResponse = z.infer<typeof userPostsResponseSchema>;
// export type UserCommentsResponse = z.infer<typeof userCommentsResponseSchema>;
export type LoginSessionsResponse = z.infer<typeof loginSessionsResponseSchema>;
