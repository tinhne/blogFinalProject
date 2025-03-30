import { FastifyInstance } from 'fastify';
import fastifyRateLimit from '@fastify/rate-limit';
import fp from 'fastify-plugin';
import { env } from '@app/config/env';

// Tách riêng config để dễ bảo trì
export const autoConfig = () => ({
  max: Number(env.RATE_LIMIT_MAX) || 100, // Lấy từ .env hoặc default = 100
  timeWindow: '1 minute',
  keyGenerator: (req) => req.headers['authorization'] || req.ip, // Ưu tiên Token trước, nếu không có thì theo IP
});

// Plugin đăng ký Fastify
export default fp(async (app: FastifyInstance) => {
  app.register(fastifyRateLimit, autoConfig());
});
