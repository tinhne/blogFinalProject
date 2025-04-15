// modules/category/routes.ts
import { FastifyInstance } from 'fastify';

import { categoryListResponseJsonSchema, errorResponseJsonSchema } from '@app/schema';

import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

export default async function categoryRoutes(fastify: FastifyInstance) {
  const categoryControllerInstance = new CategoryController(new CategoryService(fastify.prisma));

  // Get all categories
  fastify.get(
    '/',
    {
      schema: {
        tags: ['Category'],
        description: 'Get all categories',
        response: {
          200: categoryListResponseJsonSchema,
          500: errorResponseJsonSchema,
        },
      },
    },
    categoryControllerInstance.getAll
  );
}
