# 兰溪招聘 H5 项目 📱

<div align="center">

![Vue 3](https://img.shields.io/badge/vue-3.0-brightgreen.svg)
![Vant](https://img.shields.io/badge/vant-4.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**现代化移动端招聘平台，严格按照设计稿开发**

[在线演示](http://localhost:5173) | [设计原型](./index.html)

</div>

---

## ✨ 项目特色

🎯 **严格遵循设计规范** - 完全按照HTML原型文档的颜色、字体、间距规范开发  
📱 **移动端优先** - 完美适配手机屏幕，流畅的触摸体验  
🚀 **现代化技术栈** - Vue 3 + Composition API + Vant UI  
💬 **完整交互功能** - 登录验证、发布、收藏、联系、评论等社交功能  
🎨 **精美界面设计** - 专业的UI设计，优秀的用户体验

---

## 🏗️ 项目架构

### 前端架构 (已完成 ✅)
- **框架**: Vue 3 + Composition API
- **构建工具**: Vite
- **UI组件库**: Vant
- **路由**: Vue Router
- **状态管理**: Pinia (用户认证)
- **样式**: CSS3 + CSS Variables

### 后端架构 (规划中 📋)
- **框架**: Node.js + Express
- **数据库**: MongoDB
- **认证**: JWT
- **API**: RESTful API

---

## 📦 功能模块

### ✅ 已完成功能

#### 🏠 核心页面 (9个)
- **Home.vue** - 主页三Tab界面 (招聘信息/找活广场/求职人才)
- **JobDetail.vue** - 招聘详情页，完整的职位信息展示
- **TalentDetail.vue** - 人才详情页，个人简历信息展示
- **Login.vue** - 登录/注册页面，支持模式切换
- **Post.vue** - 发布页面，支持发布招聘/找活/简历三种类型
- **CompleteProfile.vue** - 完善个人信息页面
- **Agreement.vue** - 用户协议页面
- **Privacy.vue** - 隐私政策页面
- **Demo.vue** - 功能演示页面，展示所有页面功能

#### 🧩 核心组件 (4个)
- **JobList.vue** - 招聘信息列表组件
- **JobCard.vue** - 职位卡片组件
- **PlazaList.vue** - 找活广场列表组件，支持点赞评论
- **TalentList.vue** - 人才列表组件

#### 🔐 用户认证系统
- **useAuth.js** - 全局用户状态管理
- 登录/注册功能，支持表单验证
- 登录状态持久化 (localStorage)
- 需要登录的操作自动跳转登录页
- 登录成功后智能回跳原页面

#### 🎛️ 交互功能
- **收藏功能** - 收藏职位和人才
- **联系功能** - 查看联系方式，登录验证
- **点赞评论** - 找活广场支持点赞和评论
- **发布功能** - 发布招聘、找活信息、完善简历
- **智能返回** - 记住发布来源Tab，智能返回

#### 🎨 UI/UX 特色
- **悬浮操作按钮** - 右下角FAB发布按钮
- **悬浮返回按钮** - 详情页左下角返回按钮  
- **美观弹窗** - 联系方式、收藏成功等弹窗提示
- **响应式设计** - 完美适配各种手机屏幕
- **流畅动画** - 按钮点击、页面切换动画效果

---

## 🎨 设计规范

### 色彩规范
```css
--primary-color: #3182CE    /* 主色调 (蓝色) */
--accent-color: #DD6B20     /* 强调色 (橙色，薪资显示) */
--text-primary: #2D3748     /* 主要文字 */
--text-secondary: #718096   /* 次要文字 */
--background-color: #F7FAFC /* 页面背景 */
--card-background: #FFFFFF  /* 卡片背景 */
--border-color: #E2E8F0     /* 边框颜色 */
```

### 字体规范
- **标题**: 18px, 字重 600
- **正文**: 14px, 字重 400  
- **小字**: 12px, 字重 400

### 间距规范
- **页面边距**: 16px
- **卡片间距**: 12px
- **内容间距**: 8px

---

## 📁 项目结构

```
lxZhaopin/
├── client/                 # 前端项目 (Vue 3) ✅
│   ├── src/
│   │   ├── components/     # 可复用组件 ✅
│   │   │   ├── JobCard.vue      # 职位卡片组件
│   │   │   ├── JobList.vue      # 招聘信息列表
│   │   │   ├── PlazaList.vue    # 找活广场列表 (支持点赞评论)
│   │   │   └── TalentList.vue   # 求职人才列表
│   │   ├── views/          # 页面组件 ✅
│   │   │   ├── Home.vue         # 主页 (三Tab)
│   │   │   ├── JobDetail.vue    # 招聘详情页
│   │   │   ├── TalentDetail.vue # 人才详情页
│   │   │   ├── Login.vue        # 登录/注册页
│   │   │   ├── Post.vue         # 发布页面
│   │   │   ├── CompleteProfile.vue # 完善资料页
│   │   │   ├── Agreement.vue    # 用户协议页
│   │   │   ├── Privacy.vue      # 隐私政策页
│   │   │   └── Demo.vue         # 功能演示页
│   │   ├── composables/    # 组合式函数 ✅
│   │   │   └── useAuth.js       # 用户认证状态管理
│   │   ├── router/         # 路由配置 ✅
│   │   │   └── index.js         # 完整路由定义
│   │   ├── stores/         # Pinia状态管理 ✅
│   │   │   └── user.js          # 用户状态
│   │   ├── assets/         # 静态资源
│   │   │   └── vue.svg
│   │   ├── App.vue         # 根组件 ✅
│   │   ├── main.js         # 应用入口 ✅
│   │   └── style.css       # 全局样式 ✅
│   ├── package.json        # 依赖配置 ✅
│   └── vite.config.js      # Vite配置 ✅
├── server/                 # 后端项目 (规划中) 📋
├── index.html              # HTML原型设计稿 ✅
└── README.md               # 项目文档 ✅
```

---

## 🚀 快速开始

### 环境要求
- Node.js 16+ 
- npm 或 yarn

### 安装依赖
```bash
cd client
npm install
```

### 启动开发服务器
```bash
npm run dev
# 或者
yarn dev
```

### 项目构建
```bash
npm run build
# 或者  
yarn build
```

---

## 📱 页面展示

### 🏠 主页 - 三Tab界面
- **招聘信息Tab**: 显示最新职位信息，支持查看详情
- **找活广场Tab**: 用户发布找活信息，支持点赞评论互动
- **求职人才Tab**: 展示求职者简历，支持查看详情

### 💼 详情页面
- **职位详情**: 完整的职位描述、要求、福利待遇
- **人才详情**: 个人简历、工作经历、教育背景
- **交互功能**: 收藏、联系、返回等操作

### ✍️ 发布功能  
- **发布招聘**: 职位信息、公司介绍、联系方式
- **发布找活**: 个人技能、经验、联系方式
- **完善简历**: 个人信息、工作经历、教育背景

### 🔐 用户系统
- **登录注册**: 手机号登录，密码验证
- **信息完善**: 头像上传、昵称设置
- **权限验证**: 核心功能需要登录才能使用

---

## 🔧 开发规范

### 组件开发
- 使用 Vue 3 Composition API + `<script setup>` 语法
- 组件命名采用 PascalCase
- Props 定义包含类型和默认值
- 事件名称使用 kebab-case

### 样式规范
- 使用 scoped CSS 避免样式污染
- 严格遵循设计稿的颜色和尺寸规范
- 移动端优先，确保设备兼容性
- 使用 CSS Variables 管理主题色彩

### 路由规范
- 页面路由使用 kebab-case 命名
- 参数传递优先使用路由参数
- 页面标题正确设置
- 支持浏览器前进后退

---

## 📋 开发进度

### ✅ 前端开发 (已完成 100%)

#### 🏗️ 基础架构
- [x] Vue 3 项目搭建和配置
- [x] Vite 构建工具配置  
- [x] Vant UI 组件库集成
- [x] Vue Router 路由系统
- [x] CSS Variables 主题系统

#### 📱 页面开发
- [x] 主页三Tab界面 (Home.vue)
- [x] 招聘详情页 (JobDetail.vue)  
- [x] 人才详情页 (TalentDetail.vue)
- [x] 登录注册页 (Login.vue)
- [x] 发布页面 (Post.vue)
- [x] 完善资料页 (CompleteProfile.vue)
- [x] 用户协议页 (Agreement.vue) 
- [x] 隐私政策页 (Privacy.vue)
- [x] 功能演示页 (Demo.vue)

#### 🧩 组件开发
- [x] 职位卡片组件 (JobCard.vue)
- [x] 招聘列表组件 (JobList.vue)
- [x] 找活广场组件 (PlazaList.vue)
- [x] 人才列表组件 (TalentList.vue)

#### 🔐 用户系统
- [x] 用户认证状态管理 (useAuth.js)
- [x] 登录/注册功能
- [x] 登录状态持久化
- [x] 权限验证和自动跳转

#### 🎛️ 交互功能
- [x] 收藏功能 (职位/人才)
- [x] 联系功能 (查看联系方式)
- [x] 点赞评论功能 (找活广场)
- [x] 发布功能 (招聘/找活/简历)
- [x] 智能返回 (记住来源Tab)

#### 🎨 UI/UX 优化
- [x] 严格按照设计稿的视觉规范
- [x] 悬浮操作按钮 (FAB)
- [x] 悬浮返回按钮
- [x] 美观弹窗提示
- [x] 响应式设计适配
- [x] 流畅动画效果

### 📋 后端开发 (待开始)

#### 🏗️ 基础架构
- [ ] Node.js + Express 项目搭建
- [ ] MongoDB 数据库设计
- [ ] JWT 用户认证系统
- [ ] API 接口规范设计

#### 📊 数据模型
- [ ] 用户模型 (User)
- [ ] 职位模型 (Job)  
- [ ] 人才模型 (Talent)
- [ ] 找活模型 (Plaza)
- [ ] 评论模型 (Comment)

#### 🔌 API 接口
- [ ] 用户认证接口 (注册/登录/登出)
- [ ] 职位管理接口 (发布/查询/更新/删除)
- [ ] 人才管理接口 (简历管理)
- [ ] 找活管理接口 (发布/查询/互动)
- [ ] 收藏管理接口
- [ ] 文件上传接口 (头像/简历)

#### 🔐 安全功能
- [ ] 用户身份验证
- [ ] 接口权限控制
- [ ] 数据输入验证
- [ ] 防刷机制

---

## 🌟 技术亮点

### 🎯 严格的设计还原
项目100%按照HTML原型文档开发，确保视觉效果完全一致：
- 精确的颜色搭配 (#3182CE 主色调 + #DD6B20 强调色)
- 统一的字体规范和间距标准
- 完整的组件样式和交互动画

### 📱 优秀的移动端体验
- 完美的触摸交互体验
- 流畅的页面切换动画
- 智能的用户操作引导
- 适配各种屏幕尺寸

### 🔄 完整的状态管理
- 用户登录状态全局管理
- 页面数据智能缓存
- 表单状态自动保存
- 路由状态记忆功能

### 🎨 现代化开发体验
- Vue 3 Composition API 带来更好的代码组织
- Vite 极速开发服务器和构建
- TypeScript 类型支持 (可选)
- ESLint + Prettier 代码规范

---

## 📞 联系方式

如有问题或建议，欢迎联系：

- **项目负责人**: 开发团队
- **邮箱**: dev@lanxizhaopin.com  
- **技术支持**: 工作日 9:00-18:00

---

## 📄 许可证

本项目采用 [MIT](./LICENSE) 许可证。

---

<div align="center">

**🎉 前端开发已完成，欢迎体验！**

访问 [http://localhost:5173](http://localhost:5173) 查看完整功能演示

</div> 