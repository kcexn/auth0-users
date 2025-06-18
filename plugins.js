const fastifySwagger = require('@fastify/swagger');
const fastifySwaggerUI = require('@fastify/swagger-ui');
const fastifyCors = require('@fastify/cors');

async function registerPlugins(app, port) {
  const productionUrl = process.env.PRODUCTION_URL;
  const allowedOrigins = process.env.CORS_ORIGIN.split(',');
  const allowedMethods = (process.env.CORS_METHODS || 'POST,OPTIONS').split(',');
  const allowedHeaders = (process.env.CORS_HEADERS || 'Content-Type,Authorization').split(',');
  await app.register(fastifyCors, {
    origin: allowedOrigins,
    methods: allowedMethods,
    allowedHeaders: allowedHeaders
  });
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'OpenAI API Proxy with Fastify',
        description: 'A Fastify proxy for interacting with the OpenAI API, with auto-generated OpenAPI documentation.',
        version: '0.1.0'
      },
      servers: process.env.NODE_ENV === 'production'
        ? (productionUrl ? [{ url: productionUrl, description: 'Production server' }] : [])
        : [{ url: `http://localhost:${port}`, description: 'Local development server' }],
      components: {},
      tags: [
        { name: 'Users', description: 'Endpoints related to user management.' }
      ]
    }
  });

  await app.register(fastifySwaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true
  });
}

module.exports = registerPlugins;
