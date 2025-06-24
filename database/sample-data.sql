-- 兰溪招聘 示例测试数据
-- 注意：执行前请确保已经创建了基础表结构

-- 插入示例公司数据
INSERT INTO public.companies (id, name, description, industry, size, location, contact_phone, contact_email) VALUES
('550e8400-e29b-41d4-a716-446655440001', '技术有限公司', '专注于互联网技术开发的创新企业', 'IT互联网', '100-500人', '上海市浦东新区', '021-88888888', 'hr@tech-company.com'),
('550e8400-e29b-41d4-a716-446655440002', '创意无限公司', '数字营销和创意设计领域的领先企业', '广告传媒', '50-100人', '深圳市南山区', '0755-66666666', 'contact@creative-unlimited.com'),
('550e8400-e29b-41d4-a716-446655440003', '数据科技', '大数据分析和人工智能解决方案提供商', 'IT互联网', '200-1000人', '杭州市西湖区', '0571-77777777', 'jobs@datascience.com'),
('550e8400-e29b-41d4-a716-446655440004', '智能制造有限公司', '工业4.0和智能制造设备研发', '制造业', '500-1000人', '苏州市高新区', '0512-55555555', 'recruit@smartmfg.com');

-- 注意：用户数据需要先通过Supabase Auth注册
-- 这里提供示例用户数据结构，实际使用时需要替换为真实的UUID

-- 示例用户数据 (需要先在Supabase Auth中注册)
-- INSERT INTO public.users (id, phone, name, avatar_url) VALUES
-- ('auth-user-uuid-1', '13812345678', '张三', 'https://example.com/avatar1.jpg'),
-- ('auth-user-uuid-2', '13987654321', '李四', 'https://example.com/avatar2.jpg'),
-- ('auth-user-uuid-3', '18611112222', '王五', 'https://example.com/avatar3.jpg');

-- 插入示例职位数据 (需要替换publisher_id为真实用户UUID)
INSERT INTO public.jobs (
    id, title, company_id, description, requirements,
    salary_min, salary_max, salary_note, location,
    skills_required, benefits, contact_phone, contact_person,
    recruits_count, experience_required, education_required,
    status, views_count
) VALUES
(
    '660e8400-e29b-41d4-a716-446655440001',
    '高级前端开发工程师',
    '550e8400-e29b-41d4-a716-446655440001',
    '负责核心产品的Web前端架构设计和开发，推动团队技术成长。参与产品需求分析，完成前端开发工作，确保用户体验的优化。与后端工程师、UI设计师紧密合作，共同完成产品开发。',
    '1. 计算机相关专业本科及以上学历
2. 五年以上前端开发经验
3. 精通React、Vue等至少一种主流框架
4. 熟悉Node.js，有全栈开发经验者优先
5. 具备良好的团队协作能力和沟通能力',
    25000, 45000, '14薪', '上海市',
    ARRAY['React', 'TypeScript', 'Node.js', 'Vue.js', 'Webpack'],
    ARRAY['五险一金', '周末双休', '年终分红', '带薪年假', '定期体检'],
    '13812345678', '张经理',
    '5人', '5-10年', '本科',
    'active', 156
),
(
    '660e8400-e29b-41d4-a716-446655440002',
    '产品经理',
    '550e8400-e29b-41d4-a716-446655440002',
    '负责规划产品发展路线图，深度挖掘用户需求，完成产品设计。与技术团队密切合作，推动产品功能的实现和优化。分析用户数据，持续改进产品体验。',
    '1. 3年以上互联网产品经理经验
2. 熟悉移动端产品设计，有成功案例
3. 具备优秀的数据分析和逻辑思维能力
4. 熟练使用Axure、Figma等产品设计工具
5. 有电商或社交产品经验者优先',
    20000, 40000, '面议', '深圳市',
    ARRAY['用户体验', '市场分析', '数据分析', 'Axure', 'Figma'],
    ARRAY['弹性工作', '定期体检', '零食下午茶', '年度旅游', '股权激励'],
    '13987654321', '李总监',
    '若干', '3-5年', '本科',
    'active', 89
),
(
    '660e8400-e29b-41d4-a716-446655440003',
    'Java后端开发',
    '550e8400-e29b-41d4-a716-446655440003',
    '负责后端系统架构设计和开发，确保系统的稳定性和扩展性。参与需求分析，设计数据库结构，开发API接口。优化系统性能，解决技术难题。',
    '1. 计算机相关专业本科及以上学历
2. 3年以上Java开发经验
3. 熟悉Spring Boot、MyBatis等框架
4. 有微服务架构经验
5. 熟悉MySQL、Redis等数据库',
    18000, 35000, '13薪', '杭州市',
    ARRAY['Java', 'Spring', 'MySQL', 'Redis', 'Docker'],
    ARRAY['股票期权', '岗位晋升', '免费班车', '技能培训'],
    '18633334444', '王主管',
    '3人', '3-5年', '本科',
    'active', 203
),
(
    '660e8400-e29b-41d4-a716-446655440004',
    'UI设计师',
    '550e8400-e29b-41d4-a716-446655440004',
    '负责产品界面设计，制作高保真原型。与产品经理、开发工程师协作，确保设计方案的落地。关注用户体验，持续优化界面设计。',
    '1. 设计相关专业本科及以上学历
2. 2年以上UI设计经验
3. 精通Sketch、Figma、Photoshop等设计工具
4. 有移动端设计经验
5. 具备良好的审美能力和创新思维',
    12000, 25000, '', '苏州市',
    ARRAY['Sketch', 'Figma', 'Photoshop', 'Illustrator', '原型设计'],
    ARRAY['五险一金', '双休', '年终奖', '员工旅游'],
    '18755556666', '设计总监',
    '2人', '2-5年', '本科',
    'active', 67
);

