// plugins/static.ts
import path from 'path';

import fastifyStatic from '@fastify/static';
import fp from 'fastify-plugin';

export default fp(async (fastify) => {
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, '..', '..', 'public'),
    prefix: '/public/',
    decorateReply: false, // mặc định là true, nhưng mình không cần override reply
  });
});
