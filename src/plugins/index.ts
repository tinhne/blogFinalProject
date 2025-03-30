import { FastifyPluginCallback } from 'fastify';
import { SwaggerPlugin } from './swagger';
import { DatabasePlugin } from './database';
import RateLimitPlugin from './rate-limit';

export const Plugins: FastifyPluginCallback = async (app) => {
  app.register(SwaggerPlugin);
  app.register(DatabasePlugin);
  app.register(RateLimitPlugin);
};
