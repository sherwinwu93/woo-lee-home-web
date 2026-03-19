import { requestJson, setToken } from './http.js';

// Replace this with your real login API URL.
const LOGIN_URL = '/api/login';

export async function loginRequest(username, password) {
  const data = await requestJson(LOGIN_URL, {
    method: 'POST',
    body: { username, password }
  });

  const token = data?.token;
  if (!token) {
    throw new Error('Login succeeded but no token was returned.');
  }

  setToken(token);
  return token;
}

