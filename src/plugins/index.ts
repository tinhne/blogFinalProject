import { FastifyPluginCallback } from 'fastify';

import { DatabasePlugin } from './database';
import JwtPlugin from './jwt';
import LoggerPlugin from './logger';
import RateLimitPlugin from './rate-limit';
import { SwaggerPlugin } from './swagger';

export const Plugins: FastifyPluginCallback = async (app) => {
  // await app.register(DatabasePlugin);
  await app.register(LoggerPlugin);
  // await app.register(SwaggerPlugin);
  await app.register(RateLimitPlugin);
  await app.register(JwtPlugin);
};
