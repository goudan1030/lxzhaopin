# 🚀 Vercel部署指南

## 项目架构说明

**本项目已整合为单一的全栈应用**：
- 前端：Vue 3 + Vite（源码在 `src/` 目录）
- 后端：Node.js + Express（路由在 `routes/` 目录）
- 构建输出：前端构建到 `public/` 目录
- 应用入口：`app.js`（同时提供静态文件和API服务）

## 准备工作

### 1. 安装Vercel CLI
```bash
npm install -g vercel
```

### 2. 登录Vercel
```bash
vercel login
```

## 部署步骤

### 方法一：使用Vercel CLI（推荐）

1. **在项目根目录运行**
```bash
vercel
```

2. **配置环境变量**
在Vercel控制台配置以下环境变量：
- `DB_HOST` - 数据库主机地址
- `DB_PORT` - 数据库端口（默认3306）
- `DB_USER` - 数据库用户名
- `DB_PASSWORD` - 数据库密码
- `DB_NAME` - 数据库名称
- `JWT_SECRET` - JWT密钥
- `NODE_ENV` - 设置为 `production`

3. **生产部署**
```bash
vercel --prod
```

### 方法二：GitHub集成

1. **推送到GitHub**
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

2. **连接GitHub仓库**
- 访问 [Vercel Dashboard](https://vercel.com/dashboard)
- 点击 "Import Project"
- 选择您的GitHub仓库
- 按照向导完成配置

3. **配置环境变量**
在Vercel项目设置中添加上述环境变量

## 项目结构

```
lxZhaopin/
├── src/                    # 前端源码（Vue 3）
├── routes/                 # API路由（Express）
├── middleware/             # 中间件
├── config/                 # 配置文件
├── public/                 # 前端构建输出
├── app.js                  # 应用主入口
├── package.json            # 统一依赖管理
├── vercel.json             # Vercel配置
└── vite.config.js          # 前端构建配置
```

## API路由说明

- **应用首页**：`https://your-app.vercel.app/`
- **API接口**：`https://your-app.vercel.app/api/*`
- **前端路由**：由Vue Router处理，服务器返回index.html

## 数据库配置

确保您的MySQL数据库：
- 允许外部连接
- 配置了正确的用户权限
- 防火墙允许Vercel的IP访问

推荐使用云数据库服务：
- [PlanetScale](https://planetscale.com/)（MySQL兼容）
- [Railway Database](https://railway.app/)
- [Aiven](https://aiven.io/)

## 验证部署

部署完成后，访问以下地址验证：

1. **前端应用**：`https://your-app.vercel.app`
2. **API健康检查**：`https://your-app.vercel.app/api/health`（如果有的话）

## 本地开发

整合后的本地开发更简单：

```bash
# 安装依赖
npm install

# 构建前端
npm run build

# 启动整合应用
npm start

# 或者开发模式（前端热重载）
npm run dev
```

## 持续部署

配置GitHub集成后，每次推送到main分支都会自动部署：

```bash
git add .
git commit -m "Update application"
git push origin main
```

## 环境变量示例

在Vercel项目设置中配置：

```
DB_HOST=your-database-host.com
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=lx_zhaopin
JWT_SECRET=your-very-secret-key
NODE_ENV=production
```

## 常见问题

### 1. 构建失败
- 确保 `package.json` 中包含所有依赖
- 检查Node.js版本兼容性
- 查看Vercel构建日志

### 2. API请求失败
- 检查环境变量是否正确配置
- 确认数据库连接配置
- 查看Vercel函数日志

### 3. 前端路由问题
- 确保 `vercel.json` 配置了正确的重定向规则
- 检查Vue Router配置

## 监控和日志

- 访问Vercel Dashboard查看部署状态
- 使用Vercel CLI查看实时日志：
  ```bash
  vercel logs
  ```
- 监控API性能和错误率

## 优势

与前后端分离部署相比，整合部署的优势：
- **简化运维**：只需维护一个部署
- **统一域名**：避免跨域问题
- **更好性能**：减少网络延迟
- **成本更低**：只需要一个托管服务 