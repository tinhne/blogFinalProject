import { SwaggerOptions } from '@fastify/swagger';

export const swaggerOptions: SwaggerOptions = {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'My Title',
      description: 'My Description.',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ BearerAuth: [] }],
    tags: [{ name: 'Default', description: 'Default' }],
  },
};

export const swaggerUiOptions = {
  routePrefix: '/api/docs',
  exposeRoute: true,
};
