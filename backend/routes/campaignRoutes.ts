import { FastifyPluginCallback } from 'fastify';

export const campaignRoutes: FastifyPluginCallback = (
  fastify,
  options,
  done
) => {
  fastify.get('/', (request, reply) => {
    return { message: 'Campaign' };
  });

  done();
};
