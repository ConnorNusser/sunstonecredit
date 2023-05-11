import { FastifyPluginCallback } from 'fastify';

export const loanRoutes: FastifyPluginCallback = (fastify, options, done) => {
  fastify.get('/', (request, reply) => {
    return { message: 'Loan Op' };
  });

  fastify.get<{ Querystring: { amount: number } }>(
    '/detail',
    (request, reply) => {
      if (request.query.amount > 5) {
        reply.send({ amount: request.query.amount });
      } else {
        reply.send({ message: 'empty' });
      }
    }
  );

  done();
};
