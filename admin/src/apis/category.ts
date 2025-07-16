// /admin/src/apis/category.ts
import axios from 'axios';

// 我们可以复用之前创建的 axios 实例，或者为每个模块创建
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  withCredentials: true,
});

/**
 * 获取所有分类
 */
export const getAllCategoriesApi = () => {
  return api.get('/category');
};

/**
 * 创建新分类
 * @param data { name: string, order: number }
 */
export const createCategoryApi = (data: { name: string; order?: number }) => {
  return api.post('/category', data);
};

// 后续我们会在这里添加更新和删除的 API