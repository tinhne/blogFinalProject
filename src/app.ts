import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import Fastify from 'fastify';

import { swaggerOptions, swaggerUiOptions } from './config/swagger';
import { registerRoutes } from './modules';
import { Plugins } from './plugins';
import { DatabasePlugin } from './plugins/database';
// import { SwaggerPlugin } from './plugins/swagger';

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.register(fastifySwagger, swaggerOptions);
  app.register(fastifySwaggerUi, swaggerUiOptions);
  // app.register(SwaggerPlugin);
  app.register(DatabasePlugin);

  app.register(Plugins);
  registerRoutes(app);

  return app;
}
