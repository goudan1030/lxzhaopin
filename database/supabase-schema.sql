-- 兰溪招聘 Supabase 数据库设计
-- 创建时间: 2024年12月
-- 数据库类型: PostgreSQL (Supabase)

-- 开启UUID扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 用户表 (users)
-- 存储用户基本信息，继承Supabase auth.users
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    phone VARCHAR(11) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'banned')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户详细信息表 (user_profiles)
-- 存储用户完善的个人信息
CREATE TABLE public.user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    age INTEGER,
    education VARCHAR(50),
    experience_years INTEGER,
    location VARCHAR(100),
    bio TEXT,
    skills TEXT[], -- PostgreSQL数组类型存储技能标签
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 公司信息表 (companies)
-- 存储招聘企业信息
CREATE TABLE public.companies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    logo_url TEXT,
    description TEXT,
    industry VARCHAR(50),
    size VARCHAR(50),
    location VARCHAR(100),
    website VARCHAR(200),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 职位分类表 (job_categories)
-- 存储职位分类信息
CREATE TABLE public.job_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 招聘职位表 (jobs)
-- 存储招聘信息
CREATE TABLE public.jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.job_categories(id),
    publisher_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- 职位基本信息
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    location VARCHAR(100) NOT NULL,
    salary_min INTEGER,
    salary_max INTEGER,
    salary_type VARCHAR(20) DEFAULT 'monthly' CHECK (salary_type IN ('hourly', 'daily', 'monthly', 'yearly')),
    salary_note VARCHAR(100), -- 如"14薪"、"面议"等
    
    -- 招聘信息
    recruits_count VARCHAR(20) DEFAULT '若干',
    employment_type VARCHAR(20) DEFAULT 'full_time' CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'internship')),
    experience_required VARCHAR(50),
    education_required VARCHAR(50),
    
    -- 技能和福利
    skills_required TEXT[], -- 技能要求数组
    benefits TEXT[], -- 福利待遇数组
    
    -- 联系方式
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(100),
    contact_person VARCHAR(50),
    
    -- 状态和统计
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'expired', 'closed')),
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    
    -- 时间字段
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 求职人才表 (talents)  
-- 存储求职者简历信息
CREATE TABLE public.talents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- 基本信息
    name VARCHAR(50) NOT NULL,
    age INTEGER,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    location VARCHAR(100),
    
    -- 求职意向
    desired_position VARCHAR(100),
    desired_salary_min INTEGER,
    desired_salary_max INTEGER,
    desired_location VARCHAR(100),
    job_status VARCHAR(20) DEFAULT 'seeking' CHECK (job_status IN ('seeking', 'employed', 'not_seeking')),
    
    -- 个人信息
    education VARCHAR(50),
    experience_years INTEGER,
    skills TEXT[], -- 技能数组
    
    -- 详细信息
    work_experience TEXT, -- 工作经历 (HTML格式)
    education_background TEXT, -- 教育背景
    project_experience TEXT, -- 项目经历
    self_introduction TEXT, -- 自我介绍
    
    -- 联系方式
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(100),
    resume_url TEXT, -- 简历文件链接
    
    -- 状态和统计
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'inactive')),
    views_count INTEGER DEFAULT 0,
    
    -- 时间字段
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 找活广场表 (plaza_posts)
-- 存储找活信息发布
CREATE TABLE public.plaza_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- 发布内容
    content TEXT NOT NULL,
    tags TEXT[], -- 标签数组
    
    -- 联系方式
    contact_phone VARCHAR(20) NOT NULL,
    contact_method VARCHAR(50), -- 联系方式说明
    
    -- 工作信息
    work_type VARCHAR(50), -- 工作类型
    location VARCHAR(100), -- 工作地点
    expected_salary INTEGER, -- 期望薪资
    
    -- 状态和统计
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    
    -- 时间字段
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 评论表 (comments)
-- 存储找活广场的评论
CREATE TABLE public.comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    plaza_post_id UUID REFERENCES public.plaza_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE, -- 回复评论的父评论ID
    
    content TEXT NOT NULL,
    
    -- 状态
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'deleted', 'hidden')),
    
    -- 时间字段
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 点赞表 (likes)
-- 存储用户点赞记录
CREATE TABLE public.likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    plaza_post_id UUID REFERENCES public.plaza_posts(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 唯一约束：每个用户对每个帖子只能点赞一次
    UNIQUE(user_id, plaza_post_id)
);

