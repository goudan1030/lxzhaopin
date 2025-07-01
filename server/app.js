const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const { testConnection } = require('./config/database');
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 3000;

// 安全中间件
app.use(helmet({
  contentSecurityPolicy: false, // 为了支持内联样式和脚本，在生产环境中应该配置更严格的CSP
}));

// CORS配置 - 由于现在是同域，可以简化CORS配置
const corsOptions = {
  origin: process.env.CORS_ORIGIN || true, // 同域请求
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 限流配置
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每个IP最多100次请求
  message: { error: '请求过于频繁，请稍后再试' }
});
app.use('/api/', limiter);

// 解析JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务 - 提供前端构建后的文件
const staticPath = path.join(__dirname, 'public');
app.use(express.static(staticPath));

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: '兰溪招聘API服务运行正常',
    timestamp: new Date().toISOString() 
  });
});

// SPA支持 - 所有非API请求都返回index.html，让前端路由处理
app.get('*', (req, res) => {
  // 排除API路由
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API路径不存在' });
  }
  
  // 返回前端应用
  res.sendFile(path.join(staticPath, 'index.html'));
});

// 错误处理中间件
app.use((error, req, res, next) => {
  console.error('服务器错误:', error);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? '服务器内部错误' 
      : error.message 
  });
});

// 对于Vercel，导出app而不是启动服务器
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // 本地开发时启动服务器
  async function startServer() {
    try {
      // 测试数据库连接
      await testConnection();
      
      app.listen(PORT, () => {
        console.log(`🚀 兰溪招聘系统启动成功！`);
        console.log(`🌐 访问地址: http://localhost:${PORT}`);
        console.log(`📱 API地址: http://localhost:${PORT}/api`);
        console.log(`🔍 健康检查: http://localhost:${PORT}/api/health`);
        console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
        console.log(`📁 静态文件目录: ${staticPath}`);
      });
    } catch (error) {
      console.error('❌ 服务器启动失败:', error);
      process.exit(1);
    }
  }

  startServer();
} 