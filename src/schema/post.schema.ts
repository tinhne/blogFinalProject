import { z } from 'zod';
import fromZodSchema from 'zod-to-json-schema';

import { postStatusEnum, successWrapperSchema, postVisibilityEnum } from './shared';

// Schema tạo bài viết mới
export const postCreateSchema = z.object({
  title: z.string().min(3).max(255),
  content: z.string().min(10),
  status: postStatusEnum.default('DRAFT'),
  visibility: postVisibilityEnum.default('PRIVATE'),
  categoryIds: z.array(z.string()).optional(),
});
const createPostSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).default('PRIVATE'),
  categoryIds: z.array(z.string()).optional(),
});

// Schema cập nhật bài viết
export const postUpdateSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  content: z.string().min(10).optional(),
  status: postStatusEnum.optional(),
  visibility: postVisibilityEnum.optional(),
  categoryIds: z.array(z.string()).optional(),
});

// Schema response cho một bài viết
export const postResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  status: postStatusEnum,
  visibility: postVisibilityEnum,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  author: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    avatarUrl: z.string().url().optional(),
  }),
  categories: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
});

// Schema danh sách bài viết với phân trang
export const postListResponseSchema = z.object({
  posts: z.array(postResponseSchema),
  meta: z.object({
    totalCount: z.number(),
    currentPage: z.number(),
    totalPages: z.number(),
    perPage: z.number(),
  }),
});

export const postSearchQuerySchema = z.object({
  query: z.string().optional(),
  categoryId: z.string().optional(),
  authorId: z.string().optional(),
  createdFrom: z.string().datetime().optional(),
  createdTo: z.string().datetime().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

// Bọc trong successWrapper
const postSuccessResponseSchema = successWrapperSchema(postResponseSchema);
const postListSuccessResponseSchema = successWrapperSchema(postListResponseSchema);

// JSON Schema cho Swagger
export const postCreateJsonSchema = fromZodSchema(postCreateSchema, { target: 'openApi3' });
export const postUpdateJsonSchema = fromZodSchema(postUpdateSchema, { target: 'openApi3' });
export const postResponseJsonSchema = fromZodSchema(postSuccessResponseSchema, { target: 'openApi3' });
export const postListResponseJsonSchema = fromZodSchema(postListSuccessResponseSchema, { target: 'openApi3' });
export const postSearchQueryJsonSchema = fromZodSchema(postSearchQuerySchema, { target: 'openApi3' });

// TypeScript types
export type PostCreateInput = z.infer<typeof postCreateSchema>;
export type PostUpdateInput = z.infer<typeof postUpdateSchema>;
export type PostResponse = z.infer<typeof postResponseSchema>;
export type PostListResponse = z.infer<typeof postListResponseSchema>;
export type PostSearchQueryInput = z.infer<typeof postSearchQuerySchema>;
export type PostCreateResponse = z.infer<typeof createPostSchema>;
