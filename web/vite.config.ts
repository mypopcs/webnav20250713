// /web/vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // 导入 path 模块
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss()
  ],
  // 保留 @ 别名配置
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})