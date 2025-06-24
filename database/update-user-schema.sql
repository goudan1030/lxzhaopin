-- 用户表结构更新脚本
-- 添加昵称、头像URL和资料完善状态字段

-- 检查并添加nickname字段
ALTER TABLE `users` 
ADD COLUMN IF NOT EXISTS `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称/用户名' AFTER `name`;

-- 修改name字段为可空
ALTER TABLE `users` 
MODIFY COLUMN `name` VARCHAR(50) DEFAULT NULL COMMENT '真实姓名';

-- 修改avatar_url字段为可空（如果已存在）
ALTER TABLE `users` 
MODIFY COLUMN `avatar_url` TEXT DEFAULT NULL COMMENT '头像URL';

-- 检查并添加profile_completed字段
ALTER TABLE `users` 
ADD COLUMN IF NOT EXISTS `profile_completed` BOOLEAN DEFAULT FALSE COMMENT '是否完成资料填写' AFTER `status`;

-- 添加索引
ALTER TABLE `users` 
ADD INDEX IF NOT EXISTS `idx_users_profile_completed` (`profile_completed`);

-- 显示更新后的表结构
DESCRIBE `users`; 