import { FastifyInstance } from 'fastify';

import adminRoutes from './admin/admin.route';
import authRoute from './auth/auth.route';
import categoryRoutes from './category/category.route';
import commentRoutes from './comment/comment.route';
import mediaRoutes from './media/media.route';
import postRoutes from './post/post.route';
import userRoutes from './user/user.route';

export const registerRoutes = async (app: FastifyInstance) => {
  app.register(authRoute, { prefix: '/api/auth' });
  app.register(userRoutes, { prefix: '/api/user' });
  app.register(mediaRoutes, { prefix: '/api/media' });
  app.register(postRoutes, { prefix: '/api/post' });
  app.register(categoryRoutes, { prefix: '/api/category' });
  app.register(commentRoutes, { prefix: '/api/comment' });
  app.register(adminRoutes, { prefix: '/api/admin' });
};
