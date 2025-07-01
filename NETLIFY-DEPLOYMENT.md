# Netlify 部署指南

## 问题诊断

如果您的项目在Netlify上显示空白页面，这通常是因为：

1. **API服务缺失**：Netlify只能部署静态网站，不能运行Node.js后端
2. **路由配置缺失**：Vue单页应用需要重定向配置
3. **环境变量未配置**：API地址需要指向外部服务

## 解决方案

### 方案1：分离部署（推荐）

1. **前端部署到Netlify**：
   ```bash
   # 构建前端
   npm run build
   
   # Netlify会自动使用public目录中的文件
   ```

2. **后端部署到其他平台**：
   - Railway: https://railway.app
   - Render: https://render.com  
   - Heroku: https://heroku.com
   - Vercel Serverless Functions

3. **配置环境变量**：
   在Netlify项目设置中添加：
   ```
   VITE_API_BASE_URL=https://your-backend-url.com/api
   ```

### 方案2：使用Netlify Functions

如果想在Netlify上运行后端逻辑，可以使用Netlify Functions：

1. 创建 `netlify/functions/` 目录
2. 将API逻辑转换为serverless函数
3. 修改前端API调用

### 当前配置说明

项目已包含以下Netlify配置：

1. **netlify.toml**：构建和重定向配置
2. **public/_redirects**：SPA路由重定向
3. **API代理配置**：将`/api/*`请求转发到后端

## 部署步骤

### 仅前端部署（静态网站）

1. **在Netlify中设置环境变量**：
   ```
   VITE_API_BASE_URL = https://你的后端域名.com/api
   ```

2. **修改netlify.toml中的API重定向**：
   ```toml
   [[redirects]]
     from = "/api/*"
     to = "https://你的后端域名.com/api/:splat"
     status = 200
     force = true
   ```

3. **构建和部署**：
   ```bash
   npm run build
   # 然后将public目录内容上传到Netlify
   ```

### 完整部署（前后端分离）

1. **部署后端**（推荐Railway或Render）：
   - 创建新的Git仓库，只包含后端代码
   - 部署到支持Node.js的平台
   - 获取后端URL

2. **配置前端环境变量**：
   - 在Netlify项目设置中添加`VITE_API_BASE_URL`
   - 值为后端URL + `/api`

3. **更新CORS配置**：
   确保后端允许来自Netlify域名的请求

## 测试部署

部署后，检查以下内容：

1. **页面加载**：确保SPA路由正常工作
2. **API连接**：检查浏览器控制台是否有API错误
3. **环境变量**：确认`import.meta.env.VITE_API_BASE_URL`有正确值

## 常见问题

### Q: 页面空白，控制台显示路由错误
A: 确保`public/_redirects`文件存在且配置正确

### Q: API请求失败
A: 检查环境变量配置和后端CORS设置

### Q: 构建失败
A: 确保`package.json`中的构建脚本正确

## 示例环境变量配置

在Netlify项目设置 > Environment variables 中添加：

```
VITE_API_BASE_URL=https://your-api-domain.com/api
```

## 替代方案

如果您希望简化部署，可以考虑：

1. **使用Supabase**：完全托管的后端服务
2. **使用Firebase**：Google的全栈平台
3. **使用Vercel**：支持Full-Stack部署

这些平台可以同时处理前端和后端，避免分离部署的复杂性。 