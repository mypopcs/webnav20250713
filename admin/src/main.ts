// /admin/src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router' // 导入路由
import ui from '@nuxt/ui/vue-plugin'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia) // 使用 Pinia
app.use(ui)

app.mount('#app')