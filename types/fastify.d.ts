import '@fastify/jwt';
import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

// Định nghĩa kiểu dữ liệu của `user`
export interface AuthUser {
  id: string;
  email: string;
  isAdmin: boolean;
}

// **Mở rộng Fastify để đảm bảo `request.user` có kiểu `AuthUser`**
declare module 'fastify' {
  interface FastifyRequest {
    user: AuthUser; // Định nghĩa rõ kiểu `user`
  }

  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    prisma: PrismaClient;
  }
}
