import { supabase, TABLES, handleSupabaseError } from '../lib/supabase'

// ========== 用户相关操作 ==========

export const userService = {
  // 获取用户详细信息
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select(`
          *,
          user_profiles (*)
        `)
        .eq('id', userId)
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // 更新用户资料
  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  }
}

// ========== 职位相关操作 ==========

export const jobService = {
  // 获取职位列表
  async getJobs(filters = {}) {
    try {
      let query = supabase
        .from(TABLES.JOBS)
        .select(`
          *,
          companies (name, logo_url),
          job_categories (name)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      // 应用过滤条件
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }
      if (filters.keyword) {
        query = query.or(`title.ilike.%${filters.keyword}%,description.ilike.%${filters.keyword}%`)
      }
      if (filters.category) {
        query = query.eq('category_id', filters.category)
      }

      const { data, error } = await query

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // 获取职位详情
  async getJobDetail(jobId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.JOBS)
        .select(`
          *,
          companies (*),
          job_categories (name)
        `)
        .eq('id', jobId)
        .single()

      if (error) throw error

      // 增加浏览次数
      await supabase
        .from(TABLES.JOBS)
        .update({ views_count: data.views_count + 1 })
        .eq('id', jobId)

      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // 发布职位
  async createJob(jobData) {
    try {
      const { data, error } = await supabase
        .from(TABLES.JOBS)
        .insert(jobData)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // 获取职位分类
  async getJobCategories() {
    try {
      const { data, error } = await supabase
        .from(TABLES.JOB_CATEGORIES)
        .select('*')
        .order('sort_order')

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  }
}

// ========== 人才相关操作 ==========

export const talentService = {
  // 获取人才列表
  async getTalents(filters = {}) {
    try {
      let query = supabase
        .from(TABLES.TALENTS)
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      // 应用过滤条件
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }
      if (filters.position) {
        query = query.ilike('desired_position', `%${filters.position}%`)
      }

      const { data, error } = await query

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // 获取人才详情
  async getTalentDetail(talentId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.TALENTS)
        .select('*')
        .eq('id', talentId)
        .single()

      if (error) throw error

      // 增加浏览次数
      await supabase
        .from(TABLES.TALENTS)
        .update({ views_count: data.views_count + 1 })
        .eq('id', talentId)

      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // 创建/更新人才简历
  async createOrUpdateTalent(talentData) {
    try {
      const { data, error } = await supabase
        .from(TABLES.TALENTS)
        .upsert(talentData)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  }
}

// ========== 找活广场相关操作 ==========

export const plazaService = {
  // 获取找活广场列表
  async getPlazaPosts(filters = {}) {
    try {
      let query = supabase
        .from(TABLES.PLAZA_POSTS)
        .select(`
          *,
          users (name, avatar_url)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // 发布找活信息
  async createPlazaPost(postData) {
    try {
      const { data, error } = await supabase
        .from(TABLES.PLAZA_POSTS)
        .insert(postData)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // 点赞/取消点赞
  async toggleLike(userId, postId) {
    try {
      // 检查是否已点赞
      const { data: existingLike, error: checkError } = await supabase
        .from(TABLES.LIKES)
        .select('id')
        .eq('user_id', userId)
        .eq('plaza_post_id', postId)
        .single()

      if (checkError && checkError.code !== 'PGRST116') throw checkError

      if (existingLike) {
        // 取消点赞
        const { error } = await supabase
          .from(TABLES.LIKES)
          .delete()
          .eq('user_id', userId)
          .eq('plaza_post_id', postId)

        if (error) throw error
        return { success: true, isLiked: false }
      } else {
        // 点赞
        const { error } = await supabase
          .from(TABLES.LIKES)
          .insert({
            user_id: userId,
            plaza_post_id: postId
          })

        if (error) throw error
        return { success: true, isLiked: true }
      }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // 检查用户是否已点赞
  async checkUserLike(userId, postId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.LIKES)
        .select('id')
        .eq('user_id', userId)
        .eq('plaza_post_id', postId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return { success: true, isLiked: !!data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  }
}

// ========== 评论相关操作 ==========

export const commentService = {
  // 获取评论列表
  async getComments(postId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.COMMENTS)
        .select(`
          *,
          users (name, avatar_url)
        `)
        .eq('plaza_post_id', postId)
        .eq('status', 'active')
        .order('created_at', { ascending: true })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // 添加评论
  async addComment(commentData) {
    try {
      const { data, error } = await supabase
        .from(TABLES.COMMENTS)
        .insert(commentData)
        .select(`
          *,
          users (name, avatar_url)
        `)
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  }
}

// ========== 收藏相关操作 ==========

export const favoriteService = {
  // 切换收藏状态
  async toggleFavorite(userId, targetType, targetId) {
    try {
      // 检查是否已收藏
      const { data: existingFavorite, error: checkError } = await supabase
        .from(TABLES.FAVORITES)
        .select('id')
        .eq('user_id', userId)
        .eq('target_type', targetType)
        .eq('target_id', targetId)
        .single()

      if (checkError && checkError.code !== 'PGRST116') throw checkError

      if (existingFavorite) {
        // 取消收藏
        const { error } = await supabase
          .from(TABLES.FAVORITES)
          .delete()
          .eq('user_id', userId)
          .eq('target_type', targetType)
          .eq('target_id', targetId)

        if (error) throw error
        return { success: true, isFavorited: false }
      } else {
        // 添加收藏
        const { error } = await supabase
          .from(TABLES.FAVORITES)
          .insert({
            user_id: userId,
            target_type: targetType,
            target_id: targetId
          })

        if (error) throw error
        return { success: true, isFavorited: true }
      }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // 检查收藏状态
  async checkFavoriteStatus(userId, targetType, targetId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.FAVORITES)
        .select('id')
        .eq('user_id', userId)
        .eq('target_type', targetType)
        .eq('target_id', targetId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return { success: true, isFavorited: !!data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // 获取用户收藏列表
  async getUserFavorites(userId, targetType = null) {
    try {
      let query = supabase
        .from(TABLES.FAVORITES)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (targetType) {
        query = query.eq('target_type', targetType)
      }

      const { data, error } = await query

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  }
}

// ========== 公司相关操作 ==========

export const companyService = {
  // 获取公司列表
  async getCompanies() {
    try {
      const { data, error } = await supabase
        .from(TABLES.COMPANIES)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // 创建公司
  async createCompany(companyData) {
    try {
      const { data, error } = await supabase
        .from(TABLES.COMPANIES)
        .insert(companyData)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  }
} 