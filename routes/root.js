module.exports = async function (app) {
  app.get('/', async (request, reply) => {
    return reply.send('User management with Fastify is running!');
  });
};
