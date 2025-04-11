import { FastifyInstance } from 'fastify';

import {
  postUpdateJsonSchema,
  postResponseJsonSchema,
  postListResponseJsonSchema,
  errorResponseJsonSchema,
  messageResponseJsonSchema,
  postSearchQueryJsonSchema,
} from '@app/schema';

import { PostController } from './post.controller';
import { PostService } from './post.service';

export default async function blogRoutes(fastify: FastifyInstance) {
  const controller = new PostController(new PostService(fastify.prisma));

  // Create post
  fastify.post(
    '/draft',
    {
      schema: {
        tags: ['Blog'],
        description: 'Create a new draft post (empty post)',
        response: {
          200: postResponseJsonSchema,
          401: errorResponseJsonSchema,
          500: errorResponseJsonSchema,
        },
      },
      onRequest: [fastify.authenticate],
    },
    controller.createDraft
  );
  // Update post
  fastify.put(
    '/:id',
    {
      schema: {
        tags: ['Blog'],
        description: 'Update post by ID',
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
        body: postUpdateJsonSchema,
        response: {
          200: postResponseJsonSchema,
          400: errorResponseJsonSchema,
          401: errorResponseJsonSchema,
          403: errorResponseJsonSchema,
          404: errorResponseJsonSchema,
          500: errorResponseJsonSchema,
        },
      },
      onRequest: [fastify.authenticate],
    },
    controller.update
  );

  // Get post by ID
  fastify.get(
    '/:id',
    {
      schema: {
        tags: ['Blog'],
        description: 'Get post by ID',
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
        response: {
          200: postResponseJsonSchema,
          404: errorResponseJsonSchema,
          500: errorResponseJsonSchema,
        },
      },
      onRequest: [fastify.authenticate],
    },
    controller.getById
  );

  // Get all posts
  fastify.get(
    '/',
    {
      schema: {
        tags: ['Blog'],
        description: 'Get all posts (with optional pagination and category filter)',
        querystring: postSearchQueryJsonSchema,
        response: {
          200: postListResponseJsonSchema,
          400: errorResponseJsonSchema,
          500: errorResponseJsonSchema,
        },
      },
    },
    controller.getAll
  );

  // Get posts by current user
  fastify.get(
    '/user/me',
    {
      schema: {
        tags: ['Blog'],
        description: "Get current user's posts",
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'string', default: '1' },
            perPage: { type: 'string', default: '10' },
          },
        },
        response: {
          200: postListResponseJsonSchema,
          401: errorResponseJsonSchema,
          500: errorResponseJsonSchema,
        },
      },
      onRequest: [fastify.authenticate],
    },
    controller.getUserPosts
  );

  // Delete post
  fastify.delete(
    '/:id',
    {
      schema: {
        tags: ['Blog'],
        description: 'Delete post by ID',
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
      onRequest: [fastify.authenticate],
    },
    controller.delete
  );
}