-- 收藏表 (favorites)
-- 存储用户收藏记录 (职位和人才)
CREATE TABLE public.favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- 收藏类型和对象ID
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('job', 'talent')),
    target_id UUID NOT NULL, -- 职位ID或人才ID
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 唯一约束：每个用户对每个对象只能收藏一次
    UNIQUE(user_id, target_type, target_id)
);

-- 求职申请表 (job_applications)
-- 存储求职申请记录
CREATE TABLE public.job_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    applicant_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    talent_id UUID REFERENCES public.talents(id) ON DELETE CASCADE,
    
    -- 申请信息
    cover_letter TEXT, -- 求职信
    expected_salary INTEGER,
    
    -- 状态
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'interviewed', 'accepted', 'rejected')),
    
    -- 时间字段
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 唯一约束：每个人对每个职位只能申请一次
    UNIQUE(job_id, applicant_id)
);

-- 系统通知表 (notifications)
-- 存储系统通知消息
CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    
    -- 关联对象
    related_type VARCHAR(20), -- 'job', 'talent', 'application', 'comment'
    related_id UUID,
    
    -- 状态
    is_read BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 创建索引 =====

-- 用户表索引
CREATE INDEX idx_users_phone ON public.users(phone);
CREATE INDEX idx_users_status ON public.users(status);

-- 职位表索引
CREATE INDEX idx_jobs_company_id ON public.jobs(company_id);
CREATE INDEX idx_jobs_category_id ON public.jobs(category_id);
CREATE INDEX idx_jobs_publisher_id ON public.jobs(publisher_id);
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_location ON public.jobs(location);
CREATE INDEX idx_jobs_created_at ON public.jobs(created_at);

-- 人才表索引
CREATE INDEX idx_talents_user_id ON public.talents(user_id);
CREATE INDEX idx_talents_status ON public.talents(status);
CREATE INDEX idx_talents_location ON public.talents(location);

-- 找活广场索引
CREATE INDEX idx_plaza_posts_user_id ON public.plaza_posts(user_id);
CREATE INDEX idx_plaza_posts_status ON public.plaza_posts(status);
CREATE INDEX idx_plaza_posts_created_at ON public.plaza_posts(created_at);

-- 评论表索引
CREATE INDEX idx_comments_plaza_post_id ON public.comments(plaza_post_id);
CREATE INDEX idx_comments_user_id ON public.comments(user_id);
CREATE INDEX idx_comments_parent_id ON public.comments(parent_id);

-- 点赞表索引
CREATE INDEX idx_likes_user_id ON public.likes(user_id);
CREATE INDEX idx_likes_plaza_post_id ON public.likes(plaza_post_id);

-- 收藏表索引
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_target ON public.favorites(target_type, target_id);

-- 申请表索引
CREATE INDEX idx_applications_job_id ON public.job_applications(job_id);
CREATE INDEX idx_applications_applicant_id ON public.job_applications(applicant_id);
CREATE INDEX idx_applications_status ON public.job_applications(status);

-- 通知表索引
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- ===== 创建触发器函数 =====

-- 更新updated_at字段的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表创建更新触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_talents_updated_at BEFORE UPDATE ON public.talents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plaza_posts_updated_at BEFORE UPDATE ON public.plaza_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.job_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 更新统计计数的触发器函数
CREATE OR REPLACE FUNCTION update_plaza_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.plaza_posts 
        SET comments_count = comments_count + 1 
        WHERE id = NEW.plaza_post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.plaza_posts 
        SET comments_count = comments_count - 1 
        WHERE id = OLD.plaza_post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- 创建评论计数触发器
