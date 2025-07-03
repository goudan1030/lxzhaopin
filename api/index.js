// 为Vercel设置环境变量
process.env.VERCEL = true;

const app = require('../app.js');

// 导出Express应用
module.exports = app; 