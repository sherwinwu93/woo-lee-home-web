<template>
  <div class="container">
    <el-card>
      <div class="row">
        <h1 style="margin: 0;">Todos</h1>
        <div class="spacer"></div>
        <el-button type="danger" :disabled="saving" @click="onLogout">Log out</el-button>
      </div>

      <div class="filters">
        <el-button
          :type="filter === 'all' ? 'primary' : 'default'"
          :disabled="saving"
          @click="filter = 'all'"
        >
          All
        </el-button>
        <el-button
          :type="filter === 'todo' ? 'warning' : 'default'"
          :disabled="saving"
          @click="filter = 'todo'"
        >
          Todo
        </el-button>
        <el-button
          :type="filter === 'blocked' ? 'primary' : 'default'"
          :disabled="saving"
          @click="filter = 'blocked'"
        >
          Blocked
        </el-button>
        <el-button
          :type="filter === 'done' ? 'success' : 'default'"
          :disabled="saving"
          @click="filter = 'done'"
        >
          Done
        </el-button>
      </div>

      <div class="row" style="margin-top: 10px;">
        <el-input
          v-model="newTitle"
          :disabled="saving"
          placeholder="Add a new todo (English UI)"
          @keyup.enter="onAdd"
          style="flex: 1"
        />
        <el-button type="primary" :disabled="saving" @click="onAdd">Add</el-button>
      </div>

      <div v-if="loadError" class="error">{{ loadError }}</div>
      <div v-if="saveError" class="error">{{ saveError }}</div>

      <div class="todo-list">
        <TodoItem
          v-for="t in visibleTodos"
          :key="t.id"
          :todo="t"
          :saving="saving"
          @changeStatus="(nextStatus) => onChangeStatus(t.id, nextStatus)"
        />
      </div>

      <div class="hint">
        Colors: Todo (yellow) -> Blocked (blue) -> Done (green).
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import TodoItem from '../components/TodoItem.vue';
import { clearToken, getToken } from '../services/http.js';
import { loadTodosRequest, saveTodosRequest } from '../services/todos.js';

const router = useRouter();

const filter = ref('all'); // 'all' | 'todo' | 'blocked' | 'done'
const newTitle = ref('');
const saving = ref(false);
const loadError = ref('');
const saveError = ref('');

const todos = ref([
  { id: 't1', title: 'Write a brief spec', status: 'todo' },
  { id: 't2', title: 'Wait for review', status: 'blocked' },
  { id: 't3', title: 'Ship the feature', status: 'done' }
]);

const visibleTodos = computed(() => {
  if (filter.value === 'all') return todos.value;
  return todos.value.filter((t) => t.status === filter.value);
});

function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return String(Date.now()) + '_' + Math.random().toString(16).slice(2);
}

async function onAdd() {
  saveError.value = '';
  const title = newTitle.value.trim();
  if (!title) return;

  const newTodo = {
    id: makeId(),
    title,
    status: 'todo'
  };

  // Optimistic update
  todos.value = [newTodo, ...todos.value];
  newTitle.value = '';

  await persistTodos();
}

function onLogout() {
  clearToken();
  router.push('/login');
}

async function persistTodos() {
  saving.value = true;
  try {
    await saveTodosRequest(todos.value);
    saveError.value = '';
  } catch (e) {
    saveError.value = e?.message ? String(e.message) : 'Failed to save todos.';
  } finally {
    saving.value = false;
  }
}

async function onChangeStatus(todoId, nextStatus) {
  saveError.value = '';
  const t = todos.value.find((x) => x.id === todoId);
  if (!t) return;
  t.status = nextStatus;
  await persistTodos();
}

onMounted(async () => {
  // Guard (in case route guard is bypassed)
  if (!getToken()) {
    router.push('/login');
    return;
  }

  loadError.value = '';
  try {
    const payload = await loadTodosRequest();
    // Accept both array and { todos: [...] } shapes.
    const list = Array.isArray(payload) ? payload : payload?.todos;
    if (Array.isArray(list)) {
      todos.value = list;
    }
  } catch (e) {
    // Keep demo data if load fails.
    loadError.value = 'Could not load todos. Using demo data.';
  }
});
</script>

