# 🚀 整合应用部署指南

## 项目特点

本项目已整合为**单一全栈应用**：
- ✅ 前端和后端在同一代码库
- ✅ 统一的依赖管理（package.json）
- ✅ 单一应用入口（app.js）
- ✅ 简化的部署流程

## 推荐部署平台

### 🥇 Vercel（首选）
- ✅ 完美支持Node.js全栈应用
- ✅ 自动CI/CD
- ✅ 免费套餐足够小项目使用
- ✅ 详细文档：`VERCEL-DEPLOYMENT.md`

**部署命令**：
```bash
npm install -g vercel
vercel
```

### 🥈 Railway
- ✅ 专门为后端优化
- ✅ 支持数据库托管
- ✅ 简单的配置

**部署步骤**：
1. 访问 [railway.app](https://railway.app)
2. 连接GitHub仓库
3. 配置环境变量
4. 自动部署

### 🥉 Render
- ✅ 支持全栈应用
- ✅ 免费套餐可用
- ✅ 良好的Node.js支持

**部署步骤**：
1. 访问 [render.com](https://render.com)
2. 选择Web Service
3. 连接仓库并配置

### 其他选项
- **Heroku**：传统平台，需要信用卡
- **DigitalOcean App Platform**：性价比高
- **AWS App Runner**：AWS生态用户

## ❌ 不推荐的平台

### Netlify
- ❌ **仅支持静态网站**，无法运行Node.js后端
- ❌ 需要改回前后端分离架构
- ❌ 增加复杂性和成本

### GitHub Pages
- ❌ 仅支持静态网站
- ❌ 无法运行后端服务

## 环境变量配置

所有平台都需要配置以下环境变量：

```
# 数据库配置
DB_HOST=your-database-host
DB_PORT=3306
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=lx_zhaopin

# 应用配置
JWT_SECRET=your-secret-key
NODE_ENV=production
PORT=3000
```

## 本地测试部署

部署前本地测试：

```bash
# 安装依赖
npm install

# 构建前端
npm run build

# 启动生产模式
NODE_ENV=production npm start
```

## 部署前检查清单

- [ ] 数据库配置正确
- [ ] 环境变量已设置
- [ ] 前端构建成功（npm run build）
- [ ] 本地生产模式测试通过
- [ ] Git仓库已推送到remote

## 整合架构的优势

与前后端分离相比：

✅ **简化运维**：一个应用，一个部署
✅ **降低成本**：只需一个托管服务
✅ **减少延迟**：无跨域网络请求
✅ **统一域名**：避免CORS问题
✅ **更好SEO**：服务器端渲染支持
✅ **开发友好**：统一的开发环境

## 常见问题

### Q: 为什么不能用Netlify？
A: Netlify只支持静态网站，我们的应用需要Node.js后端运行数据库操作和API服务。

### Q: 能否重新分离前后端？
A: 可以，但会失去整合的优势，增加维护复杂性。

### Q: 数据库如何部署？
A: 推荐使用云数据库服务：
- PlanetScale（MySQL）
- Railway Database
- Supabase（PostgreSQL）

### Q: 如何进行持续部署？
A: 推荐平台都支持GitHub集成，推送代码即可自动部署。

## 迁移建议

如果您之前使用前后端分离：

1. **评估现状**：确认整合架构符合需求
2. **选择平台**：推荐从Vercel开始
3. **准备数据库**：确保外部访问配置
4. **测试部署**：先在开发环境测试
5. **生产部署**：配置域名和SSL

---

💡 **建议**：对于小到中型项目，整合架构是最佳选择。只有在需要独立扩展前后端时才考虑分离。 