import { FastifyInstance } from 'fastify';

import { mediaUploadResponseJsonSchema, errorResponseJsonSchema, messageResponseJsonSchema } from '@app/schema';

import { MediaController } from './media.controller';
import { MediaService } from './media.service';

export default async function mediaRoutes(fastify: FastifyInstance) {
  const mediaController = new MediaController(new MediaService(fastify.prisma));

  // Upload 1 image
  fastify.post(
    '/upload',
    {
      schema: {
        tags: ['Media'],
        description: 'Upload a single image for a post',
        consumes: ['multipart/form-data'],
        querystring: {
          type: 'object',
          properties: {
            folder: { type: 'string', enum: ['post'], default: 'post' },
            postId: { type: 'string' },
          },
        },
        response: {
          200: mediaUploadResponseJsonSchema,
          400: errorResponseJsonSchema,
          401: errorResponseJsonSchema,
          500: errorResponseJsonSchema,
        },
      },
      onRequest: [fastify.authenticate],
    },
    mediaController.uploadImage
  );

  // Delete image
  fastify.delete(
    '/:id',
    {
      schema: {
        tags: ['Media'],
        description: 'Delete a post image',
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
        },
        response: {
          200: messageResponseJsonSchema,
          400: errorResponseJsonSchema,
          401: errorResponseJsonSchema,
          403: errorResponseJsonSchema,
          404: errorResponseJsonSchema,
          500: errorResponseJsonSchema,
        },
      },
      onRequest: [fastify.authenticate],
    },
    mediaController.deleteImage
  );
}
