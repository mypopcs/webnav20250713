<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900">
    <aside
      class="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r dark:border-gray-700"
    >
      <div class="p-4 text-center text-lg font-bold">导航后台</div>
      <nav class="p-4 space-y-2">
        <UButton
          to="/"
          icon="i-heroicons-home"
          size="xl"
          variant="ghost"
          label="仪表盘"
          block
        />
        <UButton
          icon="i-heroicons-arrow-left-on-rectangle"
          size="xl"
          variant="ghost"
          label="退出登录"
          color="error"
          block
          @click="handleLogout"
        />
      </nav>
    </aside>

    <main class="flex-1 overflow-y-auto">
      <div class="p-8">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { logoutApi } from "../apis/auth";

const authStore = useAuthStore();
const router = useRouter();
const { add: addToast } = useToast();

const handleLogout = async () => {
  try {
    await logoutApi(); // 调用后端退出接口
    authStore.currentUser = null;
    authStore.isLoggedIn = false;
    addToast({ title: "已退出登录" });
    router.push("/login");
  } catch (error) {
    addToast({ title: "退出失败", color: "error" });
  }
};
</script>
