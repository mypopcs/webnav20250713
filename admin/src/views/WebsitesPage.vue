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
            :src="getFullImageUrl(row.logo)"
            fit="contain"
            class="h-12 w-full"
            :preview-src-list="[getFullImageUrl(row.logo)]"
            preview-teleported
            hide-on-click-modal
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        width="180"
        show-overflow-tooltip
      />
      <el-table-column label="链接" width="200" show-overflow-tooltip>
        <template #default="{ row }">
          <el-link :href="row.url" type="primary" target="_blank">{{
            row.url
          }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="shortDesc" label="短描述" show-overflow-tooltip />
      <el-table-column prop="longDesc" label="长描述" show-overflow-tooltip />
      <el-table-column prop="category.name" label="分类" width="120" />
      <el-table-column label="标签" width="180">
        <template #default="{ row }">
          <div class="flex flex-wrap gap-1">
            <el-tag v-for="tag in row.tags" :key="tag._id" size="small">{{
              tag.name
            }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="缩略图" width="100">
        <template #default="{ row }">
          <el-popover
            placement="left"
            :width="200"
            trigger="hover"
            v-if="row.thumbnails?.length"
          >
            <template #reference>
              <el-button link type="primary" size="small">
                查看 ({{ row.thumbnails.length }})
              </el-button>
            </template>
            <div class="flex flex-col gap-2 max-h-96 overflow-y-auto">
              <el-image
                v-for="(thumb, index) in row.thumbnails"
                :key="index"
                :src="getFullImageUrl(thumb)"
                fit="contain"
                class="w-full h-auto"
                :preview-src-list="
                  row.thumbnails.map((t) => getFullImageUrl(t))
                "
                :initial-index="index"
                preview-teleported
                hide-on-click-modal
              />
            </div>
          </el-popover>
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
      @close="formRef?.clearValidate()"
    >
      <el-form
        ref="formRef"
        :model="formState"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="网站标题" prop="title">
          <el-input v-model="formState.title" />
        </el-form-item>
        <el-form-item label="网站链接" prop="url">
          <el-input v-model="formState.url" />
        </el-form-item>

        <el-form-item label="上传Logo" prop="logo">
          <el-upload
            v-model:file-list="logoFileList"
            action="#"
            list-type="picture-card"
            :limit="1"
            :http-request="handleLogoUpload"
            :on-exceed="handleExceed"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleLogoRemove"
            :before-upload="beforeImageUpload"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="所属分类" prop="category">
          <el-select v-model="formState.category" class="w-full">
            <el-option
              v-for="cat in allCategories"
              :key="cat._id"
              :label="cat.name"
              :value="cat._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属标签" prop="tags">
          <el-select v-model="formState.tags" multiple class="w-full">
            <el-option
              v-for="tag in allTags"
              :key="tag._id"
              :label="tag.name"
              :value="tag._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="短描述" prop="shortDesc">
          <el-input v-model="formState.shortDesc" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="长描述" prop="longDesc">
          <el-input v-model="formState.longDesc" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="缩略图" prop="thumbnails">
          <el-upload
            v-model:file-list="thumbnailFileList"
            action="#"
            list-type="picture-card"
            :http-request="handleThumbnailUpload"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleThumbnailRemove"
            :before-upload="beforeImageUpload"
            :limit="5"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
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

    <el-dialog v-model="dialogVisible">
      <img
        w-full
        :src="dialogImageUrl"
        alt="Preview Image"
        style="width: 100%"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { uploadImageApi } from "@/apis/upload";
import {
  getAllWebsitesApi,
  createWebsiteApi,
  updateWebsiteApi,
  deleteWebsiteApi,
} from "@/apis/website";
import { getAllCategoriesApi } from "@/apis/category";
import { getAllTagsApi } from "@/apis/tag";
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type FormRules,
  type UploadRequestOptions,
  type UploadProps,
  type UploadUserFile,
  type UploadRawFile,
} from "element-plus";
import { Plus } from "@element-plus/icons-vue";

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

// --- 基础响应式状态 ---
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
  logo: [{ required: true, message: "必须上传Logo", trigger: "change" }],
  category: [{ required: true, message: "必须选择分类", trigger: "change" }],
  shortDesc: [{ required: true, message: "短描述不能为空", trigger: "blur" }],
});

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const getFullImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
};

// --- 数据获取 (恢复正确逻辑) ---
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

// --- 图片上传逻辑 ---
const beforeImageUpload: UploadProps["beforeUpload"] = (
  rawFile: UploadRawFile
) => {
  const isImage = rawFile.type.startsWith("image/");
  if (!isImage) {
    ElMessage.error("只能上传图片文件!");
    return false;
  }
  if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error("图片大小不能超过 5MB!");
    return false;
  }
  return true;
};

// Logo 文件列表
const logoFileList = ref<UploadUserFile[]>([]);

const handleLogoUpload = async (options: UploadRequestOptions) => {
  try {
    const { data } = await uploadImageApi(options.file);
    formState.value.logo = data.url;
    logoFileList.value = [
      { name: options.file.name, url: getFullImageUrl(data.url) },
    ];
    ElMessage.success("Logo 上传成功");
  } catch (error) {
    ElMessage.error("Logo 上传失败");
    logoFileList.value = [];
  }
};

const handleLogoRemove: UploadProps["onRemove"] = () => {
  formState.value.logo = "";
};

// 缩略图文件列表
const thumbnailFileList = ref<UploadUserFile[]>([]);

const handleThumbnailUpload = async (options: UploadRequestOptions) => {
  try {
    const { data } = await uploadImageApi(options.file);
    formState.value.thumbnails.push(data.url);
    thumbnailFileList.value = formState.value.thumbnails.map((url: string) => ({
      name: url,
      url: getFullImageUrl(url),
      response: { url },
    }));
    ElMessage.success("缩略图上传成功");
  } catch (error) {
    ElMessage.error("缩略图上传失败");
  }
};

const handleThumbnailRemove: UploadProps["onRemove"] = (uploadFile) => {
  const urlToRemove =
    (uploadFile.response as any)?.url ||
    uploadFile.url!.replace(API_BASE_URL, "");
  formState.value.thumbnails = formState.value.thumbnails.filter(
    (url: string) => url !== urlToRemove
  );
};

// --- 通用上传逻辑 ---
const handleExceed: UploadProps["onExceed"] = () => {
  ElMessage.warning("文件数量超出限制");
};
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};

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
    logoFileList.value = formState.value.logo
      ? [{ name: "logo", url: getFullImageUrl(formState.value.logo) }]
      : [];
    thumbnailFileList.value = formState.value.thumbnails.map((url: any) => ({
      name: url,
      url: getFullImageUrl(url),
      response: { url },
    }));
  } else {
    isEditing.value = false;
    formState.value = { ...defaultFormState, thumbnails: [] };
    logoFileList.value = [];
    thumbnailFileList.value = [];
  }
  isModalOpen.value = true;
};

// --- 提交与删除逻辑 (恢复正确逻辑) ---
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

const handleDelete = async (row: Website) => {
  try {
    await ElMessageBox.confirm(`您确定要删除网站 "${row.title}" 吗？`, "警告", {
      type: "warning",
    });
    await deleteWebsiteApi(row._id);
    ElMessage.success("删除成功");
    fetchInitialData();
  } catch (error) {
    if (error !== "cancel") ElMessage.error("删除失败");
  }
};
</script>
