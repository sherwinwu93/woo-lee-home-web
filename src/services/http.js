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

async function requestText(url, { method = 'GET', headers = {}, body } = {}) {
  const token = getToken();
  url = URL_PREFIX + url;

  const finalHeaders = new Headers(headers);
  finalHeaders.set('Authorization', token ?? '');

  const res = await fetch(url, { method, headers: finalHeaders, body });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  return text;
}

export async function postJson(url, { method = 'POST', headers = {}, body } = {}) {
  const finalHeaders = new Headers(headers);
  let finalBody;
  if (body !== undefined) {
    finalHeaders.set('Content-Type', 'application/json');
    finalBody = JSON.stringify(body);
  }

  const text = await requestText(url, { method, headers: finalHeaders, body: finalBody });
  return getDataFromResponse(text);
}

// POST form (x-www-form-urlencoded) helper for typical login endpoints.
// Example: requestForm('/api/login', { method: 'POST', form: { username, password } })
export async function postForm(url, { method = 'POST', headers = {}, form } = {}) {
  const finalHeaders = new Headers(headers);
  finalHeaders.set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');

  const body = form ? new URLSearchParams(form).toString() : '';
  const text = await requestText(url, { method, headers: finalHeaders, body });
  if (!text) return null;
  return getDataFromResponse(text);
}

export function getDataFromResponse(result) {
  result =  JSON.parse(text);
  if (result.code != 200) throw new Error(result.message || `请求失败`);
  return result.data;
}