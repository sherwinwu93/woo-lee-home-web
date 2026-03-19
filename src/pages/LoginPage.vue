<template>
  <div class="container">
    <el-card style="max-width: 460px; margin: 0 auto;">
      <h1>Sign In</h1>

      <form @submit.prevent="onSubmit">
        <div class="field">
          <label>Username</label>
          <el-input v-model="username" autocomplete="username" />
        </div>

        <div class="field">
          <label>Password</label>
          <el-input
            v-model="password"
            type="password"
            autocomplete="current-password"
          />
        </div>

        <div class="row">
          <el-button
            type="primary"
            native-type="submit"
            :loading="loading"
            :disabled="loading"
          >
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </el-button>
          <div class="spacer"></div>
        </div>

        <div v-if="error" class="error">{{ error }}</div>
      </form>

      <div class="hint">
        Replace API URL in <code>src/services/auth.js</code> and ensure the server returns
        <code>{ token: string }</code>.
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { loginRequest } from '../services/auth.js';

const router = useRouter();
const route = useRoute();

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

async function onSubmit() {
  error.value = '';
  loading.value = true;
  try {
    const token = await loginRequest(username.value, password.value);
    // token is already stored to localStorage in loginRequest.
    void token;

    const next = route.query.next || '/todos';
    router.push(next);
  } catch (e) {
    error.value = e?.message ? String(e.message) : 'Login failed.';
  } finally {
    loading.value = false;
  }
}
</script>

