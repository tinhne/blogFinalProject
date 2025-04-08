import { FastifyInstance } from 'fastify';

import {
  userProfileResponseJsonSchema,
  userUpdateJsonSchema,
  userChangePasswordJsonSchema,
  errorResponseJsonSchema,
  messageResponseJsonSchema,
} from '../../schema';

import { UserController } from './user.controller';
import { UserService } from './user.service';

export default async function userRoutes(fastify: FastifyInstance) {
  const userControllerInstance = new UserController(new UserService(fastify.prisma));

  // Get user profile
  fastify.get(
    '/profile',
    {
      schema: {
        tags: ['User'],
        description: 'Get current user profile',
        response: {
          200: userProfileResponseJsonSchema,
          401: errorResponseJsonSchema,
          404: errorResponseJsonSchema,
          500: errorResponseJsonSchema,
        },
      },
      onRequest: [fastify.authenticate],
    },
    userControllerInstance.show
  );

  // Update user profile
  fastify.put(
    '/profile',
    {
      schema: {
        tags: ['User'],
        summary: 'Update profile',
        description: 'Update user profile',
        body: userUpdateJsonSchema,
        response: {
          200: userProfileResponseJsonSchema,
          400: errorResponseJsonSchema,
          401: errorResponseJsonSchema,
          500: errorResponseJsonSchema,
        },
      },
      onRequest: [fastify.authenticate],
    },
    userControllerInstance.update
  );

  // Change password
  fastify.post(
    '/change-password',
    {
      schema: {
        tags: ['User'],
        description: 'Change user password',
        body: userChangePasswordJsonSchema,
        response: {
          200: messageResponseJsonSchema,
          400: errorResponseJsonSchema,
          401: errorResponseJsonSchema,
          500: errorResponseJsonSchema,
        },
      },
      onRequest: [fastify.authenticate],
    },
    userControllerInstance.changePassword
  );

  // upload avatar
  fastify.post(
    '/avatar',
    {
      schema: {
        tags: ['User'],
        description: 'Upload user avatar',
        response: {
          200: messageResponseJsonSchema,
          400: errorResponseJsonSchema,
          401: errorResponseJsonSchema,
          500: errorResponseJsonSchema,
        },
      },
    },
    userControllerInstance.uploadAvatar
  );
}
