import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase, TABLES, handleSupabaseError } from '../lib/supabase'

const user = ref(null)
const session = ref(null)
const loading = ref(false)

export function useAuth() {
  const router = useRouter()

  // 计算属性
  const isLoggedIn = computed(() => !!user.value)
  const userInfo = computed(() => user.value)

  // 初始化认证状态
  const initAuth = async () => {
    loading.value = true
    try {
      // 获取当前会话
      const { data: { session: currentSession }, error } = await supabase.auth.getSession()
      if (error) throw error

      if (currentSession) {
        session.value = currentSession
        await fetchUserProfile(currentSession.user.id)
      }

      // 监听认证状态变化
      supabase.auth.onAuthStateChange(async (event, newSession) => {
        console.log('认证状态变化:', event, newSession)
        
        if (event === 'SIGNED_IN' && newSession) {
          session.value = newSession
          await fetchUserProfile(newSession.user.id)
        } else if (event === 'SIGNED_OUT') {
          session.value = null
          user.value = null
        }
      })
    } catch (error) {
      console.error('初始化认证失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 获取用户资料
  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116表示记录不存在
        throw error
      }

      user.value = data || { 
        id: userId, 
        phone: session.value?.user?.phone || '',
        name: '新用户',
        avatar_url: null
      }
    } catch (error) {
      console.error('获取用户资料失败:', error)
    }
  }

  // 手机号登录/注册
  const loginWithPhone = async (phone, password, isRegister = false) => {
    loading.value = true
    try {
      let result

      if (isRegister) {
        // 注册：使用手机号作为email (使用更标准的邮箱格式)
        result = await supabase.auth.signUp({
          email: `${phone}@mobile.com`,
          password,
          options: {
            data: {
              phone: phone
            }
          }
        })
      } else {
        // 登录
        result = await supabase.auth.signInWithPassword({
          email: `${phone}@mobile.com`,
          password
        })
      }

      const { data, error } = result

      if (error) {
        const errorMsg = handleSupabaseError(error)
        throw new Error(errorMsg)
      }

      if (data.user) {
        session.value = data.session
        
        if (isRegister) {
          // 注册成功后创建用户记录
          await createUserProfile(data.user.id, phone, '新用户')
        }
        
        await fetchUserProfile(data.user.id)
        return { success: true, data: data.user }
      }

      throw new Error('登录失败')
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

  // 创建用户资料
  const createUserProfile = async (userId, phone, name = '新用户') => {
    try {
      const { error } = await supabase
        .from(TABLES.USERS)
        .insert({
          id: userId,
          phone: phone,
          name: name,
          avatar_url: null,
          role: 'user',
          status: 'active'
        })

      if (error) {
        console.error('创建用户资料失败:', error)
      }
    } catch (error) {
      console.error('创建用户资料异常:', error)
    }
  }

  // 更新用户资料
  const updateProfile = async (updates) => {
    if (!user.value?.id) {
      throw new Error('用户未登录')
    }

    loading.value = true
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .update(updates)
        .eq('id', user.value.id)
        .select()
        .single()

      if (error) {
        const errorMsg = handleSupabaseError(error)
        throw new Error(errorMsg)
      }

      user.value = { ...user.value, ...data }
      return { success: true, data }
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
      const { error } = await supabase.auth.signOut()
      if (error) {
        const errorMsg = handleSupabaseError(error)
        throw new Error(errorMsg)
      }

      session.value = null
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

  // 获取当前用户的详细信息（包括扩展资料）
  const getCurrentUserProfile = async () => {
    if (!user.value?.id) return null

    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select(`
          *,
          user_profiles (*)
        `)
        .eq('id', user.value.id)
        .single()

      if (error) {
        console.error('获取用户详细信息失败:', error)
        return null
      }

      return data
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
    updateProfile,
    logout,
    requireAuth,
    getCurrentUserProfile,
    
    // 兼容性方法
    login: loginWithPhone,
    register: (phone, password) => loginWithPhone(phone, password, true)
  }
} 