// /admin/src/apis/category.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  withCredentials: true,
});

// 定义分类数据传输对象（DTO）的类型
interface CategoryDto {
  name: string;
  order?: number;
}

export const getAllCategoriesApi = () => {
  return api.get('/category');
};

export const createCategoryApi = (data: CategoryDto) => {
  return api.post('/category', data);
};

export const updateCategoryApi = (id: string, data: Partial<CategoryDto>) => {
  return api.patch(`/category/${id}`, data);
};

export const deleteCategoryApi = (id: string) => {
  return api.delete(`/category/${id}`);
};