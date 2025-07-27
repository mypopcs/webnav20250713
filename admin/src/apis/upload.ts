import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  withCredentials: true,
});

/**
 * 上传单个图片文件
 * @param file 文件对象
 * @returns { url: string }
 */
export const uploadImageApi = (file: File) => {
  const formData = new FormData();
  formData.append("file", file); // 'file' 必须与后端 FileInterceptor 的字段名一致

  return api.post("/upload/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
