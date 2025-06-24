import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 数据库表名常量
export const TABLES = {
  USERS: 'users',
  USER_PROFILES: 'user_profiles',
  COMPANIES: 'companies',
  JOB_CATEGORIES: 'job_categories',
  JOBS: 'jobs',
  TALENTS: 'talents',
  PLAZA_POSTS: 'plaza_posts',
  COMMENTS: 'comments',
  LIKES: 'likes',
  FAVORITES: 'favorites',
  JOB_APPLICATIONS: 'job_applications',
  NOTIFICATIONS: 'notifications'
}

// 通用错误处理
export const handleSupabaseError = (error) => {
  if (error) {
    console.error('Supabase错误:', error)
    return error.message || '操作失败，请重试'
  }
  return null
}

// 检查用户是否已登录
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('获取用户信息失败:', error)
    return null
  }
  return user
}

// 获取用户会话
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) {
    console.error('获取会话失败:', error)
    return null
  }
  return session
} 