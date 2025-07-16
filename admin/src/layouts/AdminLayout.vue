<template>
  <el-container class="h-screen">
    <el-aside width="200px" class="bg-white border-r">
      <el-menu :default-active="$route.path" router class="h-full">
        <div class="p-4 text-center text-lg font-bold">导航后台</div>
        <el-menu-item index="/">
          <el-icon><House /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/categories">
          <el-icon><Folder /></el-icon>
          <span>分类管理</span>
        </el-menu-item>
        <el-menu-item index="/tags">
          <el-icon><PriceTag /></el-icon> <span>标签管理</span>
        </el-menu-item>
        <div class="flex-grow"></div>
        <el-menu-item @click="handleLogout">
          <el-icon><SwitchButton /></el-icon>
          <span>退出登录</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main class="bg-gray-50 p-8">
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { logoutApi } from "../apis/auth";
import { ElMessage, ElMessageBox } from "element-plus";
import { House, Folder, PriceTag, SwitchButton } from "@element-plus/icons-vue";

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  await ElMessageBox.confirm("您确定要退出登录吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  });
  try {
    await logoutApi();
    authStore.currentUser = null;
    authStore.isLoggedIn = false;
    ElMessage.success("已成功退出登录");
    router.push("/login");
  } catch (error) {
    ElMessage.error("退出失败");
  }
};
</script>
