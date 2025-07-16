// /web/src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
// 引入我们为 Tailwind CSS 创建的主样式文件
import './assets/main.css' 

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')