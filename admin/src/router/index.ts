// /admin/src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  // 我们将在这里添加其他受保护的路由
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;