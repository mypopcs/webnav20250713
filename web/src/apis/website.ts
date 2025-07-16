// /web/src/apis/website.ts
import axios from 'axios';

// 用户端也需要一个独立的 Axios 实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
});

/**
 * 获取所有公开的网站数据
 * 未来可以扩展此接口，例如按分类获取等
 */
export const getPublicWebsitesApi = () => {
  return api.get('/website'); // 复用现有的 /website 接口
};