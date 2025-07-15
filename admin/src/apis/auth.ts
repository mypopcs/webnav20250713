// /admin/src/apis/auth.ts
import axios from 'axios';

// 创建一个 Axios 实例，可以进行统一的配置
const api = axios.create({
  // 从环境变量中获取后端的地址和端口
  // 注意：Vite 中环境变量需要以 VITE_ 开头
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  // withCredentials: true 允许多次请求之间共享 Cookie
  withCredentials: true,
});

/**
 * 登录接口
 * @param data 包含 email 和 password
 */
export const loginApi = (data: any) => {
  return api.post('/auth/login', data);
};

/**
 * 获取用户信息接口
 */
export const getProfileApi = () => {
  return api.get('/auth/profile');
};

/**
 * 退出登录接口
 */
export const logoutApi = () => {
  return api.post('/auth/logout');
};