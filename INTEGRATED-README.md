# 兰溪招聘 - 整合版使用指南 🎯

## ✨ 整合说明

项目已从前后端分离架构整合为**单一服务器应用**，现在只需要运行一个Express服务器即可同时提供前端页面和后端API服务。

## 🏗️ 架构变更

### 之前（前后端分离）
```
前端 (Vue + Vite) → http://localhost:5173
后端 (Express API) → http://localhost:3000
```

### 现在（整合版）
```
整合服务器 (Express + 静态文件) → http://localhost:3000
├── 前端页面: http://localhost:3000/
├── API接口: http://localhost:3000/api/
└── 静态资源: http://localhost:3000/assets/
```

## 🚀 启动方式

### 方法一：使用npm脚本（推荐）

```bash
# 安装依赖
npm install

# 开发模式（前端热重载）
npm run dev

# 生产模式（构建+启动）
npm run build && npm start
```

### 方法二：使用启动脚本

```bash
# 开发模式
./start-integrated.sh

# 生产模式
./start-integrated.sh prod
```

### 方法三：手动步骤

```bash
# 1. 安装依赖
npm install

# 2. 构建前端到public目录
npm run build

# 3. 启动整合服务器
npm start
```

## 📁 文件结构变化

```
lxZhaopin/
├── src/                      # 🆕 前端源码（Vue 3）
├── routes/                   # 🆕 API路由
├── middleware/               # 🆕 中间件
├── config/                   # 🆕 配置文件
├── public/                   # 🆕 前端构建输出目录
│   ├── index.html            # Vue应用入口
│   ├── assets/               # 静态资源
│   └── ...
├── app.js                    # 🆕 整合应用入口
├── package.json              # 🆕 统一依赖管理
├── vite.config.js            # 🆕 前端构建配置
└── 启动脚本和其他文件...
```

## 🔧 开发模式

整合后的开发更简单：

```bash
# 开发模式（前端热重载+后端自动重启）
npm run dev

# 仅构建前端
npm run build

# 仅启动后端
npm start
```

开发模式特点：
- ✅ 前端支持热重载（Vite）
- ✅ 后端自动重启（nodemon）
- ✅ 统一端口，无跨域问题

## 🎯 访问地址

**整合应用：**
- 🌐 网站首页: http://localhost:3000
- 📱 API接口: http://localhost:3000/api
- 🔍 健康检查: http://localhost:3000/api/health

**开发模式时：**
- 前端和后端都运行在同一端口，避免跨域问题
- API调用直接使用相对路径 `/api/*`

## 📋 管理命令

```bash
# 停止服务
./stop.sh

# 查看日志
tail -f logs/server.log

# 清理构建文件（public目录）
rm -rf public/*

# 重新构建并启动
npm run build && npm start
```

## ✅ 优势

1. **部署简单** - 只需要一个服务器进程
2. **维护方便** - 统一的端口和域名
3. **性能更好** - 减少跨域请求
4. **成本更低** - 只需要一个服务器实例

## 🚀 生产部署

### 推荐部署平台

1. **Vercel（首选）** - 完美支持Node.js全栈应用
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Railway** - 专门为后端优化，支持数据库托管

3. **Render** - 免费套餐，良好的Node.js支持

### ❌ 不建议的平台

- **Netlify** - 仅支持静态网站，无法运行Node.js后端
- **GitHub Pages** - 仅支持静态内容

详细部署指南请参考：
- 📖 `DEPLOYMENT-GUIDE.md` - 整合应用部署指南
- 📖 `VERCEL-DEPLOYMENT.md` - Vercel详细部署步骤

## 🎉 总结

整合后的应用更适合小型项目的部署和维护，保持了所有原有功能的同时，简化了架构和部署流程。 