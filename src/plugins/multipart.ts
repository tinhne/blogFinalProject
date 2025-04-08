import fastifyMultipart from '@fastify/multipart';
import fp from 'fastify-plugin';

export default fp(async (fastify) => {
  fastify.register(fastifyMultipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // giới hạn 5MB
    },
  });
});
