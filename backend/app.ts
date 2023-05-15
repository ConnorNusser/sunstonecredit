import Fastify from 'fastify';
import { loanRoutes } from './routes/loanRoutes';
import { campaignRoutes } from './routes/campaignRoutes';

const fastify = Fastify({
  logger: true,
});

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return 'alive\n';
});

fastify.register(loanRoutes, { prefix: '/loan' });
fastify.register(campaignRoutes, { prefix: '/campaign' });

const start = async () => {
  try {
    await fastify.listen({
      port: 3000,
      host: 'localhost',
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
