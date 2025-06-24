import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuth } from './composables/useAuth'

// Vant 组件
import { Tabbar, TabbarItem, Tab, Tabs, NavBar, Button, Field, CellGroup, Cell, Form, Dialog, Toast, Notify } from 'vant'
import 'vant/lib/index.css'

import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 注册 Vant 组件
app.use(Tabbar)
app.use(TabbarItem)
app.use(Tab)
app.use(Tabs)
app.use(NavBar)
app.use(Button)
app.use(Field)
app.use(CellGroup)
app.use(Cell)
app.use(Form)
app.use(Dialog)
app.use(Toast)
app.use(Notify)

// 初始化认证状态
const { initAuth } = useAuth()

// 在应用挂载前初始化认证
initAuth().then(() => {
  console.log('认证状态初始化完成')
  app.mount('#app')
}).catch((error) => {
  console.error('认证初始化失败:', error)
  app.mount('#app') // 即使初始化失败也要挂载应用
})
