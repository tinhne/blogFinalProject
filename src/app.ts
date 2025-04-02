import Fastify, { FastifyInstance } from 'fastify';

import { registerRoutes } from './modules';
import { Plugins } from './plugins';
// import { ZodTypeProvider } from 'fastify-type-provider-zod';
// import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { DatabasePlugin } from './plugins/database';
import { SwaggerPlugin } from './plugins/swagger';

export function buildApp() {
  const app = Fastify({
    logger: true,
  });
  app.register(DatabasePlugin);
  app.register(SwaggerPlugin);

  app.register(Plugins);
  registerRoutes(app);

  return app;
}
