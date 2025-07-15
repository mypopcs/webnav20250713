<template>
  <div class="flex items-center justify-center min-h-screen">
    <UCard class="w-full max-w-sm">
      <template #header>
        <h1 class="text-2xl font-bold text-center">登录</h1>
      </template>

      <UForm
        :state="form"
        class="space-y-4 gap-y-1 grid"
        @submit="handleSubmit"
      >
        <UFormGroup label="邮箱" name="email">
          <UInput
            v-model="form.email"
            type="email"
            placeholder="you@example.com"
            class="w-full"
          />
        </UFormGroup>

        <UFormGroup label="密码" name="password">
          <UInput v-model="form.password" type="password" class="w-full" />
        </UFormGroup>

        <UButton type="submit" block :loading="isLoading"> 登 录 </UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

// 表单状态
const form = reactive({
  email: "admin@dev.com",
  password: "admin123",
});

const isLoading = ref(false);

const authStore = useAuthStore();
const router = useRouter();
const { add: addToast } = useToast();

// 提交处理
const handleSubmit = async () => {
  isLoading.value = true;
  try {
    await authStore.login(form);
    addToast({ title: "登录成功", color: "success" });
    // 登录成功后跳转到仪表盘页面
    router.push("/");
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "登录失败";
    addToast({ title: "错误", description: errorMessage, color: "error" });
  } finally {
    isLoading.value = false;
  }
};
</script>
