// /admin/src/apis/website.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  withCredentials: true,
});

// 定义网站数据传输对象（DTO）的类型
interface WebsiteDto {
  title: string;
  url: string;
  logo: string;
  shortDesc: string;
  longDesc?: string;
  category: string; // 分类的 _id
  tags?: string[];   // 标签 _id 数组
}

/** 获取所有网站 */
export const getAllWebsitesApi = () => api.get('/website');

/** 创建新网站 */
export const createWebsiteApi = (data: WebsiteDto) => api.post('/website', data);

/** 更新网站 */
export const updateWebsiteApi = (id: string, data: Partial<WebsiteDto>) => api.patch(`/website/${id}`, data);

/** 删除网站 */
export const deleteWebsiteApi = (id:string) => api.delete(`/website/${id}`);