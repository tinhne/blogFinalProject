import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { AppError } from '../errors';

export async function errorHandler(fastify: FastifyInstance) {
  fastify.setErrorHandler((error: any, request: FastifyRequest, reply: FastifyReply) => {
    if (error instanceof AppError) {
      reply.status(error.statusCode).send({
        error: true,
        message: error.message,
      });
    } else {
      console.error('Unexpected Error:', error);
      reply.status(500).send({
        error: true,
        message: 'Internal Server Error',
      });
    }
  });
}
