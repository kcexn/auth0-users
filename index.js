require('dotenv').config();
const app = require('fastify')({
  logger: true,
  trustProxy: process.env.NODE_ENV === 'production'
});
const port = process.env.PORT || 3000;
const registerPlugins = require('./plugins');
const registerRoutes = require('./routes');

(async () => {
  try {
    await registerPlugins(app, port);
    await registerRoutes(app);
    await app.listen({ port: port, host: '0.0.0.0' });
    app.log.info(`Server listening on ${app.server.address().port}`);
    const url = process.env.PRODUCTION_URL || `http://localhost:${port}`;
    app.log.info(`Swagger UI available at ${url}/docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
})();
