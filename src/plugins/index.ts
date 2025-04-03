import { FastifyInstance } from 'fastify';

import { DatabasePlugin } from './database';
import JwtPlugin from './jwt';
import RateLimitPlugin from './rate-limit';
import { SwaggerPlugin } from './swagger';

export const Plugins = async (app: FastifyInstance) => {
  SwaggerPlugin(app);
  await app.register(DatabasePlugin);
  // await app.register(LoggerPlugin);
  await app.register(RateLimitPlugin);
  await app.register(JwtPlugin);
};
