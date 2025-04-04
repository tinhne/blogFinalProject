import { FastifyInstance } from 'fastify';

import { DatabasePlugin } from './database';
import { errorHandler } from './errorHandler';
import JwtPlugin from './jwt';
import RateLimitPlugin from './rate-limit';
import responsePlugin from './response';
import { SwaggerPlugin } from './swagger';

export const Plugins = async (app: FastifyInstance) => {
  // Plugin decorate response trước để các route có thể dùng reply.ok(), reply.badRequest()...
  await app.register(responsePlugin);

  // Swagger doc
  SwaggerPlugin(app);

  // Các plugin hệ thống
  await app.register(DatabasePlugin);
  await app.register(RateLimitPlugin);
  await app.register(JwtPlugin);

  // Cuối cùng mới gán error handler
  await errorHandler(app);
};
