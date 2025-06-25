# 🚀 Vercel部署指南

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

1. **初始化项目**
```bash
vercel
```

2. **配置环境变量**
在Vercel控制台或使用CLI配置以下环境变量：
- `DB_HOST` - 数据库主机地址
- `DB_PORT` - 数据库端口（默认3306）
- `DB_USER` - 数据库用户名
- `DB_PASSWORD` - 数据库密码
- `DB_NAME` - 数据库名称
- `JWT_SECRET` - JWT密钥
- `NODE_ENV` - 设置为 `production`
- `CORS_ORIGIN` - 您的Vercel域名（如：https://your-app.vercel.app）

3. **部署**
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
在Vercel项目设置中添加环境变量

## 重要配置说明

### 1. 项目结构
```
/
├── api/                 # Vercel API函数
│   └── index.js        # API入口文件
├── client/             # Vue前端应用
│   ├── dist/          # 构建输出（自动生成）
│   └── ...
├── server/             # Express后端代码
├── vercel.json         # Vercel配置文件
└── package.json        # 根package.json
```

### 2. API路由
- 前端应用：`https://your-app.vercel.app/`
- API接口：`https://your-app.vercel.app/api/*`

### 3. 数据库连接
确保您的MySQL数据库：
- 允许外部连接
- 配置了正确的用户权限
- 防火墙允许Vercel的IP访问

## 验证部署

部署完成后，访问以下地址验证：

1. **前端应用**：`https://your-app.vercel.app`
2. **API健康检查**：`https://your-app.vercel.app/api/health`

## 常见问题

### 1. API请求失败
- 检查环境变量是否正确配置
- 确认数据库连接配置
- 查看Vercel函数日志

### 2. 构建失败
- 确保所有依赖都在package.json中
- 检查Node.js版本兼容性
- 查看构建日志

### 3. 数据库连接问题
- 确认数据库服务器允许外部连接
- 检查数据库用户权限
- 验证连接字符串

## 持续部署

配置GitHub集成后，每次推送到main分支都会自动部署：

```bash
git add .
git commit -m "Update application"
git push origin main
```

## 本地开发

部署后仍可本地开发：

```bash
# 安装依赖
npm run install:all

# 启动前端
npm run dev:client

# 启动后端
npm run dev:server
```

## 监控和日志

- 访问Vercel Dashboard查看部署状态
- 使用Vercel CLI查看实时日志：`vercel logs`
- 监控API性能和错误率 