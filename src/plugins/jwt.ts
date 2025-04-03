import fastifyJwt from '@fastify/jwt';
import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import { env } from '../config/env';

const JwtPlugin: FastifyPluginAsync = async (app) => {
  app.register(fastifyJwt, {
    secret: env.JWT_SECRET || 'supersecret',
  });

  // Middleware xác thực và gán kiểu `AuthUser`
  app.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
      request.user = request.user; // Gán kiểu dữ liệu chuẩn xác
    } catch (err) {
      reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }
  });
};

export default fp(JwtPlugin);
