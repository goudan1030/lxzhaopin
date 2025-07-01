#!/bin/bash

echo "🧪 测试兰溪招聘整合系统..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 检查构建文件
echo -e "${BLUE}📁 检查构建文件...${NC}"
if [ -f "server/public/index.html" ]; then
    echo -e "${GREEN}✅ 前端构建文件存在${NC}"
else
    echo -e "${RED}❌ 前端构建文件不存在，请先运行: npm run build${NC}"
    exit 1
fi

# 检查依赖
echo -e "${BLUE}📦 检查依赖...${NC}"
if [ ! -d "server/node_modules" ]; then
    echo -e "${YELLOW}⚠️  后端依赖未安装，正在安装...${NC}"
    cd server && npm install && cd ..
fi

if [ ! -d "client/node_modules" ]; then
    echo -e "${YELLOW}⚠️  前端依赖未安装，正在安装...${NC}"
    cd client && npm install && cd ..
fi

# 检查环境配置
echo -e "${BLUE}🔧 检查环境配置...${NC}"
if [ ! -f "server/.env" ]; then
    echo -e "${YELLOW}⚠️  .env文件不存在，复制示例文件...${NC}"
    cp server/env.example server/.env
fi

# 测试数据库连接（如果可以的话）
echo -e "${BLUE}🗄️ 检查数据库配置...${NC}"
cd server
node -e "
const { testConnection } = require('./config/database');
testConnection()
  .then(() => {
    console.log('✅ 数据库连接成功');
    process.exit(0);
  })
  .catch((error) => {
    console.log('⚠️  数据库连接失败:', error.message);
    console.log('💡 这可能是正常的，如果数据库还未配置');
    process.exit(0);
  });
" 2>/dev/null || echo -e "${YELLOW}⚠️  无法测试数据库连接，请稍后手动验证${NC}"

cd ..

echo ""
echo -e "${GREEN}🎉 整合系统检查完成！${NC}"
echo ""
echo -e "${YELLOW}📋 启动选项:${NC}"
echo -e "  整合模式启动: ${BLUE}./start-integrated.sh${NC}"
echo -e "  分离模式启动: ${BLUE}./start.sh${NC}"
echo -e "  npm脚本启动: ${BLUE}npm run dev${NC}"
echo ""
echo -e "${YELLOW}🔍 验证步骤:${NC}"
echo -e "  1. 启动服务: ./start-integrated.sh"
echo -e "  2. 访问首页: http://localhost:3000"
echo -e "  3. 检查API: http://localhost:3000/api/health" 