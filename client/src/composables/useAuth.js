import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '../services/apiService'

export function useAuth() {
  const router = useRouter()
  
  // 状态
  const user = ref(null)
  const loading = ref(false)
  
  // 计算属性
  const isLoggedIn = computed(() => !!user.value)
  const userInfo = computed(() => user.value)

  // 初始化认证状态
  const initAuth = async () => {
    console.log('认证状态初始化完成')
    
    // 检查是否有token
    const token = localStorage.getItem('auth_token')
    if (token) {
      try {
        const response = await apiService.auth.getProfile()
        if (response.success) {
          user.value = response.data
          console.log('认证状态变化: 用户已登录', user.value)
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
        // token可能已过期，清除本地存储
        localStorage.removeItem('auth_token')
        apiService.setToken(null)
      }
    }
  }

  // 手机号登录/注册
  const loginWithPhone = async (phone, password, isRegister = false) => {
    loading.value = true
    try {
      let response

      if (isRegister) {
        response = await apiService.auth.register(phone, password)
      } else {
        response = await apiService.auth.login(phone, password)
      }

      if (response.success) {
        user.value = response.data.user
        return { success: true, data: response.data.user }
      }

      throw new Error(response.error || '操作失败')
    } catch (error) {
      console.error(isRegister ? '注册失败:' : '登录失败:', error)
      return { 
        success: false, 
        error: error.message || (isRegister ? '注册失败' : '登录失败')
      }
    } finally {
      loading.value = false
    }
  }

  // 完善用户资料
  const completeProfile = async (profileData) => {
    if (!user.value?.id) {
      throw new Error('用户未登录')
    }

    loading.value = true
    try {
      const response = await apiService.auth.completeProfile(profileData)

      if (response.success) {
        user.value = response.data.user
        return { success: true, data: response.data.user }
      }

      throw new Error(response.error || '完善资料失败')
    } catch (error) {
      console.error('完善资料失败:', error)
      return { 
        success: false, 
        error: error.message || '完善资料失败'
      }
    } finally {
      loading.value = false
    }
  }

  // 更新用户资料
  const updateProfile = async (updates) => {
    if (!user.value?.id) {
      throw new Error('用户未登录')
    }

    loading.value = true
    try {
      const response = await apiService.auth.updateProfile(updates)

      if (response.success) {
        // 重新获取用户信息
        const profileResponse = await apiService.auth.getProfile()
        if (profileResponse.success) {
          user.value = profileResponse.data
        }
        return { success: true, data: profileResponse.data }
      }

      throw new Error(response.error || '更新失败')
    } catch (error) {
      console.error('更新用户资料失败:', error)
      return { 
        success: false, 
        error: error.message || '更新失败'
      }
    } finally {
      loading.value = false
    }
  }

  // 登出
  const logout = async () => {
    loading.value = true
    try {
      await apiService.auth.logout()
      user.value = null
      return { success: true }
    } catch (error) {
      console.error('登出失败:', error)
      return { 
        success: false, 
        error: error.message || '登出失败'
      }
    } finally {
      loading.value = false
    }
  }

  // 检查登录状态并重定向
  const requireAuth = (redirectPath = '/login') => {
    if (!isLoggedIn.value) {
      const currentPath = router.currentRoute.value.fullPath
      router.push({
        path: redirectPath,
        query: { redirect: currentPath }
      })
      return false
    }
    return true
  }

  // 获取当前用户的详细信息
  const getCurrentUserProfile = async () => {
    if (!user.value?.id) return null

    try {
      const response = await apiService.auth.getProfile()
      return response.success ? response.data : null
    } catch (error) {
      console.error('获取用户详细信息异常:', error)
      return null
    }
  }

  return {
    // 状态
    user: userInfo,
    isLoggedIn,
    loading,
    
    // 方法
    initAuth,
    loginWithPhone,
    completeProfile,
    updateProfile,
    logout,
    requireAuth,
    getCurrentUserProfile,
    
    // 兼容性方法
    login: loginWithPhone,
    register: (phone, password) => loginWithPhone(phone, password, true)
  }
} 