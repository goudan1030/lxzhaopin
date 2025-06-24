#!/bin/bash

# 兰溪招聘项目启动脚本
echo "🚀 启动兰溪招聘项目..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js 未安装，请先安装 Node.js${NC}"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm 未安装，请先安装 npm${NC}"
    exit 1
fi

# 获取当前脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
SERVER_DIR="$SCRIPT_DIR/server"
CLIENT_DIR="$SCRIPT_DIR/client"

echo -e "${BLUE}📁 项目目录: $SCRIPT_DIR${NC}"

# 检查目录是否存在
if [ ! -d "$SERVER_DIR" ]; then
    echo -e "${RED}❌ 后端目录不存在: $SERVER_DIR${NC}"
    exit 1
fi

if [ ! -d "$CLIENT_DIR" ]; then
    echo -e "${RED}❌ 前端目录不存在: $CLIENT_DIR${NC}"
    exit 1
fi

# 安装后端依赖
echo -e "${YELLOW}📦 检查后端依赖...${NC}"
cd "$SERVER_DIR"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 安装后端依赖...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ 后端依赖安装失败${NC}"
        exit 1
    fi
fi

# 检查后端环境变量文件
if [ ! -f "$SERVER_DIR/.env" ]; then
    echo -e "${YELLOW}⚠️  后端 .env 文件不存在，复制示例文件...${NC}"
    if [ -f "$SERVER_DIR/env.example" ]; then
        cp "$SERVER_DIR/env.example" "$SERVER_DIR/.env"
        echo -e "${YELLOW}⚠️  请编辑 $SERVER_DIR/.env 文件配置数据库信息${NC}"
        read -p "配置完成后按回车继续..."
    else
        echo -e "${RED}❌ env.example 文件不存在${NC}"
        exit 1
    fi
fi

# 安装前端依赖
echo -e "${YELLOW}📦 检查前端依赖...${NC}"
cd "$CLIENT_DIR"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 安装前端依赖...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ 前端依赖安装失败${NC}"
        exit 1
    fi
fi

# 检查前端环境变量文件
if [ ! -f "$CLIENT_DIR/.env" ]; then
    echo -e "${YELLOW}⚠️  前端 .env 文件不存在，复制示例文件...${NC}"
    if [ -f "$CLIENT_DIR/env.example" ]; then
        cp "$CLIENT_DIR/env.example" "$CLIENT_DIR/.env"
        echo -e "${GREEN}✅ 已创建前端环境变量文件${NC}"
    fi
fi

# 创建日志目录
mkdir -p "$SCRIPT_DIR/logs"

# 启动后端服务
echo -e "${BLUE}🔧 启动后端API服务...${NC}"
cd "$SERVER_DIR"
nohup npm start > "$SCRIPT_DIR/logs/server.log" 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > "$SCRIPT_DIR/logs/server.pid"

# 等待后端启动
echo -e "${YELLOW}⏳ 等待后端服务启动...${NC}"
sleep 3

# 检查后端是否启动成功
if curl -f -s http://localhost:3000/api/health > /dev/null; then
    echo -e "${GREEN}✅ 后端API服务启动成功 (PID: $SERVER_PID)${NC}"
    echo -e "${BLUE}📱 API地址: http://localhost:3000/api${NC}"
else
    echo -e "${RED}❌ 后端服务启动失败，请检查日志: $SCRIPT_DIR/logs/server.log${NC}"
    exit 1
fi

# 启动前端服务
echo -e "${BLUE}🎨 启动前端开发服务器...${NC}"
cd "$CLIENT_DIR"
nohup npm run dev > "$SCRIPT_DIR/logs/client.log" 2>&1 &
CLIENT_PID=$!
echo $CLIENT_PID > "$SCRIPT_DIR/logs/client.pid"

# 等待前端启动
echo -e "${YELLOW}⏳ 等待前端服务启动...${NC}"
sleep 5

# 检查前端是否启动成功
if curl -f -s http://localhost:5173 > /dev/null; then
    echo -e "${GREEN}✅ 前端开发服务器启动成功 (PID: $CLIENT_PID)${NC}"
    echo -e "${BLUE}🌐 前端地址: http://localhost:5173${NC}"
else
    echo -e "${YELLOW}⚠️  前端服务可能需要更多时间启动，请稍后访问 http://localhost:5173${NC}"
fi

echo ""
echo -e "${GREEN}🎉 兰溪招聘项目启动完成！${NC}"
echo -e "${BLUE}前端访问地址: http://localhost:5173${NC}"
echo -e "${BLUE}后端API地址: http://localhost:3000/api${NC}"
echo -e "${BLUE}API健康检查: http://localhost:3000/api/health${NC}"
echo ""
echo -e "${YELLOW}📋 管理命令:${NC}"
echo -e "  停止服务: ./stop.sh"
echo -e "  查看后端日志: tail -f logs/server.log"
echo -e "  查看前端日志: tail -f logs/client.log"
echo -e "  重启服务: ./stop.sh && ./start.sh"
echo ""
echo -e "${YELLOW}💡 提示: 服务在后台运行，关闭终端不会停止服务${NC}" 