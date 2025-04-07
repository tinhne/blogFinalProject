import { FastifyInstance, FastifyReply } from 'fastify';

// Define error response structure
interface ErrorResponse {
  statusCode: number;
  error: string;
  message: string;
  details?: any;
}

// Define success response structure
interface SuccessResponse<T = any> {
  statusCode: number;
  data: T;
  message?: string;
}

export default function replyDecorator(fastify: FastifyInstance) {
  // Add success response decorator
  fastify.decorateReply('success', function <T>(this: FastifyReply, data: T, message?: string, statusCode = 200) {
    const response: SuccessResponse<T> = {
      statusCode,
      data,
      ...(message && { message }),
    };

    return this.code(statusCode).send(response);
  });

  // Add error response decorator
  fastify.decorateReply(
    'error',
    function (
      this: FastifyReply,
      message: string,
      statusCode = 500,
      errorType = 'Internal Server Error',
      details?: any
    ) {
      const response: ErrorResponse = {
        statusCode,
        error: errorType,
        message,
        ...(details && { details }),
      };

      return this.code(statusCode).send(response);
    }
  );

  // Add common error responses
  fastify.decorateReply('badRequest', function (this: FastifyReply, message = 'Bad Request', details?: any) {
    return this.error(message, 400, 'Bad Request', details);
  });

  fastify.decorateReply('unauthorized', function (this: FastifyReply, message = 'Unauthorized', details?: any) {
    return this.error(message, 401, 'Unauthorized', details);
  });

  fastify.decorateReply('forbidden', function (this: FastifyReply, message = 'Forbidden', details?: any) {
    return this.error(message, 403, 'Forbidden', details);
  });

  fastify.decorateReply('notFound', function (this: FastifyReply, message = 'Not Found', details?: any) {
    return this.error(message, 404, 'Not Found', details);
  });

  fastify.decorateReply('conflict', function (this: FastifyReply, message = 'Conflict', details?: any) {
    return this.error(message, 409, 'Conflict', details);
  });

  fastify.decorateReply(
    'internalServerError',
    function (this: FastifyReply, message = 'Internal Server Error', details?: any) {
      return this.error(message, 500, 'Internal Server Error', details);
    }
  );
}

// Type declarations to extend FastifyReply
declare module 'fastify' {
  interface FastifyReply {
    success<T>(data: T, message?: string, statusCode?: number): FastifyReply;
    error(message: string, statusCode?: number, errorType?: string, details?: any): FastifyReply;
    badRequest(message?: string, details?: any): FastifyReply;
    unauthorized(message?: string, details?: any): FastifyReply;
    forbidden(message?: string, details?: any): FastifyReply;
    notFound(message?: string, details?: any): FastifyReply;
    conflict(message?: string, details?: any): FastifyReply;
    internalServerError(message?: string, details?: any): FastifyReply;
  }
}
