import { FastifyInstance } from 'fastify';

import { messageResponseJsonSchema, userRegisterJsonSchema, verifyEmailJsonSchema } from '../../schema';

import { AuthController } from './auth.controller';

export default async function authRoute(fastify: FastifyInstance) {
  const authControllerInstance = new AuthController(fastify);

  fastify.post(
    '/register',
    {
      schema: {
        tags: ['Auth'],
        description: 'Register a new user',
        body: userRegisterJsonSchema,
        response: {
          201: messageResponseJsonSchema,
          400: {
            type: 'object',
            properties: {
              statusCode: { type: 'number' },
              error: { type: 'string' },
              message: { type: 'string' },
            },
            required: ['statusCode', 'error', 'message'],
          },
        },
      },
    },
    authControllerInstance.register
  );

  fastify.get(
    '/verify-email',
    {
      schema: {
        tags: ['Auth'],
        description: 'Verify email',
        querystring: {
          type: 'object',
          properties: {
            token: { type: 'string' },
          },
          required: ['token'],
        },
        response: {
          200: messageResponseJsonSchema,
          400: {
            type: 'object',
            properties: {
              statusCode: { type: 'number' },
              error: { type: 'string' },
              message: { type: 'string' },
            },
            required: ['statusCode', 'error', 'message'],
          },
        },
      },
    },
    authControllerInstance.verifyEmail
  );
}
