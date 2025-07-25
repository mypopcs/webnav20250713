import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  withCredentials: true,
});

// 定义更新用户时的数据传输对象类型
interface UserUpdateDto {
  role?: "admin" | "user";
  isActive?: boolean;
}

/** 获取所有用户 */
export const getAllUsersApi = () => api.get("/user");

/** 更新用户信息 */
export const updateUserApi = (id: string, data: UserUpdateDto) =>
  api.patch(`/user/${id}`, data);

/** 删除用户 */
export const deleteUserApi = (id: string) => api.delete(`/user/${id}`);
