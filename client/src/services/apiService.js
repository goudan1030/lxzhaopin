// API服务 - 替代Supabase
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  // 设置认证token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // 获取认证头
  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // 通用请求方法
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '请求失败');
      }

      return data;
    } catch (error) {
      console.error('API请求失败:', error);
      throw error;
    }
  }

  // GET请求
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST请求
  async post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body,
    });
  }

  // PUT请求
  async put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body,
    });
  }

  // DELETE请求
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // 认证相关API
  auth = {
    // 注册
    register: async (phone, password) => {
      const response = await this.post('/auth/register', {
        phone,
        password
      });
      
      if (response.success && response.data.token) {
        this.setToken(response.data.token);
      }
      
      return response;
    },

    // 登录
    login: async (phone, password) => {
      const response = await this.post('/auth/login', {
        phone,
        password
      });
      
      if (response.success && response.data.token) {
        this.setToken(response.data.token);
      }
      
      return response;
    },

    // 获取当前用户信息
    getProfile: async () => {
      return this.get('/auth/profile');
    },

    // 更新用户信息
    updateProfile: async (updates) => {
      return this.put('/auth/profile', updates);
    },

    // 完善用户资料
    completeProfile: async (profileData) => {
      return this.post('/auth/complete-profile', profileData);
    },

    // 登出
    logout: async () => {
      this.setToken(null);
      return { success: true };
    }
  };

  // 检查健康状态
  async health() {
    return this.get('/health');
  }
}

// 创建单例实例
const apiService = new ApiService();

export default apiService; 