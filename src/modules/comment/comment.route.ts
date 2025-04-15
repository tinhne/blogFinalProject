import { FastifyInstance } from 'fastify';

import {
  commentCreateJsonSchema,
  commentUpdateJsonSchema,
  commentResponseJsonSchema,
  commentListResponseJsonSchema,
  errorResponseJsonSchema,
  messageResponseJsonSchema,
} from '@app/schema';

import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

export default async function commentRoutes(fastify: FastifyInstance) {
  const commentControllerInstance = new CommentController(new CommentService(fastify.prisma));

  // Create comment
  fastify.post(
    '/',
    {
      schema: {
        tags: ['Comment'],
        description: 'Create a comment',
        body: commentCreateJsonSchema,
        response: {
          200: commentResponseJsonSchema,
          400: errorResponseJsonSchema,
          401: errorResponseJsonSchema,
          404: errorResponseJsonSchema,
          500: errorResponseJsonSchema,
        },
      },
      onRequest: [fastify.authenticate],
    },
    commentControllerInstance.create
  );

  // Update comment
  fastify.put(
    '/:id',
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
      onRequest: [fastify.authenticate],
    },
    commentControllerInstance.update
  );

  // Get comments by post ID
  fastify.get(
    '/post/:postId',
    {
      schema: {
        tags: ['Comment'],
        description: 'Get comments by post ID',
        params: {
          type: 'object',
          required: ['postId'],
          properties: {
            postId: { type: 'string' },
          },
        },
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'string', default: '1' },
            perPage: { type: 'string', default: '10' },
          },
        },
        response: {
          200: commentListResponseJsonSchema,
          404: errorResponseJsonSchema,
          500: errorResponseJsonSchema,
        },
      },
    },
    commentControllerInstance.getByPostId
  );

  // Get current user's comments
  fastify.get(
    '/user/me',
    {
      schema: {
        tags: ['Comment'],
        description: 'Get current user comments',
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'string', default: '1' },
            perPage: { type: 'string', default: '10' },
          },
        },
        response: {
          200: commentListResponseJsonSchema,
          401: errorResponseJsonSchema,
          500: errorResponseJsonSchema,
        },
      },
      onRequest: [fastify.authenticate],
    },
    commentControllerInstance.getUserComments
  );

  // Delete comment
  fastify.delete(
    '/:id',
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
      onRequest: [fastify.authenticate],
    },
    commentControllerInstance.delete
  );
}
