# 兰溪招聘 Supabase 数据库设计 🗄️

## 📋 数据库概览

**数据库类型**: PostgreSQL (Supabase)  
**表数量**: 11个核心表  
**功能模块**: 用户管理、职位发布、人才展示、找活广场、互动功能

## 🚀 快速开始

### 1. 创建Supabase项目
1. 访问 [Supabase官网](https://supabase.com)
2. 注册账号并创建新项目
3. 记录项目的 `URL` 和 `anon key`

### 2. 执行数据库脚本
1. 进入Supabase项目的SQL编辑器
2. 复制 `supabase-schema.sql` 的内容
3. 执行SQL脚本创建表结构

### 3. 配置环境变量
```bash
# 在前端项目中添加环境变量
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📊 数据库结构

### 核心表设计

#### 👤 用户相关表
- **`users`** - 用户基本信息 (继承auth.users)
- **`user_profiles`** - 用户详细资料

#### 🏢 企业相关表  
- **`companies`** - 公司信息
- **`job_categories`** - 职位分类

#### 💼 职位相关表
- **`jobs`** - 招聘职位信息
- **`job_applications`** - 求职申请记录

#### 👥 人才相关表
- **`talents`** - 求职人才简历

#### 🎯 社区相关表
- **`plaza_posts`** - 找活广场发布
- **`comments`** - 评论信息
- **`likes`** - 点赞记录

#### 🔖 功能相关表
- **`favorites`** - 收藏记录
- **`notifications`** - 系统通知

## 🔄 表关系图

```
auth.users (Supabase内置)
    ↓
users (用户基本信息)
    ├── user_profiles (用户详细资料)
    ├── jobs (发布的职位) → companies (公司信息)
    ├── talents (人才简历)
    ├── plaza_posts (找活发布)
    ├── job_applications (求职申请)
    ├── comments (评论)
    ├── likes (点赞)
    ├── favorites (收藏)
    └── notifications (通知)
```

## 📋 主要字段说明

### users 表
```sql
id UUID              -- 用户ID (关联auth.users)
phone VARCHAR(11)    -- 手机号 (唯一)
name VARCHAR(50)     -- 用户姓名
avatar_url TEXT      -- 头像URL
role VARCHAR(20)     -- 用户角色 (user/admin)
status VARCHAR(20)   -- 账号状态 (active/inactive/banned)
```

### jobs 表  
```sql
id UUID                  -- 职位ID
title VARCHAR(100)       -- 职位标题
company_id UUID         -- 公司ID
description TEXT         -- 职位描述
requirements TEXT        -- 任职要求
salary_min/max INTEGER  -- 薪资范围
skills_required TEXT[]  -- 技能要求 (数组)
benefits TEXT[]         -- 福利待遇 (数组)
contact_phone VARCHAR   -- 联系电话
status VARCHAR          -- 状态 (draft/active/expired/closed)
```

### talents 表
```sql
id UUID                    -- 人才ID
user_id UUID              -- 用户ID
name VARCHAR(50)          -- 姓名
desired_position VARCHAR  -- 期望职位
skills TEXT[]             -- 技能标签 (数组)
work_experience TEXT      -- 工作经历 (HTML)
education_background TEXT -- 教育背景
contact_phone VARCHAR     -- 联系电话
```

### plaza_posts 表
```sql
id UUID              -- 发布ID
user_id UUID        -- 发布用户ID
content TEXT         -- 发布内容
tags TEXT[]          -- 标签 (数组)
contact_phone VARCHAR -- 联系电话
likes_count INTEGER  -- 点赞数
comments_count INTEGER -- 评论数
```

## 🔐 安全策略 (RLS)

### 行级安全策略
- **用户数据**: 用户只能查看和修改自己的数据
- **职位信息**: 所有人可查看，发布者可管理
- **人才信息**: 所有人可查看，本人可管理  
- **找活广场**: 所有人可查看，发布者可管理
- **收藏点赞**: 用户只能管理自己的记录

### 权限控制
```sql
-- 示例：用户只能更新自己的信息
CREATE POLICY "用户只能更新自己的信息" 
ON public.users FOR UPDATE 
USING (auth.uid() = id);
```

## 🎯 核心功能实现

### 1. 用户认证流程
```sql
-- 1. 通过Supabase Auth注册/登录
-- 2. 在users表中创建用户记录
INSERT INTO public.users (id, phone, name) 
VALUES (auth.uid(), '13812345678', '用户名');

-- 3. 完善用户资料
INSERT INTO public.user_profiles (user_id, age, education, skills)
VALUES (auth.uid(), 25, '本科', ARRAY['Vue.js', 'Node.js']);
```

### 2. 发布职位
```sql
INSERT INTO public.jobs (
    title, company_id, description, requirements,
    salary_min, salary_max, skills_required, benefits,
    contact_phone, publisher_id
) VALUES (
    '前端工程师', 'company_uuid', '职位描述', '任职要求',
    15000, 25000, ARRAY['Vue.js', 'React'], ARRAY['五险一金'],
    '13812345678', auth.uid()
);
```

### 3. 点赞功能
```sql
-- 点赞
INSERT INTO public.likes (user_id, plaza_post_id)
VALUES (auth.uid(), 'post_uuid');

-- 取消点赞  
DELETE FROM public.likes 
WHERE user_id = auth.uid() AND plaza_post_id = 'post_uuid';
```

### 4. 收藏功能
```sql
-- 收藏职位
INSERT INTO public.favorites (user_id, target_type, target_id)
VALUES (auth.uid(), 'job', 'job_uuid');

-- 收藏人才
INSERT INTO public.favorites (user_id, target_type, target_id)  
VALUES (auth.uid(), 'talent', 'talent_uuid');
```

## 📊 数据查询示例

### 获取职位列表
```sql
SELECT 
    j.*,
    c.name as company_name,
    c.logo_url as company_logo,
    jc.name as category_name
FROM public.jobs j
LEFT JOIN public.companies c ON j.company_id = c.id
LEFT JOIN public.job_categories jc ON j.category_id = jc.id
WHERE j.status = 'active'
ORDER BY j.created_at DESC;
```

### 获取找活广场 (包含点赞评论)
```sql
SELECT 
    p.*,
    u.name as publisher_name,
    u.avatar_url as publisher_avatar,
    EXISTS(
        SELECT 1 FROM public.likes l 
        WHERE l.plaza_post_id = p.id AND l.user_id = auth.uid()
    ) as is_liked
FROM public.plaza_posts p
LEFT JOIN public.users u ON p.user_id = u.id  
WHERE p.status = 'active'
ORDER BY p.created_at DESC;
```

### 获取用户收藏列表
```sql
-- 收藏的职位
SELECT 
    f.created_at as favorited_at,
    j.*,
    c.name as company_name
FROM public.favorites f
LEFT JOIN public.jobs j ON f.target_id = j.id
LEFT JOIN public.companies c ON j.company_id = c.id
WHERE f.user_id = auth.uid() AND f.target_type = 'job';

-- 收藏的人才
SELECT 
    f.created_at as favorited_at,
    t.*
FROM public.favorites f  
LEFT JOIN public.talents t ON f.target_id = t.id
WHERE f.user_id = auth.uid() AND f.target_type = 'talent';
```

## 🚀 性能优化

### 索引策略
- **频繁查询字段**: status, created_at, location
- **关联字段**: user_id, company_id, category_id  
- **唯一字段**: phone, email

### 分页查询
```sql
-- 职位列表分页
SELECT * FROM public.jobs 
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;
```

### 全文搜索
```sql
-- PostgreSQL 全文搜索
SELECT * FROM public.jobs
WHERE to_tsvector('chinese', title || ' ' || description) 
      @@ plainto_tsquery('chinese', '前端工程师');
```

## 🔧 数据维护

### 清理过期数据
```sql
-- 清理过期职位
UPDATE public.jobs 
SET status = 'expired' 
WHERE expires_at < NOW() AND status = 'active';

-- 清理超过30天的通知
DELETE FROM public.notifications 
WHERE created_at < NOW() - INTERVAL '30 days' AND is_read = true;
```

### 统计数据
```sql
-- 职位统计
SELECT 
    COUNT(*) as total_jobs,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_jobs,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as recent_jobs
FROM public.jobs;

-- 用户活跃度
SELECT 
    DATE(created_at) as date,
    COUNT(*) as new_users
FROM public.users
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date;
```

## 🛠️ 开发集成

### 前端连接 (Vue.js)
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
export const supabase = createClient(supabaseUrl, supabaseKey)

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
```

### 实时订阅
```javascript
// 监听新职位发布
supabase
  .channel('jobs')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'jobs' },
    (payload) => {
      console.log('新职位发布:', payload.new)
    }
  )
  .subscribe()
```

## 📝 注意事项

1. **UUID vs 自增ID**: 使用UUID保证分布式环境下的唯一性
2. **数组字段**: PostgreSQL原生支持数组，适合存储标签、技能等
3. **RLS策略**: 确保数据安全，用户只能访问授权数据
4. **触发器**: 自动更新计数字段，保持数据一致性
5. **索引优化**: 为经常查询的字段创建合适的索引

## 🔄 数据迁移

### 从现有数据导入
```sql
-- 批量导入公司数据
INSERT INTO public.companies (name, description, location)
SELECT DISTINCT company, '', location 
FROM temp_job_data;

-- 批量导入职位数据  
INSERT INTO public.jobs (title, description, salary_min, salary_max, ...)
SELECT title, description, salary_min, salary_max, ...
FROM temp_job_data;
```

---

**🎯 数据库已准备就绪，可以开始后端API开发！**

**下一步**: 创建后端API服务，连接前端应用与Supabase数据库 