-- 兰溪招聘 MySQL 数据库设计
-- 创建时间: 2024年12月
-- 数据库类型: MySQL 8.0+

-- 设置字符集和排序规则
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 用户表 (users) - 存储用户基本信息
CREATE TABLE `users` (
    `id` VARCHAR(36) PRIMARY KEY,
    `phone` VARCHAR(11) UNIQUE NOT NULL,
    `email` VARCHAR(100) UNIQUE NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `avatar_url` TEXT,
    `role` ENUM('user', 'admin') DEFAULT 'user',
    `status` ENUM('active', 'inactive', 'banned') DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_phone` (`phone`),
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 用户详细信息表 (user_profiles)
CREATE TABLE `user_profiles` (
    `id` VARCHAR(36) PRIMARY KEY,
    `user_id` VARCHAR(36) NOT NULL,
    `age` INT,
    `education` VARCHAR(50),
    `experience_years` INT,
    `location` VARCHAR(100),
    `bio` TEXT,
    `skills` JSON, -- MySQL JSON类型存储技能标签
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_user_profiles_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 公司信息表 (companies)
CREATE TABLE `companies` (
    `id` VARCHAR(36) PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `logo_url` TEXT,
    `description` TEXT,
    `industry` VARCHAR(50),
    `size` VARCHAR(50),
    `location` VARCHAR(100),
    `website` VARCHAR(200),
    `contact_phone` VARCHAR(20),
    `contact_email` VARCHAR(100),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_companies_name` (`name`),
    INDEX `idx_companies_location` (`location`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 职位分类表 (job_categories)
CREATE TABLE `job_categories` (
    `id` VARCHAR(36) PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    `description` TEXT,
    `sort_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_job_categories_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 招聘职位表 (jobs)
CREATE TABLE `jobs` (
    `id` VARCHAR(36) PRIMARY KEY,
    `title` VARCHAR(100) NOT NULL,
    `company_id` VARCHAR(36),
    `category_id` VARCHAR(36),
    `publisher_id` VARCHAR(36) NOT NULL,
    
    -- 职位基本信息
    `description` TEXT NOT NULL,
    `requirements` TEXT NOT NULL,
    `location` VARCHAR(100) NOT NULL,
    `salary_min` INT,
    `salary_max` INT,
    `salary_type` ENUM('hourly', 'daily', 'monthly', 'yearly') DEFAULT 'monthly',
    `salary_note` VARCHAR(100),
    
    -- 招聘信息
    `recruits_count` VARCHAR(20) DEFAULT '若干',
    `employment_type` ENUM('full_time', 'part_time', 'contract', 'internship') DEFAULT 'full_time',
    `experience_required` VARCHAR(50),
    `education_required` VARCHAR(50),
    
    -- 技能和福利
    `skills_required` JSON,
    `benefits` JSON,
    
    -- 联系方式
    `contact_phone` VARCHAR(20) NOT NULL,
    `contact_email` VARCHAR(100),
    `contact_person` VARCHAR(50),
    
    -- 状态和统计
    `status` ENUM('draft', 'active', 'expired', 'closed') DEFAULT 'active',
    `views_count` INT DEFAULT 0,
    `applications_count` INT DEFAULT 0,
    
    -- 时间字段
    `expires_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`category_id`) REFERENCES `job_categories`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`publisher_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    
    INDEX `idx_jobs_company_id` (`company_id`),
    INDEX `idx_jobs_category_id` (`category_id`),
    INDEX `idx_jobs_publisher_id` (`publisher_id`),
    INDEX `idx_jobs_status` (`status`),
    INDEX `idx_jobs_location` (`location`),
    INDEX `idx_jobs_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 求职人才表 (talents)
CREATE TABLE `talents` (
    `id` VARCHAR(36) PRIMARY KEY,
    `user_id` VARCHAR(36) NOT NULL,
    
    -- 基本信息
    `name` VARCHAR(50) NOT NULL,
    `age` INT,
    `gender` ENUM('male', 'female', 'other'),
    `location` VARCHAR(100),
    
    -- 求职意向
    `desired_position` VARCHAR(100),
    `desired_salary_min` INT,
    `desired_salary_max` INT,
    `desired_location` VARCHAR(100),
    `job_status` ENUM('seeking', 'employed', 'not_seeking') DEFAULT 'seeking',
    
    -- 个人信息
    `education` VARCHAR(50),
    `experience_years` INT,
    `skills` JSON,
    
    -- 详细信息
    `work_experience` TEXT,
    `education_background` TEXT,
    `project_experience` TEXT,
    `self_introduction` TEXT,
    
    -- 联系方式
    `contact_phone` VARCHAR(20) NOT NULL,
    `contact_email` VARCHAR(100),
    `resume_url` TEXT,
    
    -- 状态和统计
    `status` ENUM('draft', 'active', 'inactive') DEFAULT 'active',
    `views_count` INT DEFAULT 0,
    
    -- 时间字段
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_talents_user_id` (`user_id`),
    INDEX `idx_talents_status` (`status`),
    INDEX `idx_talents_location` (`location`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 找活广场表 (plaza_posts)
CREATE TABLE `plaza_posts` (
    `id` VARCHAR(36) PRIMARY KEY,
    `user_id` VARCHAR(36) NOT NULL,
    
    -- 发布内容
    `content` TEXT NOT NULL,
    `tags` JSON,
    
    -- 联系方式
    `contact_phone` VARCHAR(20) NOT NULL,
    `contact_method` VARCHAR(50),
    
    -- 工作信息
    `work_type` VARCHAR(50),
    `location` VARCHAR(100),
    `expected_salary` INT,
    
    -- 状态和统计
    `status` ENUM('active', 'inactive', 'expired') DEFAULT 'active',
    `likes_count` INT DEFAULT 0,
    `comments_count` INT DEFAULT 0,
    `views_count` INT DEFAULT 0,
    
    -- 时间字段
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_plaza_posts_user_id` (`user_id`),
    INDEX `idx_plaza_posts_status` (`status`),
    INDEX `idx_plaza_posts_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 评论表 (comments)
CREATE TABLE `comments` (
    `id` VARCHAR(36) PRIMARY KEY,
    `plaza_post_id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `parent_id` VARCHAR(36),
    
    `content` TEXT NOT NULL,
    
    -- 状态
    `status` ENUM('active', 'deleted', 'hidden') DEFAULT 'active',
    
    -- 时间字段
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (`plaza_post_id`) REFERENCES `plaza_posts`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`parent_id`) REFERENCES `comments`(`id`) ON DELETE CASCADE,
    
    INDEX `idx_comments_plaza_post_id` (`plaza_post_id`),
    INDEX `idx_comments_user_id` (`user_id`),
    INDEX `idx_comments_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 点赞表 (likes)
CREATE TABLE `likes` (
    `id` VARCHAR(36) PRIMARY KEY,
    `user_id` VARCHAR(36) NOT NULL,
    `plaza_post_id` VARCHAR(36) NOT NULL,
    
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`plaza_post_id`) REFERENCES `plaza_posts`(`id`) ON DELETE CASCADE,
    
    UNIQUE KEY `unique_user_post_like` (`user_id`, `plaza_post_id`),
    INDEX `idx_likes_user_id` (`user_id`),
    INDEX `idx_likes_plaza_post_id` (`plaza_post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 收藏表 (favorites)
CREATE TABLE `favorites` (
    `id` VARCHAR(36) PRIMARY KEY,
    `user_id` VARCHAR(36) NOT NULL,
    
    -- 收藏类型和对象ID
    `target_type` ENUM('job', 'talent') NOT NULL,
    `target_id` VARCHAR(36) NOT NULL,
    
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    
    UNIQUE KEY `unique_user_target` (`user_id`, `target_type`, `target_id`),
    INDEX `idx_favorites_user_id` (`user_id`),
    INDEX `idx_favorites_target` (`target_type`, `target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 求职申请表 (job_applications)
CREATE TABLE `job_applications` (
    `id` VARCHAR(36) PRIMARY KEY,
    `job_id` VARCHAR(36) NOT NULL,
    `applicant_id` VARCHAR(36) NOT NULL,
    `talent_id` VARCHAR(36),
    
    -- 申请信息
    `cover_letter` TEXT,
    `expected_salary` INT,
    
    -- 状态
    `status` ENUM('pending', 'viewed', 'interviewed', 'accepted', 'rejected') DEFAULT 'pending',
    
    -- 时间字段
    `applied_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`applicant_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`talent_id`) REFERENCES `talents`(`id`) ON DELETE SET NULL,
    
    UNIQUE KEY `unique_job_applicant` (`job_id`, `applicant_id`),
    INDEX `idx_applications_job_id` (`job_id`),
    INDEX `idx_applications_applicant_id` (`applicant_id`),
    INDEX `idx_applications_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 通知表 (notifications)
CREATE TABLE `notifications` (
    `id` VARCHAR(36) PRIMARY KEY,
    `user_id` VARCHAR(36) NOT NULL,
    
    -- 通知内容
    `type` VARCHAR(50) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `content` TEXT,
    
    -- 关联对象
    `related_type` ENUM('job', 'talent', 'application', 'comment'),
    `related_id` VARCHAR(36),
    
    -- 状态
    `is_read` BOOLEAN DEFAULT FALSE,
    
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_notifications_user_id` (`user_id`),
    INDEX `idx_notifications_is_read` (`is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入初始职位分类数据
INSERT INTO `job_categories` (`id`, `name`, `description`, `sort_order`) VALUES
(UUID(), '技术开发', 'IT技术相关职位', 1),
(UUID(), '产品运营', '产品和运营相关职位', 2),
(UUID(), '设计创意', '设计和创意相关职位', 3),
(UUID(), '市场销售', '市场营销和销售职位', 4),
(UUID(), '行政人事', '行政管理和人事职位', 5),
(UUID(), '财务法务', '财务和法务相关职位', 6),
(UUID(), '生产制造', '生产和制造相关职位', 7),
(UUID(), '服务行业', '服务业相关职位', 8),
(UUID(), '其他', '其他类型职位', 9);

SET FOREIGN_KEY_CHECKS = 1; 