import cors from '@fastify/cors';
import Fastify from 'fastify';

import { loggerConfig } from './config/logger';
import { registerRoutes } from './modules';
import { Plugins } from './plugins';

export function buildApp() {
  const app = Fastify({
    logger: loggerConfig,
  });

  app.register(cors, {
    origin: ['*'],
  });

  Plugins(app);

  registerRoutes(app);

  return app;
}
