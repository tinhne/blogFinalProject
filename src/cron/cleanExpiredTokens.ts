import { FastifyInstance } from 'fastify';
import cron from 'node-cron';

export async function cleanExpiredTokensJob(app: FastifyInstance) {
  cron.schedule('0 3 * * *', async () => {
    try {
      const result = await app.prisma.refreshToken.deleteMany({
        where: {
          expiresAt: { lt: new Date() },
        },
      });
      app.log.info(`🧹 Cleaned ${result.count} expired refresh tokens`);
    } catch (err) {
      app.log.error('❌ Failed to clean expired tokens', err);
    }
  });
}
