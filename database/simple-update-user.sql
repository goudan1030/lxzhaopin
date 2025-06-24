-- 简单的用户表更新脚本
-- 请按顺序执行以下SQL语句，如果某个语句报错（字段已存在），请忽略继续执行下一个

-- 1. 修改name字段为可空
ALTER TABLE `users` MODIFY COLUMN `name` VARCHAR(50) DEFAULT NULL COMMENT '真实姓名';

-- 2. 修改avatar_url字段为可空
ALTER TABLE `users` MODIFY COLUMN `avatar_url` TEXT DEFAULT NULL COMMENT '头像URL';

-- 3. 添加nickname字段（如果已存在会报错，忽略即可）
ALTER TABLE `users` ADD COLUMN `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称/用户名' AFTER `name`;

-- 4. 添加profile_completed字段（如果已存在会报错，忽略即可）  
ALTER TABLE `users` ADD COLUMN `profile_completed` BOOLEAN DEFAULT FALSE COMMENT '是否完成资料填写' AFTER `status`;

-- 5. 添加索引（如果已存在会报错，忽略即可）
ALTER TABLE `users` ADD INDEX `idx_users_profile_completed` (`profile_completed`);

-- 6. 查看最终表结构
DESCRIBE `users`; 