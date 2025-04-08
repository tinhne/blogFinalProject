// src/plugins/multipart.ts
import multipart from '@fastify/multipart';
import { FastifyPluginAsync } from 'fastify';

export const MultipartPlugin: FastifyPluginAsync = async (app) => {
  app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });
};
