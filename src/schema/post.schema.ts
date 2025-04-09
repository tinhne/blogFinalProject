import { z } from 'zod';
import fromZodSchema from 'zod-to-json-schema';

export const createPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  categoryIds: z.array(z.string()).optional(), // Gán category
});

export const updatePostSchema = z.object({
  title: z.string().min(3).optional(),
  content: z.string().min(10).optional(),
  categoryIds: z.array(z.string()).optional(),
  deletedImageIds: z.array(z.string()).optional(), // Danh sách ảnh muốn xóa
});

export const createPostJsonSchema = fromZodSchema(createPostSchema, 'CreatePostInput');
export const updatePostJsonSchema = fromZodSchema(updatePostSchema, 'UpdatePostInput');

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
