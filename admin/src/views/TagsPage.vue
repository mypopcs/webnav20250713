<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">标签管理</h1>
      <el-button type="primary" @click="openModal()">新建标签</el-button>
    </div>

    <el-table :data="tags" v-loading="isLoading" border stripe>
      <el-table-column prop="name" label="名称" />
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
      :title="isEditing ? '编辑标签' : '新建标签'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="formState"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="formState.name" placeholder="请输入标签名称" />
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
  getAllTagsApi,
  createTagApi,
  updateTagApi,
  deleteTagApi,
} from "../apis/tag";
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type FormRules,
} from "element-plus";

interface Tag {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const tags = ref<Tag[]>([]);
const isLoading = ref(false);
const isModalOpen = ref(false);
const isEditing = ref(false);
const isSubmitting = ref(false);

const formRef = ref<FormInstance>();
const defaultFormState = {
  _id: "",
  name: "",
};
const formState = ref({ ...defaultFormState });
const formRules = reactive<FormRules>({
  name: [{ required: true, message: "标签名称不能为空", trigger: "blur" }],
});

const fetchTags = async () => {
  isLoading.value = true;
  try {
    const { data } = await getAllTagsApi();
    tags.value = data;
  } catch (error) {
    ElMessage.error("获取标签列表失败");
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchTags);

const openModal = (tag?: Tag) => {
  if (tag?._id) {
    isEditing.value = true;
    formState.value = { ...tag };
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
          await updateTagApi(formState.value._id, {
            name: formState.value.name,
          });
          ElMessage.success("更新成功");
        } else {
          await createTagApi({ name: formState.value.name });
          ElMessage.success("创建成功");
        }
        isModalOpen.value = false;
        fetchTags();
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "操作失败";
        ElMessage.error(errorMessage);
      } finally {
        isSubmitting.value = false;
      }
    }
  });
};

const handleDelete = async (row: Tag) => {
  try {
    await ElMessageBox.confirm(`您确定要删除标签 "${row.name}" 吗？`, "警告", {
      confirmButtonText: "确定删除",
      cancelButtonText: "取消",
      type: "warning",
    });
    await deleteTagApi(row._id);
    ElMessage.success("删除成功");
    fetchTags();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败");
    }
  }
};
</script>
