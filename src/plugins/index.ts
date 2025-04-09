import { FastifyInstance } from 'fastify';

import { DatabasePlugin } from './database';
import { errorHandler } from './errorHandler';
import JwtPlugin from './jwt';
import { MultipartPlugin } from './multipart';
import RateLimitPlugin from './rate-limit';
import replyDecorator from './replyDecorator';
import { SwaggerPlugin } from './swagger';

export const Plugins = async (app: FastifyInstance) => {
  replyDecorator(app);
  SwaggerPlugin(app);
  MultipartPlugin(app);

  await app.register(DatabasePlugin);
  await app.register(RateLimitPlugin);
  await app.register(JwtPlugin);
  await app.register(errorHandler);
};
