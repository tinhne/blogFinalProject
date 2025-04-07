import { FastifyInstance } from 'fastify';

import {
  loginResponseJsonSchema,
  messageResponseJsonSchema,
  refreshTokenJsonSchema,
  resetPasswordJsonSchema,
  resetPasswordRequestJsonSchema,
  userLoginJsonSchema,
  userRegisterJsonSchema,
} from '../../schema';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

export default async function authRoute(fastify: FastifyInstance) {
  const authControllerInstance = new AuthController(new AuthService(fastify));

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

  fastify.post(
    '/forgot-password',
    {
      schema: {
        tags: ['Auth'],
        description: 'Request password reset',
        body: resetPasswordRequestJsonSchema,
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
    authControllerInstance.forgotPassword
  );

  fastify.post(
    '/reset-password',
    {
      schema: {
        tags: ['Auth'],
        description: 'Reset password',
        body: resetPasswordJsonSchema,
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
    authControllerInstance.resetPassword
  );

  fastify.post(
    '/refresh-token',
    {
      schema: {
        tags: ['Auth'],
        description: 'Refresh access token',
        body: refreshTokenJsonSchema,
        response: {
          201: {
            types: 'object',
            properties: {
              accessToken: { type: 'string' },
            },
          },
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
    authControllerInstance.refreshToken
  );
  // fastify.post('/logout', {}, authControllerInstance.logout);
}
