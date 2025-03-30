import Fastify, { FastifyInstance } from 'fastify';

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  return app;
}
