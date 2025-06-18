const { getToken, deleteUser } = require('../../lib/auth0/client');
const { decodeJwt } = require('jose');

const schema = {
  description: 'Delete a user from Auth0',
  tags: ['users'],
  params: {
    type: 'object',
    properties: {
      user: {
        type: 'string',
        description: 'User ID to delete'
      }
    },
    required: ['user']
  },
  response: {
    204: {
      description: 'User successfully deleted'
    },
    401: {
      description: 'Unauthorized - Invalid authentication credentials'
    },
    403: {
      description: 'Forbidden - Cannot delete another user'
    },
    500: {
      description: 'Internal server error'
    }
  }
};
module.exports = async (app) => {
  app.delete('/:user', { schema }, async (request, reply) => {
    app.log.info(request.headers);
    try {
      const { user } = request.params;

      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        app.log.error({ error: 'Unauthorized - Invalid authentication credentials' });
        return reply.code(401).send();
      }

      const userJwt = authHeader.substring(7);
      let decodedUserToken;
      try {
        decodedUserToken = decodeJwt(userJwt);
      } catch (error) {
        app.log.error({ error });
        return reply.code(401).send();
      }

      if (decodedUserToken.sub !== user) {
        app.log.error({ error: 'Forbidden - Cannot delete another user' });
        return reply.code(403).send();
      }

      const token = await getToken();
      if (token.error) {
        return reply.code(token.statusCode).send();
      }
      const access_token = token.access_token;
      const response = await deleteUser(user, access_token);
      if (!response.ok) {
        app.log.error({
          error: 'Error deleting user',
          statusCode: response.statusCode,
          statusMessage: response.statusText
        });
        return reply.code(response.statusCode).send();
      }
      return reply.code(204).send();
    } catch (error) {
      return reply.code(500).send();
    }
  });
};
