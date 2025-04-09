import fastifyMultipart from '@fastify/multipart';
import { FastifyInstance } from 'fastify';

export const MultipartPlugin = async (app: FastifyInstance) => {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  });
};
