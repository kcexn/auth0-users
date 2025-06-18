const { getToken, expireToken } = require('../../lib/auth0/client');

const audience = process.env.AUTH0_AUDIENCE;
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
    500: {
      description: 'Internal server error'
    }
  }
};
async function deleteUser(user_id, access_token) {
  const base = audience.replace(/\/$/, '');
  return await fetch(`${base}/users/${user_id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    }
  });
}
module.exports = async (app) => {
  app.delete('/:user', { schema }, async (request, reply) => {
    try {
      const { user } = request.params;
      const token = await getToken();
      if (token.error) {
        if (token.error === 'access_denied') {
          reply.code(401);
        }
        return reply.send({ ...token });
      }
      const access_token = token.access_token;
      const response = await deleteUser(user, access_token);
      if (!response.ok) {
        app.log.error({ error: 'Error deleting user', message: response.statusText });
        if (response.statusCode === 401) {
          await expireToken();
        }
        return reply.code(response.statusCode).send();
      }
      return reply.code(204).send();
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: error.message
      });
    }
  });
};
