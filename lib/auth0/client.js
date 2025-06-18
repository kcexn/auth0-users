const { decodeJwt } = require('jose');

const authenticationUrl = process.env.AUTH0_AUTH_URL;
const client_id = process.env.AUTH0_CLIENT_ID;
const client_secret = process.env.AUTH0_CLIENT_SECRET;
const audience = process.env.AUTH0_AUDIENCE;
const grant_type = process.env.AUTH0_GRANT_TYPE;

let token;
async function expireToken() {
  token = null;
}
async function getToken() {
  if (!token || token.expires_at < Date.now() / 1000) {
    const response = await fetch(authenticationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id,
        client_secret,
        audience,
        grant_type
      })
    });
    if (!response.ok) {
      return {
        error: response
      };
    }
    const tokenResponse = await response.json();
    const decoded = decodeJwt(tokenResponse.access_token);
    token = {
      type: tokenResponse.token_type,
      access_token: tokenResponse.access_token,
      expires_at: decoded.exp
    };
  }
  return token;
}
async function deleteUser(user_id) {
  const token = await getToken();
  if (token.error) {
    return token.error;
  }
  const access_token = token.access_token;
  const base = audience.replace(/\/$/, '');
  const response = await fetch(`${base}/users/${user_id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    if (response.status === 401) {
      await expireToken();
    }
  }
  return response;
}
module.exports = { getToken, expireToken, deleteUser };
