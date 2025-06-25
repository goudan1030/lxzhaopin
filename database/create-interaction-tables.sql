-- 创建找活广场点赞表
CREATE TABLE IF NOT EXISTS plaza_likes (
    id VARCHAR(36) PRIMARY KEY,
    plaza_post_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_like (plaza_post_id, user_id),
    INDEX idx_plaza_post (plaza_post_id),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建找活广场评论表
CREATE TABLE IF NOT EXISTS plaza_comments (
    id VARCHAR(36) PRIMARY KEY,
    plaza_post_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    content TEXT NOT NULL,
    status ENUM('active', 'deleted') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_plaza_post (plaza_post_id),
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 检查plaza_posts表是否有likes_count和comments_count字段，如果没有则添加
ALTER TABLE plaza_posts 
ADD COLUMN IF NOT EXISTS likes_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS comments_count INT DEFAULT 0;

-- 添加索引优化查询性能
ALTER TABLE plaza_posts 
ADD INDEX IF NOT EXISTS idx_status (status),
ADD INDEX IF NOT EXISTS idx_created_at (created_at); 