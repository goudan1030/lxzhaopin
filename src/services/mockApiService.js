// 模拟API服务 - 用于演示和测试
class MockApiService {
  constructor() {
    this.token = localStorage.getItem('auth_token');
    this.mockData = {
      jobs: [
        {
          id: 1,
          title: '前端开发工程师',
          company: '兰溪科技',
          salary: '8-12K',
          location: '兰溪市',
          requirements: 'Vue.js, React, 2年经验',
          description: '负责前端开发，熟悉Vue.js框架...',
          contact: '13800138001',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          title: 'UI设计师',
          company: '创意设计',
          salary: '6-10K',
          location: '兰溪市',
          requirements: 'Figma, PS, AI',
          description: '负责产品UI设计，有良好审美...',
          contact: '13800138002',
          created_at: new Date().toISOString()
        }
      ],
      plaza: [
        {
          id: 1,
          title: '找个兼职翻译工作',
          category: '翻译',
          description: '英语六级，可以做英文翻译工作，价格面议',
          contact: '13800138003',
          author: '小李',
          likes: 5,
          created_at: new Date().toISOString()
        }
      ],
      talents: [
        {
          id: 1,
          name: '张三',
          age: 25,
          education: '本科',
          major: '计算机科学',
          experience: '2年前端开发经验',
          skills: 'Vue.js, React, Node.js',
          contact: '13800138004',
          created_at: new Date().toISOString()
        }
      ]
    };
  }

  async mockRequest(data, delay = 500) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: data,
          message: '操作成功（模拟数据）'
        });
      }, delay);
    });
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // 认证相关API
  auth = {
    register: async (phone, password) => {
      const mockUser = {
        id: 1,
        phone,
        token: 'mock_token_' + Date.now(),
        profile: null
      };
      this.setToken(mockUser.token);
      return this.mockRequest(mockUser);
    },

    login: async (phone, password) => {
      const mockUser = {
        id: 1,
        phone,
        token: 'mock_token_' + Date.now(),
        profile: {
          name: '测试用户',
          type: 'job_seeker'
        }
      };
      this.setToken(mockUser.token);
      return this.mockRequest(mockUser);
    },

    getProfile: async () => {
      const mockProfile = {
        id: 1,
        phone: '13800138000',
        name: '测试用户',
        type: 'job_seeker'
      };
      return this.mockRequest(mockProfile);
    },

    updateProfile: async (updates) => {
      return this.mockRequest({ ...updates, updated: true });
    },

    completeProfile: async (profileData) => {
      return this.mockRequest({ ...profileData, completed: true });
    },

    logout: async () => {
      this.setToken(null);
      return this.mockRequest({ loggedOut: true });
    }
  };

  // 发布相关API
  posts = {
    createJob: async (jobData) => {
      const newJob = {
        id: this.mockData.jobs.length + 1,
        ...jobData,
        created_at: new Date().toISOString()
      };
      this.mockData.jobs.unshift(newJob);
      return this.mockRequest(newJob);
    },

    createPlaza: async (plazaData) => {
      const newPlaza = {
        id: this.mockData.plaza.length + 1,
        ...plazaData,
        likes: 0,
        created_at: new Date().toISOString()
      };
      this.mockData.plaza.unshift(newPlaza);
      return this.mockRequest(newPlaza);
    },

    createOrUpdateTalent: async (talentData) => {
      const newTalent = {
        id: this.mockData.talents.length + 1,
        ...talentData,
        created_at: new Date().toISOString()
      };
      this.mockData.talents.unshift(newTalent);
      return this.mockRequest(newTalent);
    },

    getMyPosts: async () => {
      return this.mockRequest({
        jobs: this.mockData.jobs.slice(0, 2),
        plaza: this.mockData.plaza.slice(0, 1),
        talents: this.mockData.talents.slice(0, 1)
      });
    },

    getPublicJobs: async (page = 1, limit = 20) => {
      return this.mockRequest(this.mockData.jobs);
    },

    getPublicPlaza: async (page = 1, limit = 20, category = null) => {
      let data = this.mockData.plaza;
      if (category) {
        data = data.filter(item => item.category === category);
      }
      return this.mockRequest(data);
    },

    getPublicTalents: async (page = 1, limit = 20) => {
      return this.mockRequest(this.mockData.talents);
    },

    togglePlazaLike: async (plazaId) => {
      const plaza = this.mockData.plaza.find(p => p.id === plazaId);
      if (plaza) {
        plaza.likes = (plaza.likes || 0) + 1;
      }
      return this.mockRequest({ liked: true, likes: plaza?.likes || 1 });
    },

    getPlazaLikeStatus: async (plazaId) => {
      return this.mockRequest({ liked: false });
    },

    addPlazaComment: async (plazaId, content) => {
      const comment = {
        id: Date.now(),
        content,
        author: '测试用户',
        created_at: new Date().toISOString()
      };
      return this.mockRequest(comment);
    },

    getPlazaComments: async (plazaId, page = 1, limit = 10) => {
      const mockComments = [
        {
          id: 1,
          content: '这个工作看起来不错！',
          author: '用户A',
          created_at: new Date().toISOString()
        }
      ];
      return this.mockRequest(mockComments);
    }
  };

  async health() {
    return this.mockRequest({ status: 'ok', mode: 'mock' });
  }
}

export default MockApiService; 