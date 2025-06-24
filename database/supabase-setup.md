# Supabase 设置指南 🚀

## 📋 准备工作

### 1. 创建Supabase项目
1. 访问 [Supabase官网](https://supabase.com)
2. 使用GitHub账号注册登录
3. 点击 "New project" 创建新项目
4. 选择组织和区域 (建议选择离用户最近的区域)
5. 设置项目名称：`zhaopin`
6. 设置数据库密码 (请记住此密码)
7. 等待项目创建完成 (通常需要2-3分钟)

### 2. 获取项目配置信息
项目创建完成后，在项目设置页面获取：
- **Project URL**: `https://your-project-id.supabase.co`
- **anon public key**: 公共API密钥
- **service_role key**: 服务端密钥 (保密)

## 🗄️ 数据库设置

### 1. 执行数据库架构
1. 进入Supabase项目控制台
2. 左侧菜单选择 "SQL Editor"
3. 复制 `supabase-schema.sql` 文件的全部内容
4. 粘贴到SQL编辑器中
5. 点击 "Run" 执行SQL
6. 等待执行完成，确保没有错误

### 2. 验证表结构
在SQL编辑器中运行以下查询验证：
```sql
-- 查看所有表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- 查看职位分类数据
SELECT * FROM public.job_categories ORDER BY sort_order;
```

### 3. 插入示例数据
1. 复制 `sample-data.sql` 文件内容
2. 在SQL编辑器中执行
3. 验证数据插入成功

## 🔐 认证设置

### 1. 配置认证提供商
1. 左侧菜单选择 "Authentication" > "Settings"
2. 在 "Site URL" 中填入：`http://localhost:5173` (开发环境)
3. 在 "Redirect URLs" 中添加：`http://localhost:5173/**`

### 2. 启用邮箱认证
1. 在 "Auth" > "Settings" 中
2. 启用 "Enable email confirmations"
3. 配置邮件模板 (可选)

### 3. 配置手机号认证 (可选)
如需要手机号验证：
1. 在 "Auth" > "Settings" 中启用 "Enable phone confirmations"
2. 配置SMS服务提供商 (如Twilio)

## 🔒 安全设置

### 1. 检查行级安全策略 (RLS)
在SQL编辑器中验证RLS策略：
```sql
-- 查看所有策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

### 2. 配置API访问权限
1. 在 "Settings" > "API" 中查看API密钥
2. 确保只暴露必要的API密钥
3. 定期轮换service_role密钥

## 📊 存储设置 (可选)

### 1. 启用存储桶
如需要文件上传功能：
1. 左侧菜单选择 "Storage"
2. 创建新的存储桶：
   - `avatars` (用户头像)
   - `resumes` (简历文件)
   - `company-logos` (公司LOGO)

### 2. 配置存储策略
```sql
-- 用户头像存储策略
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);

-- 用户只能上传自己的头像
CREATE POLICY "用户可以上传自己的头像" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);
```

## 🔄 实时功能设置

### 1. 启用实时订阅
在SQL编辑器中运行：
```sql
-- 为需要实时更新的表启用实时功能
ALTER PUBLICATION supabase_realtime ADD TABLE public.jobs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.plaza_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.likes;
```

## 🛠️ 前端集成

### 1. 安装Supabase客户端
```bash
cd client
npm install @supabase/supabase-js
```

### 2. 创建Supabase客户端
创建 `client/src/lib/supabase.js`：
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 3. 配置环境变量
在 `client/.env` 文件中添加：
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 📱 基础CRUD操作示例

### 1. 用户认证
```javascript
// 注册
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
})

// 登录
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// 登出
const { error } = await supabase.auth.signOut()
```

### 2. 数据查询
```javascript
// 获取职位列表
const { data: jobs, error } = await supabase
  .from('jobs')
  .select(`
    *,
    companies (name, logo_url),
    job_categories (name)
  `)
  .eq('status', 'active')
  .order('created_at', { ascending: false })

// 获取职位详情
const { data: job, error } = await supabase
  .from('jobs')
  .select(`
    *,
    companies (*)
  `)
  .eq('id', jobId)
  .single()
```

### 3. 数据插入
```javascript
// 发布职位
const { data, error } = await supabase
  .from('jobs')
  .insert({
    title: '前端工程师',
    description: '职位描述',
    salary_min: 15000,
    salary_max: 25000,
    location: '杭州市',
    contact_phone: '13812345678',
    publisher_id: user.id
  })
```

### 4. 点赞功能
```javascript
// 点赞
const { data, error } = await supabase
  .from('likes')
  .insert({
    user_id: user.id,
    plaza_post_id: postId
  })

// 取消点赞
const { error } = await supabase
  .from('likes')
  .delete()
  .eq('user_id', user.id)
  .eq('plaza_post_id', postId)
```

### 5. 实时订阅
```javascript
// 监听新职位
const subscription = supabase
  .channel('jobs')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'jobs' },
    (payload) => {
      console.log('新职位:', payload.new)
    }
  )
  .subscribe()

// 取消订阅
subscription.unsubscribe()
```

## 🔧 性能优化

### 1. 数据库索引
确保为经常查询的字段创建了索引：
```sql
-- 检查现有索引
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE schemaname = 'public';
```

### 2. 查询优化
- 使用 `select()` 只查询需要的字段
- 使用 `limit()` 限制返回记录数
- 使用 `order()` 进行排序
- 使用 `eq()`, `gt()`, `lt()` 等过滤条件

### 3. 连接池配置
在生产环境中配置适当的连接池大小

## 🚀 部署到生产环境

### 1. 更新环境变量
```env
VITE_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-prod-anon-key
```

### 2. 配置域名
在Supabase项目设置中：
- 更新 "Site URL" 为生产域名
- 添加生产域名到 "Redirect URLs"

### 3. 安全检查
- 确保RLS策略正确配置
- 检查API密钥安全性
- 设置适当的CORS策略

## 📊 监控和维护

### 1. 数据库监控
- 在Supabase控制台查看数据库使用情况
- 监控查询性能
- 定期备份数据

### 2. 日志查看
- 在 "Logs" 中查看API请求日志
- 监控错误和异常

### 3. 定期维护
- 清理过期数据
- 优化数据库性能
- 更新依赖包

---

## ✅ 检查清单

完成以下步骤确保Supabase正确配置：

- [ ] 创建Supabase项目
- [ ] 执行数据库架构脚本
- [ ] 插入示例数据
- [ ] 配置认证设置
- [ ] 验证RLS策略
- [ ] 配置前端环境变量
- [ ] 测试基础CRUD操作
- [ ] 配置实时订阅 (可选)
- [ ] 设置文件存储 (可选)
- [ ] 部署到生产环境

**🎉 Supabase数据库配置完成！现在可以开始集成到前端应用了。** 