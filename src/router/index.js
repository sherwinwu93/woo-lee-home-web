import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../pages/LoginPage.vue';
import TodosPage from '../pages/TodosPage.vue';
import { getToken } from '../services/http.js';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/todos',
    name: 'todos',
    component: TodosPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    redirect: '/todos'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  const token = getToken();
  if (to.meta.requiresAuth && !token) {
    return {
      name: 'login',
      query: { next: to.fullPath }
    };
  }
});

export default router;

