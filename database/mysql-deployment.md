# 兰溪招聘 - MySQL数据库部署指南

## 一、宝塔面板配置

### 1. 创建数据库
1. 登录宝塔面板
2. 点击左侧菜单 "数据库" 
3. 点击 "添加数据库"
4. 填写信息：
   - 数据库名：`lxzhaopin`
   - 用户名：`lxzhaopin_user`
   - 密码：设置强密码（记住这个密码）
   - 访问权限：选择 "所有人" 或指定IP

### 2. 导入数据库结构
1. 点击数据库名称旁的 "管理" 按钮
2. 进入phpMyAdmin
3. 选择 `lxzhaopin` 数据库
4. 点击 "SQL" 标签页
5. 复制粘贴 `database/mysql-schema.sql` 文件内容
6. 点击 "执行"

### 3. 检查数据库
确认以下表已创建：
- users (用户表)
- user_profiles (用户详情表)
- companies (公司表)
- jobs (职位表)
- talents (人才表)
- plaza_posts (找活广场表)
- comments (评论表)
- likes (点赞表)
- favorites (收藏表)
- job_applications (申请表)
- notifications (通知表)
- job_categories (职位分类表，已有初始数据)

## 二、后端API部署

### 1. 服务器环境准备
```bash
# 安装Node.js (建议使用Node.js 18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 或者使用宝塔面板安装Node.js版本管理器
```

### 2. 上传后端代码
```bash
# 将server文件夹上传到服务器，例如：
/www/wwwroot/yourdomain.com/api/
```

### 3. 安装依赖
```bash
cd /www/wwwroot/yourdomain.com/api/
npm install
```

### 4. 配置环境变量
```bash
# 复制环境变量文件
cp env.example .env

# 编辑环境变量
vi .env
```

环境变量配置示例：
```env
# 数据库配置
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=lxzhaopin_user
DB_PASSWORD=您设置的数据库密码
DB_NAME=lxzhaopin

# JWT密钥（请修改为随机字符串）
JWT_SECRET=your_super_secret_jwt_key_12345_change_this

# 服务器配置
PORT=3000
NODE_ENV=production

# CORS配置
CORS_ORIGIN=https://yourdomain.com
```

### 5. 启动服务
```bash
# 测试启动
npm start

# 或使用PM2管理进程
npm install -g pm2
pm2 start app.js --name "lxzhaopin-api"
pm2 save
pm2 startup
```

### 6. 配置Nginx反向代理
在宝塔面板网站设置中添加反向代理：
- 代理名称：api
- 目标URL：http://127.0.0.1:3000
- 发送域名：$host
- 缓存：关闭

或手动配置Nginx：
```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3000/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## 三、前端部署

### 1. 配置环境变量
```bash
# 在client目录下创建.env文件
cp env.example .env

# 编辑配置
vi .env
```

配置内容：
```env
VITE_API_BASE_URL=https://yourdomain.com/api
```

### 2. 构建前端
```bash
cd client/
npm install
npm run build
```

### 3. 部署静态文件
将 `client/dist/` 目录内容上传到网站根目录

## 四、测试验证

### 1. 检查API健康状态
访问：`https://yourdomain.com/api/health`
应该返回：
```json
{
  "status": "ok",
  "message": "兰溪招聘API服务运行正常",
  "timestamp": "2024-12-xx..."
}
```

### 2. 测试注册登录
1. 访问网站首页
2. 进入登录页面
3. 尝试注册新账号
4. 测试登录功能

### 3. 检查数据库
在phpMyAdmin中查看users表，确认注册的用户数据正确保存

## 五、常见问题

### 1. 数据库连接失败
- 检查数据库用户名密码是否正确
- 确认数据库服务正在运行
- 检查防火墙设置

### 2. API请求失败
- 检查Node.js服务是否启动
- 确认端口3000没有被占用
- 检查Nginx反向代理配置

### 3. 前端无法连接API
- 确认.env文件中的API地址正确
- 检查CORS配置
- 查看浏览器网络请求错误

### 4. JWT认证问题
- 确认JWT_SECRET已设置且足够复杂
- 检查token是否正确传递

## 六、安全建议

1. **强密码**：数据库密码、JWT密钥使用强密码
2. **HTTPS**：生产环境必须使用HTTPS
3. **防火墙**：限制数据库端口访问
4. **备份**：定期备份数据库
5. **监控**：使用PM2或其他工具监控进程状态

## 七、维护

### 日志查看
```bash
# PM2日志
pm2 logs lxzhaopin-api

# 系统日志
tail -f /var/log/nginx/error.log
```

### 数据库备份
```bash
# 在宝塔面板中定期备份数据库
# 或使用命令行
mysqldump -u lxzhaopin_user -p lxzhaopin > backup_$(date +%Y%m%d).sql
``` 