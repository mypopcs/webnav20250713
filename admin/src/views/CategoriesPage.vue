<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">分类管理</h1>
      <UButton label="新建分类" @click="isModalOpen = true" />
    </div>

    <UTable :columns="columns" :rows="categories" :loading="isLoading">
      <template #actions-data="{ row }">
        <UButton
          icon="i-heroicons-pencil-square"
          size="sm"
          variant="ghost"
          class="mr-2"
          @click="handleEdit(row)"
        />
        <UButton
          icon="i-heroicons-trash"
          size="sm"
          color="error"
          variant="ghost"
          @click="handleDelete(row)"
        />
      </template>
    </UTable>

    <UModal v-model="isModalOpen">
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">
            {{ isEditing ? "编辑" : "新建" }}分类
          </h2>
        </template>

        <UForm :state="formState" class="space-y-4" @submit="handleSubmit">
          <UFormGroup label="分类名称" name="name">
            <UInput v-model="formState.name" />
          </UFormGroup>
          <UFormGroup label="排序" name="order">
            <UInput v-model.number="formState.order" type="number" />
          </UFormGroup>
          <UButton type="submit" :loading="isSubmitting"> 提 交 </UButton>
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getAllCategoriesApi, createCategoryApi } from "../apis/category";

const { add: addToast } = useToast();

// 表格列定义
const columns = [
  { key: "name", label: "名称" },
  { key: "order", label: "排序" },
  { key: "actions", label: "操作" },
];

const categories = ref([]); // 分类列表数据
const isLoading = ref(false); // 表格加载状态
const isModalOpen = ref(false); // 模态框开关
const isEditing = ref(false); // 是否为编辑模式
const isSubmitting = ref(false); // 表单提交状态

// 表单状态
const formState = ref({
  id: "",
  name: "",
  order: 0,
});

// 获取所有分类
const fetchCategories = async () => {
  isLoading.value = true;
  try {
    const { data } = await getAllCategoriesApi();
    categories.value = data;
  } catch (error) {
    addToast({ title: "获取分类失败", color: "error" });
  } finally {
    isLoading.value = false;
  }
};

// 组件挂载时获取数据
onMounted(fetchCategories);

// 表单提交处理
const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    // 调用创建API
    await createCategoryApi({
      name: formState.value.name,
      order: formState.value.order,
    });
    addToast({ title: "创建成功", color: "success" });
    isModalOpen.value = false; // 关闭模态框
    fetchCategories(); // 重新获取列表
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "操作失败";
    addToast({ title: "错误", description: errorMessage, color: "error" });
  } finally {
    isSubmitting.value = false;
  }
};

// TODO: 编辑和删除逻辑
const handleEdit = (row: any) => {
  addToast({ title: "编辑功能待实现" });
  console.log("Edit", row);
};

const handleDelete = (row: any) => {
  addToast({ title: "删除功能待实现" });
  console.log("Delete", row);
};
</script>
