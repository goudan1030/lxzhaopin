// 统一API服务配置
import ApiService from './apiService.js';
import MockApiService from './mockApiService.js';

// 检测运行环境和配置
const isDevelopment = import.meta.env.DEV;
const hasApiUrl = !!import.meta.env.VITE_API_BASE_URL;
const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// 决定使用哪种API服务
let apiService;

if (useMockData || (!hasApiUrl && !isDevelopment)) {
  // 使用模拟数据（强制开启或生产环境无API URL时）
  apiService = new MockApiService();
  console.log('🎭 使用模拟API服务');
} else {
  // 使用真实API服务
  apiService = new ApiService();
  console.log('🔗 使用真实API服务:', import.meta.env.VITE_API_BASE_URL || '/api');
}

// 导出统一的API服务
export { apiService };

// 为了向后兼容，也提供默认导出
export default apiService;

// 环境信息提示
export const getApiInfo = () => ({
  mode: useMockData || (!hasApiUrl && !isDevelopment) ? 'mock' : 'real',
  url: import.meta.env.VITE_API_BASE_URL || '/api',
  isDevelopment,
  hasApiUrl,
  useMockData
});

// 在开发环境显示API状态
if (isDevelopment) {
  const info = getApiInfo();
  console.log('🔧 API配置信息:', info);
  
  if (info.mode === 'mock') {
    console.log(`
🎭 当前使用模拟数据模式
💡 要连接真实API，请设置环境变量：
   VITE_API_BASE_URL=https://your-backend-url.com/api
   
   或者在Netlify部署设置中添加环境变量
    `);
  }
} 