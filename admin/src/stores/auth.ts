// /admin/src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { loginApi, getProfileApi } from '../apis/auth'; // @ 是 src 目录的别名

export const useAuthStore = defineStore('auth', () => {
  // 当前登录的用户信息
  const currentUser = ref<any>(null);

  // 检查用户是否已登录的计算属性
  const isLoggedIn = ref(false);

  /**
   * 登录操作
   * @param loginForm 登录表单数据
   */
  async function login(loginForm: any) {
    // 调用登录 API
    await loginApi(loginForm);
    // 登录成功后，立即获取用户信息来更新状态
    await fetchCurrentUser();
  }

  /**
   * 获取当前登录用户信息
   */
  async function fetchCurrentUser() {
    try {
      const { data } = await getProfileApi();
      currentUser.value = data;
      isLoggedIn.value = true;
    } catch (error) {
      currentUser.value = null;
      isLoggedIn.value = false;
    }
  }

  return {
    currentUser,
    isLoggedIn,
    login,
    fetchCurrentUser,
  };
});