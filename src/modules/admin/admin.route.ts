import { FastifyInstance } from 'fastify';

import {
  categoryCreateJsonSchema,
  categoryResponseJsonSchema,
  categoryUpdateJsonSchema,
  commentResponseJsonSchema,
  commentUpdateJsonSchema,
  errorResponseJsonSchema,
  messageResponseJsonSchema,
} from '@app/schema';
import { userListResponseJsonSchema } from '@app/schema/admin.schema';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

export default async function adminRoutes(fastify: FastifyInstance) {
  const adminControllerInstance = new AdminController(new AdminService(fastify.prisma));

  // Get all users
  fastify.get(
    '/users',
    {
      schema: {
        tags: ['Admin'],
        description: 'Get all users',
        response: {
          200: userListResponseJsonSchema,
          401: errorResponseJsonSchema,
          500: errorResponseJsonSchema,
        },
      },
      onRequest: [fastify.authenticateAdmin],
    },
    adminControllerInstance.index
  );

  // Get dashboard data
  fastify.get(
    '/dashboard',
    {
      schema: {
        tags: ['Admin'],
        description: 'Get dashboard data',
        response: {
          200: {
            type: 'object',
            properties: {
              totalUsers: { type: 'number' },
              totalPosts: { type: 'number' },
              totalComments: { type: 'number' },
            },
          },
          401: errorResponseJsonSchema,
          500: errorResponseJsonSchema,
        },
      },
      onRequest: [fastify.authenticateAdmin],
    },
    adminControllerInstance.dashboard
  );

  fastify.post(
    '/categories',
    {
      schema: {
        tags: ['Admin'],
        description: 'Create a category',
        body: categoryCreateJsonSchema,
        response: {
          200: categoryResponseJsonSchema,
          400: errorResponseJsonSchema,
          401: errorResponseJsonSchema,
          403: errorResponseJsonSchema,
          500: errorResponseJsonSchema,
        },
      },
      onRequest: [fastify.authenticateAdmin],
    },
    adminControllerInstance.createCategory
  );

  fastify.put(
    '/categories/:id',
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
      onRequest: [fastify.authenticateAdmin],
    },
    adminControllerInstance.updateCategory
  );

  fastify.delete(
    '/categories/:id',
    {
      schema: {
        tags: ['Category'],
        description: 'Delete a category',
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
      onRequest: [fastify.authenticateAdmin],
    },
    adminControllerInstance.deleteCategory
  );

  fastify.delete(
    'comment/:id',
    {
      schema: {
        tags: ['Comment'],
        description: 'Delete a comment',
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
        response: {
          200: messageResponseJsonSchema,
          401: errorResponseJsonSchema,
          403: errorResponseJsonSchema,
          404: errorResponseJsonSchema,
          500: errorResponseJsonSchema,
        },
      },
      onRequest: [fastify.authenticateAdmin],
    },
    adminControllerInstance.delete
  );

  fastify.put(
    'comment/:id',
    {
      schema: {
        tags: ['Comment'],
        description: 'Update a comment',
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
        body: commentUpdateJsonSchema,
        response: {
          200: commentResponseJsonSchema,
          400: errorResponseJsonSchema,
          401: errorResponseJsonSchema,
          403: errorResponseJsonSchema,
          404: errorResponseJsonSchema,
          500: errorResponseJsonSchema,
        },
      },
      onRequest: [fastify.authenticateAdmin],
    },
    adminControllerInstance.update
  );
}
