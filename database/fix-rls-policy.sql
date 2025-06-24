-- 修复users表的RLS策略
-- 允许已认证用户插入自己的记录

-- 删除现有的策略
DROP POLICY IF EXISTS "用户只能更新自己的信息" ON public.users;

-- 重新创建策略，包含INSERT权限
CREATE POLICY "用户可以插入和更新自己的信息" ON public.users 
FOR ALL USING (auth.uid() = id);

-- 确保已认证用户可以插入自己的记录
CREATE POLICY "用户可以创建自己的账户记录" ON public.users 
FOR INSERT WITH CHECK (auth.uid() = id); 