CREATE TRIGGER trigger_update_comments_count 
    AFTER INSERT OR DELETE ON public.comments 
    FOR EACH ROW EXECUTE FUNCTION update_plaza_post_comments_count();

-- 更新点赞计数的触发器函数
CREATE OR REPLACE FUNCTION update_plaza_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.plaza_posts 
        SET likes_count = likes_count + 1 
        WHERE id = NEW.plaza_post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.plaza_posts 
        SET likes_count = likes_count - 1 
        WHERE id = OLD.plaza_post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- 创建点赞计数触发器
CREATE TRIGGER trigger_update_likes_count 
    AFTER INSERT OR DELETE ON public.likes 
    FOR EACH ROW EXECUTE FUNCTION update_plaza_post_likes_count();

-- ===== 行级安全策略 (RLS) =====

-- 启用行级安全
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plaza_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 用户表策略：用户只能查看和更新自己的信息
CREATE POLICY "用户可以查看所有用户基本信息" ON public.users FOR SELECT USING (true);
CREATE POLICY "用户只能更新自己的信息" ON public.users FOR UPDATE USING (auth.uid() = id);

-- 用户详细信息策略
CREATE POLICY "用户可以查看自己的详细信息" ON public.user_profiles FOR ALL USING (auth.uid() = user_id);

-- 公司信息策略：所有人可以查看，只有管理员可以修改
CREATE POLICY "所有人可以查看公司信息" ON public.companies FOR SELECT USING (true);
CREATE POLICY "管理员可以管理公司信息" ON public.companies FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- 职位信息策略
CREATE POLICY "所有人可以查看已发布的职位" ON public.jobs FOR SELECT USING (status = 'active');
CREATE POLICY "用户可以管理自己发布的职位" ON public.jobs FOR ALL USING (auth.uid() = publisher_id);

-- 人才信息策略
CREATE POLICY "所有人可以查看已发布的人才信息" ON public.talents FOR SELECT USING (status = 'active');
CREATE POLICY "用户可以管理自己的人才信息" ON public.talents FOR ALL USING (auth.uid() = user_id);

-- 找活广场策略
CREATE POLICY "所有人可以查看已发布的找活信息" ON public.plaza_posts FOR SELECT USING (status = 'active');
CREATE POLICY "用户可以管理自己发布的找活信息" ON public.plaza_posts FOR ALL USING (auth.uid() = user_id);

-- 评论策略
CREATE POLICY "所有人可以查看评论" ON public.comments FOR SELECT USING (status = 'active');
CREATE POLICY "用户可以发布和管理自己的评论" ON public.comments FOR ALL USING (auth.uid() = user_id);

-- 点赞策略
CREATE POLICY "用户可以管理自己的点赞" ON public.likes FOR ALL USING (auth.uid() = user_id);

-- 收藏策略
CREATE POLICY "用户可以管理自己的收藏" ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- 申请策略
CREATE POLICY "用户可以查看和管理自己的申请" ON public.job_applications FOR ALL USING (auth.uid() = applicant_id);
CREATE POLICY "职位发布者可以查看该职位的申请" ON public.job_applications FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.jobs WHERE id = job_id AND publisher_id = auth.uid())
);

-- 通知策略
CREATE POLICY "用户只能查看自己的通知" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- ===== 插入示例数据 =====

-- 插入职位分类
INSERT INTO public.job_categories (name, description, sort_order) VALUES
('技术开发', 'IT技术相关职位', 1),
('产品运营', '产品和运营相关职位', 2),
('设计创意', '设计和创意相关职位', 3),
('市场销售', '市场营销和销售职位', 4),
('行政人事', '行政管理和人事职位', 5),
('财务法务', '财务和法务相关职位', 6),
('生产制造', '生产和制造相关职位', 7),
('服务行业', '服务业相关职位', 8),
('其他', '其他类型职位', 9);

-- 注意：用户数据需要先通过Supabase Auth注册，然后才能在users表中关联 