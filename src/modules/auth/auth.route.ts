import { FastifyInstance } from 'fastify';

import { errorResponseJsonSchema } from '@app/schema/shared/error';

import {
  loginResponseJsonSchema,
  messageResponseJsonSchema,
  refreshTokenJsonSchema,
  resendVerificationJsonSchema,
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
          409: errorResponseJsonSchema,
          500: errorResponseJsonSchema,
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
          400: errorResponseJsonSchema,
          500: errorResponseJsonSchema,
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
          401: errorResponseJsonSchema,
          403: errorResponseJsonSchema,
          500: errorResponseJsonSchema,
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
          404: errorResponseJsonSchema,
          500: errorResponseJsonSchema,
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
          400: errorResponseJsonSchema,
          404: errorResponseJsonSchema,
          500: errorResponseJsonSchema,
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
          201: messageResponseJsonSchema,
          401: errorResponseJsonSchema,
          500: errorResponseJsonSchema,
        },
      },
    },
    authControllerInstance.refreshToken
  );
  fastify.post(
    '/resend-verification',
    {
      schema: {
        tags: ['Auth'],
        description: 'Resend email verification',
        body: resendVerificationJsonSchema,
        response: {
          201: messageResponseJsonSchema,
          400: errorResponseJsonSchema,
          404: errorResponseJsonSchema,
          500: errorResponseJsonSchema,
        },
      },
    },
    authControllerInstance.resendVerificationEmail
  );
}
