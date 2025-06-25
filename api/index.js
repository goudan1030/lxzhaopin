// 为Vercel设置环境变量
process.env.VERCEL = true;

const app = require('../server/app.js');

// Vercel无服务器函数处理器
module.exports = (req, res) => {
  return app(req, res);
}; 