<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">用户管理</h1>
    </div>

    <el-table :data="users" v-loading="isLoading" border stripe>
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="role" label="角色">
        <template #default="{ row }">
          <el-tag :type="row.role === 'admin' ? 'success' : 'primary'">
            {{ row.role }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isActive" label="状态">
        <template #default="{ row }">
          <el-switch
            :model-value="row.isActive"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="注册时间">
        <template #default="{ row }">
          {{ new Date(row.createdAt).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button link type="danger" size="small" @click="handleDelete(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getAllUsersApi, updateUserApi, deleteUserApi } from "@/apis/user";
import { ElMessage, ElMessageBox } from "element-plus";

interface User {
  _id: string;
  email: string;
  role: "admin" | "user";
  isActive: boolean;
  createdAt: string;
}

const users = ref<User[]>([]);
const isLoading = ref(false);

const fetchUsers = async () => {
  isLoading.value = true;
  try {
    const { data } = await getAllUsersApi();
    users.value = data;
  } catch (error) {
    ElMessage.error("获取用户列表失败");
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchUsers);

const handleStatusChange = async (row: User) => {
  try {
    await updateUserApi(row._id, { isActive: !row.isActive });
    ElMessage.success("状态更新成功");
    fetchUsers(); // 重新获取数据以同步状态
  } catch (error) {
    ElMessage.error("状态更新失败");
  }
};

const handleDelete = async (row: User) => {
  try {
    await ElMessageBox.confirm(`您确定要删除用户 "${row.email}" 吗？`, "警告", {
      type: "warning",
    });
    await deleteUserApi(row._id);
    ElMessage.success("删除成功");
    fetchUsers();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败");
    }
  }
};
</script>
