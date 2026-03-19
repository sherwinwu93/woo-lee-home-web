import { postForm, setToken } from './http.js';

// Replace this with your real login API URL.
const LOGIN_URL = '/auth/login';

export async function loginRequest(username, password) {
  const data = await postForm(LOGIN_URL, {
    method: 'POST',
    form: { username, password }
  });
  console.log(data)

  if (!data) {
    throw new Error('Login succeeded but no token was returned.');
  }

  setToken(data);
  return data;
}

