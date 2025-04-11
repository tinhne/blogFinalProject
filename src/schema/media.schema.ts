// schema/media.schema.ts
import { z } from 'zod';
import fromZodSchema from 'zod-to-json-schema';

import { successWrapperSchema } from './shared';

// Schema response cho media upload
export const mediaUploadResponseSchema = z.object({
  url: z.string().url(),
  thumbnail: z.string().url().optional(),
  id: z.string().optional(),
});

// Bọc trong successWrapper
const mediaUploadSuccessResponseSchema = successWrapperSchema(mediaUploadResponseSchema);

export const mediaUploadResponseJsonSchema = fromZodSchema(mediaUploadSuccessResponseSchema, { target: 'openApi3' });

export type MediaUploadResponse = z.infer<typeof mediaUploadResponseSchema>;
