import { z } from 'zod';
import fromZodSchema from 'zod-to-json-schema';

import { successWrapperSchema } from './shared';

// Schema tạo category mới
export const categoryCreateSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(200).optional(),
});

// Schema cập nhật category
export const categoryUpdateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  description: z.string().max(200).optional(),
});

// Schema response cho một category
export const categoryResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  _count: z
    .object({
      posts: z.number(),
    })
    .optional(),
});

// Schema danh sách category
export const categoryListResponseSchema = z.array(categoryResponseSchema);

// Bọc trong successWrapper
const categorySuccessResponseSchema = successWrapperSchema(categoryResponseSchema);
const categoryListSuccessResponseSchema = successWrapperSchema(categoryListResponseSchema);

// JSON Schema cho Swagger
export const categoryCreateJsonSchema = fromZodSchema(categoryCreateSchema, { target: 'openApi3' });
export const categoryUpdateJsonSchema = fromZodSchema(categoryUpdateSchema, { target: 'openApi3' });
export const categoryResponseJsonSchema = fromZodSchema(categorySuccessResponseSchema, { target: 'openApi3' });
export const categoryListResponseJsonSchema = fromZodSchema(categoryListSuccessResponseSchema, { target: 'openApi3' });

// TypeScript types
export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
export type CategoryResponse = z.infer<typeof categoryResponseSchema>;
export type CategoryListResponse = z.infer<typeof categoryListResponseSchema>;
