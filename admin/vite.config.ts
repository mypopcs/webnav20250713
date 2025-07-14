// /admin/vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite' // 导入 NuxtUI Vite 插件

export default defineConfig({
  plugins: [
    vue(),
    ui() // 使用插件
  ]
})