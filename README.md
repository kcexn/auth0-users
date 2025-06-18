# Auth0 Users API

A Fastify-based REST API for managing Auth0 users with automatic JWT token handling and OpenAPI documentation.

## Features

- Delete users from Auth0
- Automatic JWT token management with expiration handling
- OpenAPI/Swagger documentation
- CORS support
- Docker support
- ESLint configuration

## Prerequisites

- Node.js 18+
- Auth0 Management API credentials

## Environment Variables

Create a `.env` file with the following variables:

```env
AUTH0_AUTH_URL=https://your-domain.auth0.com/oauth/token
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=https://your-domain.auth0.com/api/v2/
AUTH0_GRANT_TYPE=client_credentials
PORT=3000
NODE_ENV=development
```

## Installation

```bash
npm install
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Linting
```bash
npm run lint
npm run lint:fix
```

## API Documentation

Once running, visit `/docs` for interactive Swagger UI documentation.

## Docker

Build and run with Docker:

```bash
docker build -t auth0-users .
docker run -p 3000:3000 --env-file .env auth0-users
```

## API Endpoints

### DELETE /:user
Delete a user from Auth0.

**Parameters:**
- `user` (string, required): User ID to delete

**Responses:**
- `204`: User successfully deleted
- `401`: Unauthorized - Invalid authentication credentials
- `500`: Internal server error

## License

ISC