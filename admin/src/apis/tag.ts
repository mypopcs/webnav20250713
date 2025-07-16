// /admin/src/apis/tag.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  withCredentials: true,
});

// 定义标签数据传输对象（DTO）的类型
interface TagDto {
  name: string;
}

/**
 * 获取所有标签
 */
export const getAllTagsApi = () => {
  return api.get('/tag');
};

/**
 * 创建新标签
 * @param data 标签数据
 */
export const createTagApi = (data: TagDto) => {
  return api.post('/tag', data);
};

/**
 * 更新标签
 * @param id 标签ID
 * @param data 要更新的数据
 */
export const updateTagApi = (id: string, data: Partial<TagDto>) => {
  return api.patch(`/tag/${id}`, data);
};

/**
 * 删除标签
 * @param id 标签ID
 */
export const deleteTagApi = (id: string) => {
  return api.delete(`/tag/${id}`);
};