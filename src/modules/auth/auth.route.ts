import { FastifyInstance } from 'fastify';

import {
  loginResponseJsonSchema,
  messageResponseJsonSchema,
  userLoginJsonSchema,
  userRegisterJsonSchema,
} from '../../schema';

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
      // onRequest: [fastify.authenticate],
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

  fastify.post(
    '/login',
    {
      schema: {
        tags: ['Auth'],
        description: 'Login user',
        body: userLoginJsonSchema,
        response: {
          201: loginResponseJsonSchema,
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
    authControllerInstance.login
  );
}
