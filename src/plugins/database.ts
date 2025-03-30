import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

export const prisma = new PrismaClient();

export const DatabasePlugin = fp(async (app: FastifyInstance) => {
    app.decorate('prisma', prisma);

    app.addHook('onClose', async (instance) => {
        await prisma.$disconnect();
    });
})