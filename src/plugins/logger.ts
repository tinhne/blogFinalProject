import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { pino } from 'pino';

const loggerPlugin: FastifyPluginAsync = async (fastify) => {
  const level = process.env.NODE_ENV === 'production' ? 'debug' : 'debug';

  const logger = pino({
    level,
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss.l', // Định dạng thời gian
        ignore: 'pid,hostname', // Bỏ qua PID và hostname nếu không cần thiết
        messageKey: 'msg', // Sử dụng "msg" thay vì "message"
      },
    },
  });

  fastify.decorate('logger', logger);
};

export default fp(loggerPlugin);
