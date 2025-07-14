// /admin/src/main.ts
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import ui from '@nuxt/ui/vue-plugin'
import App from './App.vue'
import './assets/main.css' // 导入我们即将创建的 CSS 文件

const app = createApp(App)

const router = createRouter({
  routes: [], // 路由表暂时为空，后续会填充
  history: createWebHistory()
})

app.use(router)
app.use(ui)

app.mount('#app')