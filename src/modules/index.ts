import { FastifyInstance } from 'fastify';

import authRoute from './auth/auth.route';
import userRoutes from './user/user.route';

export const registerRoutes = async (app: FastifyInstance) => {
  app.register(authRoute, { prefix: '/api/auth' });
  app.register(userRoutes, { prefix: '/api/user' });
};
