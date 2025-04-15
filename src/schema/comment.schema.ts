import { z } from 'zod';
import fromZodSchema from 'zod-to-json-schema';

import { successWrapperSchema } from './shared';

// Schema tạo comment mới
export const commentCreateSchema = z.object({
  content: z.string().min(1).max(1000),
  postId: z.string(),
});

const zQueryNumber = z
  .union([z.string(), z.number()])
  .transform((val) => (typeof val === 'string' ? parseInt(val, 10) : val))
  .pipe(z.number().int().min(1));

export const paginationQuerySchema = z.object({
  page: zQueryNumber.optional().default(1),
  perPage: zQueryNumber.optional().default(10),
});

// Schema cập nhật comment

export const commentUpdateSchema = z.object({
  content: z.string().min(1).max(1000),
});

// Schema response cho một comment
export const commentResponseSchema = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  author: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    avatarUrl: z.string().url().optional(),
  }),
  post: z.object({
    id: z.string(),
    title: z.string(),
  }),
});

// Schema danh sách comment với phân trang
export const commentListResponseSchema = z.object({
  comments: z.array(commentResponseSchema),
  meta: z.object({
    totalCount: z.number(),
    currentPage: z.number(),
    totalPages: z.number(),
    perPage: z.number().min(1),
  }),
});

// Bọc trong successWrapper
const commentSuccessResponseSchema = successWrapperSchema(commentResponseSchema);
const commentListSuccessResponseSchema = successWrapperSchema(commentListResponseSchema);

// JSON Schema cho Swagger
export const commentCreateJsonSchema = fromZodSchema(commentCreateSchema, { target: 'openApi3' });
export const commentUpdateJsonSchema = fromZodSchema(commentUpdateSchema, { target: 'openApi3' });
export const commentResponseJsonSchema = fromZodSchema(commentSuccessResponseSchema, { target: 'openApi3' });
export const commentListResponseJsonSchema = fromZodSchema(commentListSuccessResponseSchema, { target: 'openApi3' });
export const getUserCommentsQueryJsonSchema = fromZodSchema(paginationQuerySchema, { target: 'openApi3' });

// TypeScript types
export type CommentCreateInput = z.infer<typeof commentCreateSchema>;
export type CommentUpdateInput = z.infer<typeof commentUpdateSchema>;
export type CommentResponse = z.infer<typeof commentResponseSchema>;
export type CommentListResponse = z.infer<typeof commentListResponseSchema>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
