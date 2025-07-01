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

### 方法一：使用整合启动脚本（推荐）

```bash
# 开发模式（前台运行，便于调试）
./start-integrated.sh

# 生产模式（后台运行）
./start-integrated.sh prod
```

### 方法二：使用npm脚本

```bash
# 构建并启动
npm run dev

# 只构建前端
npm run build

# 只启动后端
npm start
```

### 方法三：手动步骤

```bash
# 1. 安装依赖
npm run install:all

# 2. 构建前端
cd client && npm run build

# 3. 启动服务器
cd ../server && npm start
```

## 📁 文件结构变化

```
lxZhaopin/
├── client/                    # 前端源码（开发时）
├── server/                    # 后端源码
│   ├── public/               # 🆕 前端构建输出目录
│   │   ├── index.html        # Vue应用入口
│   │   ├── assets/           # 静态资源
│   │   └── ...
│   ├── app.js                # 🔄 已修改：支持静态文件服务
│   └── ...
├── start-integrated.sh       # 🆕 整合启动脚本
├── start.sh                  # 保留：分离模式启动脚本
└── package.json              # 🔄 已修改：新增整合脚本
```

## 🔧 开发模式

如果你仍然需要前后端分离的开发模式（便于前端热重载调试），可以使用：

```bash
# 启动前后端分离模式
npm run dev:separate

# 或者分别启动
npm run dev:server  # 后端: http://localhost:3000
npm run dev:client  # 前端: http://localhost:5173
```

## 🎯 访问地址

**整合模式：**
- 🌐 网站首页: http://localhost:3000
- 📱 API接口: http://localhost:3000/api
- 🔍 健康检查: http://localhost:3000/api/health

**分离模式（开发时）：**
- 🌐 前端开发: http://localhost:5173
- 📱 后端API: http://localhost:3000/api

## 📋 管理命令

```bash
# 停止服务
./stop.sh

# 查看日志
tail -f logs/server.log

# 清理构建文件
npm run clean

# 重新构建并启动
npm run clean && npm run dev
```

## ✅ 优势

1. **部署简单** - 只需要一个服务器进程
2. **维护方便** - 统一的端口和域名
3. **性能更好** - 减少跨域请求
4. **成本更低** - 只需要一个服务器实例

## 🔄 回退到分离模式

如果需要回退到前后端分离模式，直接使用原来的启动脚本：

```bash
./start.sh
```

## 🎉 总结

整合后的应用更适合小型项目的部署和维护，保持了所有原有功能的同时，简化了架构和部署流程。 