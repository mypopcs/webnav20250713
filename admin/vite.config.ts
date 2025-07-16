// /admin/vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path' // 导入 path 模块

export default defineConfig({
  plugins: [
    vue(),
    // 配置 Element Plus 按需自动导入
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  // 配置 @ 别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})