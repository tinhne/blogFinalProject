export const loggerConfig = {
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'yyyy-mm-dd HH:MM:ss.l.Z',
      ignore: 'pid,hostname',
      messageKey: 'msg',
    },
  },
};
