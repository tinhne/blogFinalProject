// modules/category/routes.ts
import { FastifyInstance } from 'fastify';

import {
  categoryCreateJsonSchema,
  categoryUpdateJsonSchema,
  categoryResponseJsonSchema,
  categoryListResponseJsonSchema,
  errorResponseJsonSchema,
  messageResponseJsonSchema,
} from '@app/schema';

import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

export default async function categoryRoutes(fastify: FastifyInstance) {
  const categoryControllerInstance = new CategoryController(new CategoryService(fastify.prisma));

  // Create category (admin only)
  fastify.post(
    '/',
    {
      schema: {
        tags: ['Category'],
        description: 'Create a category (admin only)',
        body: categoryCreateJsonSchema,
        response: {
          200: categoryResponseJsonSchema,
          400: errorResponseJsonSchema,
          401: errorResponseJsonSchema,
          403: errorResponseJsonSchema,
          500: errorResponseJsonSchema,
        },
      },
      onRequest: [fastify.authenticate, fastify.authenticateAdmin],
    },
    categoryControllerInstance.create
  );

  // Update category (admin only)
  fastify.put(
    '/:id',
    {
      schema: {
        tags: ['Category'],
        description: 'Update a category (admin only)',
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
        body: categoryUpdateJsonSchema,
        response: {
          200: categoryResponseJsonSchema,
          400: errorResponseJsonSchema,
          401: errorResponseJsonSchema,
          403: errorResponseJsonSchema,
          404: errorResponseJsonSchema,
          500: errorResponseJsonSchema,
        },
      },
      onRequest: [fastify.authenticate, fastify.authenticateAdmin],
    },
    categoryControllerInstance.update
  );

  // Get all categories
  fastify.get(
    '/',
    {
      schema: {
        tags: ['Category'],
        description: 'Get all categories',
        response: {
          200: categoryListResponseJsonSchema,
          500: errorResponseJsonSchema,
        },
      },
    },
    categoryControllerInstance.getAll
  );

  // Get category by ID
  fastify.get(
    '/:id',
    {
      schema: {
        tags: ['Category'],
        description: 'Get category by ID',
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
        response: {
          200: categoryResponseJsonSchema,
          404: errorResponseJsonSchema,
          500: errorResponseJsonSchema,
        },
      },
    },
    categoryControllerInstance.getById
  );

  // Delete category (admin only)
  fastify.delete(
    '/:id',
    {
      schema: {
        tags: ['Category'],
        description: 'Delete a category (admin only)',
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
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
      onRequest: [fastify.authenticate, fastify.authenticateAdmin],
    },
    categoryControllerInstance.delete
  );
}
