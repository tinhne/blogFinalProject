import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

export const DatabasePlugin = fp(async (app: FastifyInstance) => {
  const prisma = new PrismaClient();
  await prisma.$connect(); // Kết nối database
  app.decorate('prisma', prisma);

  app.addHook('onClose', async (instance) => {
    await prisma.$disconnect();
  });
});