-- 插入示例人才数据 (需要替换user_id为真实用户UUID)
-- INSERT INTO public.talents (
--     id, user_id, name, age, location,
--     desired_position, desired_salary_min, desired_salary_max,
--     education, experience_years, skills,
--     work_experience, education_background, contact_phone,
--     status, views_count
-- ) VALUES
-- (
--     '770e8400-e29b-41d4-a716-446655440001',
--     'auth-user-uuid-1',
--     '张三', 28, '上海市',
--     '全栈工程师', 20000, 35000,
--     '本科', 5, ARRAY['Vue.js', 'Django', 'MySQL', 'AWS'],
--     '<h4>项目A (2020-至今)</h4><p>担任后端开发，使用Django和MySQL构建了一个电商后台管理系统，负责用户模块、订单模块的设计与开发。在项目中，我主导了数据库架构设计，优化了查询性能，使系统响应时间提升了40%。</p><h4>项目B (2018-2020)</h4><p>作为前端开发，参与了公司内部CRM系统的开发，使用Vue.js构建了用户界面，实现了复杂的数据可视化功能。</p>',
--     '毕业于XX大学计算机科学与技术专业，学士学位。在校期间多次获得奖学金，参与了多个实习项目。',
--     '18611112222',
--     'active', 45
-- );

-- 插入示例找活广场数据 (需要替换user_id为真实用户UUID)
-- INSERT INTO public.plaza_posts (
--     id, user_id, content, tags, contact_phone,
--     work_type, location, expected_salary,
--     status, likes_count, comments_count, views_count
-- ) VALUES
-- (
--     '880e8400-e29b-41d4-a716-446655440001',
--     'auth-user-uuid-2',
--     '本人是持证电工，有10年经验，家装、工厂用电都精通，想找个稳定或临时的电工活。手艺过硬，价格公道，有需要的老板请联系。',
--     ARRAY['电工', '10年经验', '持证上岗'],
--     '13811112222',
--     '电工', '兰溪市区', 200,
--     'active', 12, 4, 89
-- ),
-- (
--     '880e8400-e29b-41d4-a716-446655440002',
--     'auth-user-uuid-3',
--     '想找一份在县城东区的保姆或钟点工工作，会做饭，爱干净，有耐心。之前有过3年的保姆经验，照顾过老人和小孩。',
--     ARRAY['保姆', '钟点工', '有经验'],
--     '13933334444',
--     '保姆/钟点工', '兰溪东区', 80,
--     'active', 25, 1, 156
-- );

-- 插入示例评论数据 (需要替换相关ID为真实UUID)
-- INSERT INTO public.comments (
--     id, plaza_post_id, user_id, content, status
-- ) VALUES
-- (
--     '990e8400-e29b-41d4-a716-446655440001',
--     '880e8400-e29b-41d4-a716-446655440001',
--     'auth-user-uuid-1',
--     '师傅手艺怎么样？价格如何？',
--     'active'
-- );

-- 插入示例点赞数据 (需要替换相关ID为真实UUID)
-- INSERT INTO public.likes (
--     user_id, plaza_post_id
-- ) VALUES
-- ('auth-user-uuid-1', '880e8400-e29b-41d4-a716-446655440001'),
-- ('auth-user-uuid-3', '880e8400-e29b-41d4-a716-446655440001');

-- 插入示例收藏数据 (需要替换相关ID为真实UUID)
-- INSERT INTO public.favorites (
--     user_id, target_type, target_id
-- ) VALUES
-- ('auth-user-uuid-1', 'job', '660e8400-e29b-41d4-a716-446655440001'),
-- ('auth-user-uuid-2', 'job', '660e8400-e29b-41d4-a716-446655440002');

-- 验证数据插入
SELECT 
    '公司数据' as data_type,
    COUNT(*) as count
FROM public.companies

UNION ALL

SELECT 
    '职位数据' as data_type,
    COUNT(*) as count
FROM public.jobs

UNION ALL

SELECT 
    '职位分类' as data_type,
    COUNT(*) as count
FROM public.job_categories;

-- 显示插入的职位数据
SELECT 
    j.title,
    c.name as company_name,
    j.salary_min || '-' || j.salary_max || 'K' as salary_range,
    j.location,
    array_to_string(j.skills_required, ', ') as skills,
    j.contact_person,
    j.status
FROM public.jobs j
LEFT JOIN public.companies c ON j.company_id = c.id
ORDER BY j.created_at; 