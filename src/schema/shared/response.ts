import { z } from 'zod';

export const successWrapperSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    statusCode: z.number(),
    data: dataSchema,
    message: z.string().optional(),
  });

// Dùng cho các schema có phân trang
export const paginatedWrapperSchema = <T extends z.ZodTypeAny>(itemsSchema: T) =>
  z.object({
    statusCode: z.number(),
    data: z.object({
      items: z.array(itemsSchema),
      meta: z.object({
        totalCount: z.number(),
        currentPage: z.number(),
        totalPages: z.number(),
        perPage: z.number(),
      }),
    }),
    message: z.string().optional(),
  });
