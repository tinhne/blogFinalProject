import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';

export async function SwaggerPlugin(fastify: FastifyInstance) {
  console.log('Registering Swagger...'); // Thêm log để debug

  await fastify.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Personal Blog API',
        description: 'API documentation for the Personal Blog API',
        version: '0.1.0',
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here',
      },
      servers: [{ url: 'http://localhost:3000' }],
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
      tags: [{ name: 'Auth', description: 'Register a new user' }],
    },
  });

  await fastify.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header: string) => header,
    transformSpecification: (swaggerObject) => {
      return swaggerObject;
    }, // Cấu hình biến đổi tài liệu Swagger
    transformSpecificationClone: true, // Sử dụng bản sao của tài liệu Swagger
  });
}
