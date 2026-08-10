import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
// 이거 뭔지 나중에 확인하기
//import ElementPlus from 'element-plus'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// app.use(ElementPlus)
app.mount('#app')
