<template>
  <div
    class="flex items-center justify-center min-h-screen bg-gray-100 max-w-[100px]"
  >
    <el-card class="max-w-sm" header="后台管理系统登录">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        @submit.prevent="handleSubmit"
      >
        <el-form-item prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" size="large">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
            size="large"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            native-type="submit"
            :loading="isLoading"
            class="w-full"
            size="large"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { User, Lock } from "@element-plus/icons-vue";

const formRef = ref<FormInstance>();
const form = reactive({
  email: "admin@dev.com",
  password: "admin123",
});
const rules = reactive<FormRules>({
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    {
      type: "email",
      message: "请输入有效的邮箱地址",
      trigger: ["blur", "change"],
    },
  ],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});

const isLoading = ref(false);
const authStore = useAuthStore();
const router = useRouter();

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      isLoading.value = true;
      try {
        await authStore.login(form);
        ElMessage.success("登录成功！");
        router.push("/");
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "登录失败";
        ElMessage.error(errorMessage);
      } finally {
        isLoading.value = false;
      }
    }
  });
};
</script>
