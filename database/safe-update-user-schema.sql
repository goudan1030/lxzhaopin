-- 安全的用户表结构更新脚本
-- 使用存储过程检查字段是否存在

-- 设置分隔符
DELIMITER //

-- 创建临时存储过程来安全添加字段
CREATE PROCEDURE AddColumnIfNotExists()
BEGIN
    -- 检查nickname字段是否存在
    IF NOT EXISTS (
        SELECT * FROM information_schema.COLUMNS 
        WHERE table_name = 'users' 
        AND table_schema = DATABASE()
        AND column_name = 'nickname'
    ) THEN
        ALTER TABLE `users` ADD COLUMN `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称/用户名' AFTER `name`;
    END IF;
    
    -- 检查profile_completed字段是否存在
    IF NOT EXISTS (
        SELECT * FROM information_schema.COLUMNS 
        WHERE table_name = 'users' 
        AND table_schema = DATABASE()
        AND column_name = 'profile_completed'
    ) THEN
        ALTER TABLE `users` ADD COLUMN `profile_completed` BOOLEAN DEFAULT FALSE COMMENT '是否完成资料填写' AFTER `status`;
    END IF;
    
    -- 修改name字段为可空
    ALTER TABLE `users` MODIFY COLUMN `name` VARCHAR(50) DEFAULT NULL COMMENT '真实姓名';
    
    -- 修改avatar_url字段为可空
    ALTER TABLE `users` MODIFY COLUMN `avatar_url` TEXT DEFAULT NULL COMMENT '头像URL';
    
    -- 检查索引是否存在，不存在则添加
    IF NOT EXISTS (
        SELECT * FROM information_schema.STATISTICS 
        WHERE table_name = 'users' 
        AND table_schema = DATABASE()
        AND index_name = 'idx_users_profile_completed'
    ) THEN
        ALTER TABLE `users` ADD INDEX `idx_users_profile_completed` (`profile_completed`);
    END IF;
END//

-- 恢复分隔符
DELIMITER ;

-- 执行存储过程
CALL AddColumnIfNotExists();

-- 删除临时存储过程
DROP PROCEDURE AddColumnIfNotExists;

-- 显示更新后的表结构
DESCRIBE `users`; 