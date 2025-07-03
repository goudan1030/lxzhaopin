const app = require('../app.js');

// 标准的Vercel函数导出
module.exports = (req, res) => {
  // 设置Vercel环境变量
  process.env.VERCEL = 'true';
  
  // 让Express处理请求
  app(req, res);
}; 