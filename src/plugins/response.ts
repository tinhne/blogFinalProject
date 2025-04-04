// src/plugins/response.ts
import { FastifyInstance, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';

export default fp(async (fastify: FastifyInstance) => {
  const createResponse = (reply: FastifyReply, statusCode: number, success: boolean, dataOrMessage?: any) => {
    if (success) {
      return reply.status(statusCode).send({ success, data: dataOrMessage });
    } else {
      return reply.status(statusCode).send({ error: true, message: dataOrMessage });
    }
  };

  fastify.decorateReply('badRequest', function (message: string) {
    return createResponse(this, 400, false, message);
  });

  fastify.decorateReply('unauthorized', function (message: string) {
    return createResponse(this, 401, false, message);
  });

  fastify.decorateReply('forbidden', function (message: string) {
    return createResponse(this, 403, false, message);
  });

  fastify.decorateReply('notFound', function (message: string) {
    return createResponse(this, 404, false, message);
  });

  fastify.decorateReply('internalError', function (message = 'Lỗi hệ thống') {
    return createResponse(this, 500, false, message);
  });

  fastify.decorateReply('ok', function (data?: any) {
    return createResponse(this, 200, true, data);
  });

  fastify.decorateReply('created', function (data: any) {
    return createResponse(this, 201, true, data);
  });
});

declare module 'fastify' {
  interface FastifyReply {
    badRequest(message: string): FastifyReply;
    unauthorized(message: string): FastifyReply;
    forbidden(message: string): FastifyReply;
    notFound(message: string): FastifyReply;
    internalError(message?: string): FastifyReply;
    ok(data?: any): FastifyReply;
    created(data: any): FastifyReply;
  }
}
