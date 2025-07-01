import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'


// Vant 组件
import { Tabbar, TabbarItem, Tab, Tabs, NavBar, Button, Field, CellGroup, Cell, Form, Dialog, Toast, Notify, Icon, ActionSheet, PullRefresh } from 'vant'
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
app.use(Icon)
app.use(ActionSheet)
app.use(PullRefresh)

// 直接挂载应用，认证初始化在App.vue中处理
app.mount('#app')
