const TOKEN_KEY = 'token';
const URL_PREFIX = 'http://116.198.225.38'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function requestJson(url, { method = 'GET', headers = {}, body } = {}) {
  // Requirement: each request reads token from localStorage first,
  // and puts it into Authorization header.
  const token = getToken();
  url = URL_PREFIX + url;

  const finalHeaders = new Headers(headers);
  // The backend may expect raw token or `Bearer ${token}`.
  // If needed, adjust here to match your backend.
  finalHeaders.set('Authorization', token ?? '');

  let finalBody;
  if (body !== undefined) {
    finalHeaders.set('Content-Type', 'application/json');
    finalBody = JSON.stringify(body);
  }

  const res = await fetch(url, { method, headers: finalHeaders, body: finalBody });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

