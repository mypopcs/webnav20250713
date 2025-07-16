// /admin/src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import AdminLayout from '../layouts/AdminLayout.vue';
import LoginPage from '../views/LoginPage.vue';
import DashboardPage from '../views/DashboardPage.vue';
import CategoriesPage from '../views/CategoriesPage.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    // 所有需要登录才能访问的页面，都作为 AdminLayout 的子路由
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true }, // 添加一个元信息，表示该路由需要认证
    children: [
      {
        path: '', // 默认子路由
        name: 'Dashboard',
        component: DashboardPage,
      },
      {
        path: '/categories',
        name: 'Categories',
        component: CategoriesPage,
      }
      // 未来其他的管理页面，如用户管理、网站管理等，都在这里添加
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
 * 全局前置导航守卫
 * to: 即将要进入的目标
 * from: 当前导航正要离开的路由
 */
router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  // 1. 尝试获取当前用户信息 (这能验证 cookie 是否有效)
  // 只有在 Pinia 中没有用户信息时才发起请求，避免重复请求
  if (!authStore.currentUser) {
    await authStore.fetchCurrentUser();
  }

  // 2. 检查路由是否需要认证
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    // 如果该路由需要认证，但用户未登录，则强制跳转到登录页
    return { name: 'Login' };
  }

  // 3. 如果用户已登录，但又想访问登录页，则让他停留在首页
  if (to.name === 'Login' && authStore.isLoggedIn) {
    return { name: 'Dashboard' };
  }
});

export default router;