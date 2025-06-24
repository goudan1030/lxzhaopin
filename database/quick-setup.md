# 🚀 Supabase 快速配置指南

## 📋 当前状态
✅ **Supabase项目已创建**  
✅ **前端Supabase客户端已配置**  
✅ **认证系统已集成**  
✅ **数据服务层已完成**  

## ⚡ 立即执行的步骤

### 1. 执行数据库脚本 (必须完成)

1. **打开Supabase控制台**
   - 访问：https://ltrbtgbbfmlocfhocehk.supabase.co
   - 登录您的账号

2. **进入SQL编辑器**
   - 左侧菜单选择 "SQL Editor"
   - 点击 "New query"

3. **执行数据库架构脚本**
   ```sql
   -- 复制并粘贴整个 database/supabase-schema.sql 文件内容
   -- 然后点击 "Run" 按钮执行
   ```

4. **插入示例数据**
   ```sql
   -- 复制并粘贴 database/sample-data.sql 文件内容
   -- 然后点击 "Run" 按钮执行
   ```

### 2. 验证配置 (推荐)

执行以下SQL验证表结构创建成功：
```sql
-- 查看所有表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 查看职位分类数据
SELECT * FROM public.job_categories ORDER BY sort_order;

-- 查看示例职位数据
SELECT 
    j.title,
    c.name as company_name,
    j.location,
    j.salary_min || '-' || j.salary_max as salary_range
FROM public.jobs j
LEFT JOIN public.companies c ON j.company_id = c.id
ORDER BY j.created_at DESC;
```

## 🔧 测试应用功能

### 1. 启动开发服务器
```bash
cd client
npm run dev
```

### 2. 测试注册/登录功能
1. 访问 http://localhost:5173
2. 点击任何需要登录的功能（如收藏、联系等）
3. 会自动跳转到登录页面
4. 尝试注册新账号：
   - 手机号：13812345678
   - 密码：123456
   - 姓名：测试用户

### 3. 测试功能模块
- **主页三Tab**: 招聘信息、找活广场、求职人才
- **登录注册**: 手机号注册/登录
- **发布功能**: 发布招聘、找活信息、完善简历
- **互动功能**: 收藏、点赞、评论、联系

## 📊 查看数据操作

### 在Supabase控制台中查看数据
1. 左侧菜单选择 "Table Editor"
2. 可以查看各个表的数据：
   - `users` - 用户基本信息
   - `jobs` - 职位信息
   - `plaza_posts` - 找活广场发布
   - `likes` - 点赞记录
   - `favorites` - 收藏记录

### 实时查看API调用
1. 左侧菜单选择 "Logs"
2. 选择 "API" 查看实时API调用日志

## 🐛 常见问题解决

### 1. 认证失败
如果登录/注册失败，检查：
- 环境变量是否正确配置
- Supabase项目URL和API Key是否正确
- 数据库表是否创建成功

### 2. 数据查询失败
如果数据无法加载，检查：
- RLS (行级安全) 策略是否正确执行
- 表之间的关联关系是否正确
- 用户是否有相应的权限

### 3. 开发环境配置
确保以下文件存在且配置正确：
- `client/.env` - 环境变量
- `client/src/lib/supabase.js` - Supabase客户端
- `client/src/services/dataService.js` - 数据服务

## ✅ 完成检查列表

- [ ] **数据库架构脚本已执行**
- [ ] **示例数据已插入**
- [ ] **用户注册功能正常**
- [ ] **用户登录功能正常**
- [ ] **职位列表可以加载**
- [ ] **收藏功能正常**
- [ ] **点赞功能正常**
- [ ] **发布功能正常**

## 🚀 下一步开发

数据库配置完成后，您可以：

1. **优化UI体验**
   - 添加加载状态
   - 优化错误处理
   - 改进交互反馈

2. **扩展功能**
   - 添加搜索功能
   - 实现消息通知
   - 添加用户中心

3. **性能优化**
   - 实现数据缓存
   - 添加分页加载
   - 优化图片加载

---

## 📞 需要帮助？

如果遇到问题，请检查：
1. 浏览器控制台错误信息
2. Supabase项目日志
3. 网络连接状态

**🎉 配置完成后，您的兰溪招聘应用将拥有完整的后端数据支持！** 