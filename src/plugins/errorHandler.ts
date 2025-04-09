import { FastifyInstance, FastifyError, FastifyReply, FastifyRequest } from 'fastify';

import { AppError } from '../utils/errors';

export const errorHandler = (fastify: FastifyInstance) => {
  fastify.setErrorHandler((error: FastifyError | AppError, request: FastifyRequest, reply: FastifyReply) => {
    // Nếu là AppError do mình throw
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: error.name,
        message: error.message,
      });
    }

    // Prisma error hoặc những lỗi chưa xử lý
    fastify.log.error(error); // log nội bộ

    return reply.status(500).send({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Something went wrong!',
    });
  });
};
