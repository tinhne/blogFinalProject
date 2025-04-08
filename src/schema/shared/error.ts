import { z } from 'zod';
import fromZodSchema from 'zod-to-json-schema';

export const errorResponseSchema = z.object({
  statusCode: z.number(),
  error: z.string(),
  message: z.string(),
});

export const errorResponseJsonSchema = fromZodSchema(errorResponseSchema, {
  target: 'openApi3',
});

export const commonErrorResponses = {
  400: errorResponseJsonSchema,
  401: errorResponseJsonSchema,
  403: errorResponseJsonSchema,
  404: errorResponseJsonSchema,
  409: errorResponseJsonSchema,
  500: errorResponseJsonSchema,
};
