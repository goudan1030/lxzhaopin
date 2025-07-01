# 兰溪招聘 - 整合后项目结构 📁

## 🎯 整合说明

项目已从前后端分离架构整合为**统一的文件夹结构**，消除了client和server的分离，所有文件按功能组织在根目录下。

## 📂 新的项目结构

```
lxZhaopin/                          # 项目根目录
├── src/                            # 🎨 前端源码
│   ├── components/                 # Vue组件
│   │   ├── JobCard.vue            # 职位卡片组件
│   │   ├── JobList.vue            # 招聘信息列表
│   │   ├── PlazaList.vue          # 找活广场列表
│   │   └── TalentList.vue         # 求职人才列表
│   ├── views/                     # 页面组件
│   │   ├── Home.vue               # 主页 (三Tab)
│   │   ├── JobDetail.vue          # 招聘详情页
│   │   ├── TalentDetail.vue       # 人才详情页
│   │   ├── Login.vue              # 登录/注册页
│   │   ├── Post.vue               # 发布页面
│   │   ├── CompleteProfile.vue    # 完善资料页
│   │   ├── Agreement.vue          # 用户协议页
│   │   ├── Privacy.vue            # 隐私政策页
│   │   └── Demo.vue               # 功能演示页
│   ├── services/                  # 前端服务
│   │   ├── apiService.js          # API服务封装
│   │   └── dataService.js         # 数据服务
│   ├── composables/               # 组合式函数
│   │   ├── useAuth.js             # 用户认证
│   │   └── useLocalStorage.js     # 本地存储
│   ├── stores/                    # Pinia状态管理
│   │   └── user.js                # 用户状态
│   ├── router/                    # Vue路由
│   │   └── index.js               # 路由配置
│   ├── lib/                       # 第三方库
│   │   └── supabase.js            # Supabase配置
│   ├── assets/                    # 静态资源
│   │   └── vue.svg                # Vue图标
│   ├── App.vue                    # 根组件
│   ├── main.js                    # 应用入口
│   └── style.css                  # 全局样式
├── routes/                        # 🚀 API路由
│   ├── auth.js                    # 认证路由
│   └── posts.js                   # 发布相关路由
├── middleware/                    # 🛡️ 中间件
│   └── auth.js                    # 认证中间件
├── config/                        # ⚙️ 配置文件
│   ├── database.js                # 数据库配置
│   └── database-sqlite.js         # SQLite配置
├── public/                        # 📁 静态文件（构建输出）
│   ├── index.html                 # 构建后的HTML
│   ├── assets/                    # 构建后的资源
│   ├── 64.jpeg                    # 图片资源
│   └── vite.svg                   # Vite图标
├── database/                      # 🗄️ 数据库相关
│   ├── supabase-schema.sql        # Supabase表结构
│   ├── mysql-schema.sql           # MySQL表结构
│   ├── sample-data.sql            # 示例数据
│   └── README.md                  # 数据库文档
├── logs/                          # 📝 运行日志
│   ├── server.log                 # 服务器日志
│   ├── server.pid                 # 进程ID
│   └── ...
├── api/                           # 📡 API文档/测试（保留）
│   └── index.js                   # API说明
├── app.js                         # 🎯 应用主入口（Express服务器）
├── package.json                   # 📦 项目依赖（合并后）
├── vite.config.js                 # ⚡ Vite构建配置
├── index.html                     # 🌐 HTML模板
├── .env                           # 🔐 环境变量
├── .env.example                   # 🔐 环境变量示例
├── .gitignore                     # 🙈 Git忽略规则
├── start-integrated.sh            # 🚀 整合启动脚本
├── test-integrated.sh             # 🧪 系统测试脚本
├── README.md                      # 📖 项目说明
├── INTEGRATED-README.md           # 📖 整合版指南
├── PROJECT-STRUCTURE.md           # 📁 本文档
└── ...其他配置文件
```

## 🔄 与之前的对比

### ❌ 之前的分离结构
```
lxZhaopin/
├── client/                        # 前端项目
│   ├── src/                       # 前端源码
│   ├── package.json               # 前端依赖
│   └── vite.config.js             # 前端配置
├── server/                        # 后端项目
│   ├── routes/                    # API路由
│   ├── config/                    # 后端配置
│   ├── package.json               # 后端依赖
│   ├── app.js                     # 后端入口
│   └── public/                    # 构建输出
└── 其他文件...
```

### ✅ 现在的整合结构
```
lxZhaopin/
├── src/                           # 前端源码
├── routes/                        # API路由
├── config/                        # 配置文件
├── public/                        # 静态文件
├── app.js                         # 应用入口
├── package.json                   # 统一依赖
└── 其他文件...
```

## 🎯 整合优势

### 1. **文件结构更清晰**
- 按功能组织，而非按技术栈分离
- 减少嵌套层级，文件更易找到
- 统一的依赖管理

### 2. **开发更便捷**
- 一个`package.json`管理所有依赖
- 一个启动脚本运行整个应用
- 配置文件集中管理

### 3. **部署更简单**
- 只需部署一个项目
- 静态文件和API在同一域名
- 减少跨域配置

### 4. **维护更容易**
- 代码结构一目了然
- 统一的版本控制
- 简化的CI/CD流程

## 🚀 启动方式

### 快速启动
```bash
# 整合模式启动
./start-integrated.sh

# 或使用npm脚本
npm run dev
```

### 开发模式
```bash
# 前端开发（支持热重载）
npm run dev:frontend

# 后端开发（支持自动重启）
npm run dev:backend

# 前后端同时开发
npm run dev:separate
```

### 构建部署
```bash
# 构建前端
npm run build

# 启动生产服务器
npm start
```

## 📋 文件说明

### 🎨 前端相关
- `src/` - 所有Vue.js前端源码
- `index.html` - HTML模板文件
- `vite.config.js` - Vite构建配置
- `public/` - 构建输出的静态文件

### 🚀 后端相关
- `app.js` - Express服务器主文件
- `routes/` - API路由定义
- `middleware/` - Express中间件
- `config/` - 服务器配置文件

### 📦 项目配置
- `package.json` - 统一的项目依赖
- `.env` - 环境变量配置
- `.gitignore` - Git忽略规则

### 📖 文档
- `README.md` - 项目主要说明
- `INTEGRATED-README.md` - 整合版使用指南
- `PROJECT-STRUCTURE.md` - 本文档

## 🎉 总结

整合后的项目结构更加简洁明了，消除了前后端分离带来的复杂性，同时保持了代码的组织性和可维护性。这种结构特别适合中小型项目，既能享受现代化前端技术的便利，又能保持项目的简单性。 