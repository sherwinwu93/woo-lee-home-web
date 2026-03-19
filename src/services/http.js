const TOKEN_KEY = 'token';
// const URL_PREFIX = 'http://116.198.225.38'
const URL_PREFIX = '/api'

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

function getDataFromResponse(text) {
  if (!text) return null;
  let result;
  try {
    result = JSON.parse(text);
  } catch {
    return text;
  }
  if (result?.code != 200) throw new Error(result?.message || `请求失败`);
  return result?.data ?? null;
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

// POST form helper: supports URL-encoded or FormData(multipart).
// - Pass a plain object to send x-www-form-urlencoded
// - Pass FormData to send multipart/form-data
export async function postForm(url, { method = 'POST', headers = {}, form } = {}) {
  const finalHeaders = new Headers(headers);

  let body = '';
  if (form instanceof FormData) {
    body = form;
    // Let browser set multipart boundary.
  } else {
    finalHeaders.set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    body = form ? new URLSearchParams(form).toString() : '';
  }
  const text = await requestText(url, { method, headers: finalHeaders, body });
  return getDataFromResponse(text);
}

// Backward-compatible exports (older code uses requestJson/requestForm).
export async function requestJson(url, opts) {
  return postJson(url, opts);
}

export async function requestForm(url, opts) {
  return postForm(url, opts);
}