import { FastifyInstance } from 'fastify';

import authRoute from './auth/auth.route';

export const registerRoutes = async (app: FastifyInstance) => {
  app.register(authRoute, { prefix: '/api/auth' });
};
