<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">网站管理</h1>
      <el-button type="primary" @click="openModal()">新建网站</el-button>
    </div>

    <el-table :data="websites" v-loading="isLoading" border stripe>
      <el-table-column label="Logo" width="100">
        <template #default="{ row }">
          <el-image
            v-if="row.logo"
            :src="row.logo"
            fit="contain"
            class="h-12 w-full"
            :preview-src-list="[row.logo]"
            preview-teleported
            hide-on-click-modal
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        width="200"
        show-overflow-tooltip
      />
      <el-table-column
        prop="url"
        label="链接"
        width="250"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <el-link :href="row.url" type="primary" target="_blank">{{
            row.url
          }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="shortDesc" label="短描述" show-overflow-tooltip />
      <el-table-column prop="category.name" label="分类" width="120" />
      <el-table-column label="标签" width="200">
        <template #default="{ row }">
          <div class="flex flex-wrap gap-1">
            <el-tag v-for="tag in row.tags" :key="tag._id" size="small">
              {{ tag.name }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status ? 'success' : 'info'">
            {{ row.status ? "显示" : "隐藏" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
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
      :title="isEditing ? '编辑网站' : '新建网站'"
      width="800px"
    >
      <el-form
        ref="formRef"
        :model="formState"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="网站标题" prop="title">
          <el-input v-model="formState.title" placeholder="请输入网站标题" />
        </el-form-item>
        <el-form-item label="网站链接" prop="url">
          <el-input v-model="formState.url" placeholder="请输入 https://..." />
        </el-form-item>
        <el-form-item label="Logo链接" prop="logo">
          <el-input v-model="formState.logo" placeholder="请输入 Logo 的 URL" />
        </el-form-item>
        <el-form-item label="所属分类" prop="category">
          <el-select
            v-model="formState.category"
            placeholder="请选择分类"
            class="w-full"
          >
            <el-option
              v-for="cat in allCategories"
              :key="cat._id"
              :label="cat.name"
              :value="cat._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属标签" prop="tags">
          <el-select
            v-model="formState.tags"
            multiple
            placeholder="可选择多个标签"
            class="w-full"
          >
            <el-option
              v-for="tag in allTags"
              :key="tag._id"
              :label="tag.name"
              :value="tag._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="短描述" prop="shortDesc">
          <el-input
            v-model="formState.shortDesc"
            type="textarea"
            :rows="2"
            placeholder="最多100字"
          />
        </el-form-item>
        <el-form-item label="长描述" prop="longDesc">
          <el-input
            v-model="formState.longDesc"
            type="textarea"
            :rows="4"
            placeholder="详细介绍（可选）"
          />
        </el-form-item>
        <el-form-item
          v-for="(thumbnail, index) in formState.thumbnails"
          :key="index"
          :label="'缩略图 ' + (index + 1)"
          :prop="'thumbnails.' + index"
        >
          <el-input
            v-model="formState.thumbnails[index]"
            placeholder="请输入图片链接"
          >
            <template #append>
              <el-button :icon="Delete" @click="removeThumbnail(index)" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="addThumbnail"
            :disabled="formState.thumbnails.length >= 5"
          >
            添加缩略图
          </el-button>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="formState.status" />
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
  getAllWebsitesApi,
  createWebsiteApi,
  updateWebsiteApi,
  deleteWebsiteApi,
} from "../apis/website";
import { getAllCategoriesApi } from "../apis/category";
import { getAllTagsApi } from "../apis/tag";
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type FormRules,
} from "element-plus";
import { Delete } from "@element-plus/icons-vue";

// --- 类型定义 ---
interface Website {
  _id: string;
  title: string;
  url: string;
  logo: string;
  shortDesc: string;
  longDesc?: string;
  category: Category;
  tags: Tag[];
  thumbnails: string[];
  status: boolean;
}
interface Category {
  _id: string;
  name: string;
}
interface Tag {
  _id: string;
  name: string;
}

// --- 响应式状态 ---
const websites = ref<Website[]>([]);
const allCategories = ref<Category[]>([]);
const allTags = ref<Tag[]>([]);
const isLoading = ref(false);
const isModalOpen = ref(false);
const isEditing = ref(false);
const isSubmitting = ref(false);

const formRef = ref<FormInstance>();
const defaultFormState = {
  _id: "",
  title: "",
  url: "",
  logo: "",
  shortDesc: "",
  longDesc: "",
  category: "",
  tags: [],
  thumbnails: [] as string[],
  status: true,
};
const formState = ref<any>({ ...defaultFormState });
const formRules = reactive<FormRules>({
  title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
  url: [{ required: true, message: "链接不能为空", trigger: "blur" }],
  logo: [{ required: true, message: "Logo不能为空", trigger: "blur" }],
  category: [{ required: true, message: "必须选择分类", trigger: "change" }],
  shortDesc: [{ required: true, message: "短描述不能为空", trigger: "blur" }],
});

// --- 数据获取 ---
const fetchInitialData = async () => {
  isLoading.value = true;
  try {
    const [websitesRes, categoriesRes, tagsRes] = await Promise.all([
      getAllWebsitesApi(),
      getAllCategoriesApi(),
      getAllTagsApi(),
    ]);
    websites.value = websitesRes.data;
    allCategories.value = categoriesRes.data;
    allTags.value = tagsRes.data;
  } catch (error) {
    ElMessage.error("获取初始数据失败");
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchInitialData);

// --- 模态框与表单逻辑 ---
const openModal = (website?: Website) => {
  if (website?._id) {
    isEditing.value = true;
    formState.value = {
      ...website,
      category: website.category._id,
      tags: website.tags.map((t) => t._id),
      thumbnails: website.thumbnails || [],
    };
  } else {
    isEditing.value = false;
    formState.value = { ...defaultFormState, thumbnails: [] };
  }
  isModalOpen.value = true;
};

const removeThumbnail = (index: number) => {
  formState.value.thumbnails.splice(index, 1);
};
const addThumbnail = () => {
  if (formState.value.thumbnails.length < 5) {
    formState.value.thumbnails.push("");
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      isSubmitting.value = true;
      try {
        const payload = {
          title: formState.value.title,
          url: formState.value.url,
          logo: formState.value.logo,
          shortDesc: formState.value.shortDesc,
          longDesc: formState.value.longDesc,
          category: formState.value.category,
          tags: formState.value.tags,
          thumbnails: formState.value.thumbnails.filter(
            (t: any) => t && t.trim() !== ""
          ),
          status: formState.value.status,
        };

        if (isEditing.value) {
          await updateWebsiteApi(formState.value._id, payload);
        } else {
          await createWebsiteApi(payload);
        }
        ElMessage.success(isEditing.value ? "更新成功" : "创建成功");
        isModalOpen.value = false;
        fetchInitialData();
      } catch (error: any) {
        ElMessage.error(error.response?.data?.message || "操作失败");
      } finally {
        isSubmitting.value = false;
      }
    }
  });
};

// --- 删除逻辑 ---
const handleDelete = async (row: Website) => {
  try {
    await ElMessageBox.confirm(`您确定要删除网站 "${row.title}" 吗？`, "警告", {
      type: "warning",
      confirmButtonText: "确定删除",
      cancelButtonText: "取消",
    });
    await deleteWebsiteApi(row._id);
    ElMessage.success("删除成功");
    fetchInitialData();
  } catch (error) {
    if (error !== "cancel") ElMessage.error("删除失败");
  }
};
</script>
