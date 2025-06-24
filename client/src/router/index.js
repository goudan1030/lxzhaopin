import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
    {
    path: '/demo',
    name: 'Demo',
    component: () => import('../views/Demo.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/post/:type?',
    name: 'Post',
    component: () => import('../views/Post.vue')
  },
  {
    path: '/complete-profile',
    name: 'CompleteProfile',
    component: () => import('../views/CompleteProfile.vue')
  },
  {
    path: '/agreement',
    name: 'Agreement',
    component: () => import('../views/Agreement.vue')
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('../views/Privacy.vue')
  },
  {
    path: '/job/:id',
    name: 'JobDetail',
    component: () => import('../views/JobDetail.vue')
  },
  {
    path: '/talent/:id',
    name: 'TalentDetail',
    component: () => import('../views/TalentDetail.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫 - 检查用户资料完善状态
router.beforeEach(async (to, from, next) => {
  console.log('路由守卫检查:', { to: to.path, from: from.path })
  
  // 获取token
  const token = localStorage.getItem('auth_token')
  
  // 不需要检查的路由
  const publicRoutes = ['/login', '/complete-profile', '/agreement', '/privacy', '/demo']
  const isPublicRoute = publicRoutes.includes(to.path)
  
  // 如果是公共路由或者没有token，直接通过
  if (!token || isPublicRoute) {
    console.log('公共路由或无token，直接通过')
    return next()
  }
  
  // 如果从登录页面跳转，让Login.vue处理逻辑，避免冲突
  if (from.path === '/login') {
    console.log('从登录页面跳转，跳过路由守卫检查')
    return next()
  }
  
  try {
    // 检查用户信息
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      const user = data.data
      
      // 如果用户未完善资料，强制跳转到完善资料页面
      if (user && user.profile_completed === false) {
        console.log('路由守卫：用户未完善资料，重定向到完善资料页面')
        return next('/complete-profile')
      }
    }
  } catch (error) {
    console.error('检查用户状态失败:', error)
    // 如果检查失败，清除token并跳转到登录页
    localStorage.removeItem('auth_token')
    return next('/login')
  }
  
  console.log('路由守卫检查通过，允许访问')
  next()
})

export default router 