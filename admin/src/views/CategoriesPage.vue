<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">分类管理</h1>
      <el-button type="primary" @click="openModal()">新建分类</el-button>
    </div>

    <el-table :data="categories" v-loading="isLoading" border stripe>
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="order" label="排序值" sortable />
      <el-table-column prop="createdAt" label="创建时间">
        <template #default="{ row }">
          {{ new Date(row.createdAt).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="openModal(row)"
            >编辑</el-button
          >
          <el-button link type="danger" size="small" @click="handleDelete(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="isModalOpen"
      :title="isEditing ? '编辑分类' : '新建分类'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="formState"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="formState.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="排序值" prop="order">
          <el-input-number v-model="formState.order" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isModalOpen = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="isSubmitting"
          >确 定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import {
  getAllCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "../apis/category";
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type FormRules,
} from "element-plus";

interface Category {
  _id: string;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const categories = ref<Category[]>([]);
const isLoading = ref(false);
const isModalOpen = ref(false);
const isEditing = ref(false);
const isSubmitting = ref(false);

const formRef = ref<FormInstance>();
const defaultFormState = {
  _id: "",
  name: "",
  order: 0,
};
const formState = ref({ ...defaultFormState });
const formRules = reactive<FormRules>({
  name: [{ required: true, message: "分类名称不能为空", trigger: "blur" }],
});

const fetchCategories = async () => {
  isLoading.value = true;
  try {
    const { data } = await getAllCategoriesApi();
    categories.value = data;
  } catch (error) {
    ElMessage.error("获取分类列表失败");
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchCategories);

const openModal = (category?: Category) => {
  if (category?._id) {
    isEditing.value = true;
    formState.value = { ...category };
  } else {
    isEditing.value = false;
    formState.value = { ...defaultFormState };
  }
  isModalOpen.value = true;
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      isSubmitting.value = true;
      try {
        if (isEditing.value) {
          await updateCategoryApi(formState.value._id, {
            name: formState.value.name,
            order: formState.value.order,
          });
          ElMessage.success("更新成功");
        } else {
          await createCategoryApi({
            name: formState.value.name,
            order: formState.value.order,
          });
          ElMessage.success("创建成功");
        }
        isModalOpen.value = false;
        fetchCategories();
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "操作失败";
        ElMessage.error(errorMessage);
      } finally {
        isSubmitting.value = false;
      }
    }
  });
};

const handleDelete = async (row: Category) => {
  try {
    await ElMessageBox.confirm(`您确定要删除分类 "${row.name}" 吗？`, "警告", {
      confirmButtonText: "确定删除",
      cancelButtonText: "取消",
      type: "warning",
    });
    await deleteCategoryApi(row._id);
    ElMessage.success("删除成功");
    fetchCategories();
  } catch (error) {
    // 如果用户点击取消，会进入catch，这里不做提示
    if (error !== "cancel") {
      ElMessage.error("删除失败");
    }
  }
};
</script>
