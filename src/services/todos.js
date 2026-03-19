import { requestJson } from './http.js';

// Replace these URLs with your real endpoints.
const SAVE_TODOS_URL = '/api/todos/save';
const LOAD_TODOS_URL = '/api/todos';

export function normalizeTodosPayload(payload) {
  // Supports multiple common response shapes.
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.todos)) return payload.todos;
  return [];
}

export async function loadTodosRequest() {
  return requestJson(LOAD_TODOS_URL);
}

export async function saveTodosRequest(todos) {
  // Requirement: POST JSON.
  // Adjust body shape here if your backend expects different fields.
  await requestJson(SAVE_TODOS_URL, {
    method: 'POST',
    body: { todos }
  });
}

