<template>
  <div>
    <h1 class="text-3xl font-bold mb-4">仪表盘</h1>
    <UCard>
      <template #header> 欢迎回来！ </template>
      <p v-if="authStore.currentUser">
        当前登录用户: {{ authStore.currentUser.email }}
      </p>
      <p v-else>正在加载用户信息...</p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "../stores/auth";
const authStore = useAuthStore();
</script>
