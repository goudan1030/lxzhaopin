#!/bin/bash

# 兰溪招聘项目停止脚本
echo "🛑 停止兰溪招聘项目..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 获取当前脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# 停止后端服务
if [ -f "$SCRIPT_DIR/logs/server.pid" ]; then
    SERVER_PID=$(cat "$SCRIPT_DIR/logs/server.pid")
    if ps -p $SERVER_PID > /dev/null; then
        echo -e "${YELLOW}🔧 停止后端API服务 (PID: $SERVER_PID)...${NC}"
        kill $SERVER_PID
        sleep 2
        if ps -p $SERVER_PID > /dev/null; then
            echo -e "${YELLOW}⚠️  强制停止后端服务...${NC}"
            kill -9 $SERVER_PID
        fi
        echo -e "${GREEN}✅ 后端服务已停止${NC}"
    else
        echo -e "${YELLOW}⚠️  后端服务未运行${NC}"
    fi
    rm -f "$SCRIPT_DIR/logs/server.pid"
else
    echo -e "${YELLOW}⚠️  未找到后端服务PID文件${NC}"
fi

# 停止前端服务
if [ -f "$SCRIPT_DIR/logs/client.pid" ]; then
    CLIENT_PID=$(cat "$SCRIPT_DIR/logs/client.pid")
    if ps -p $CLIENT_PID > /dev/null; then
        echo -e "${YELLOW}🎨 停止前端开发服务器 (PID: $CLIENT_PID)...${NC}"
        kill $CLIENT_PID
        sleep 2
        if ps -p $CLIENT_PID > /dev/null; then
            echo -e "${YELLOW}⚠️  强制停止前端服务...${NC}"
            kill -9 $CLIENT_PID
        fi
        echo -e "${GREEN}✅ 前端服务已停止${NC}"
    else
        echo -e "${YELLOW}⚠️  前端服务未运行${NC}"
    fi
    rm -f "$SCRIPT_DIR/logs/client.pid"
else
    echo -e "${YELLOW}⚠️  未找到前端服务PID文件${NC}"
fi

# 清理其他可能的Node.js进程
echo -e "${YELLOW}🧹 清理相关进程...${NC}"

# 查找并停止可能的Node.js进程
REMAINING_PROCESSES=$(ps aux | grep -E "(npm start|npm run dev|node.*app\.js|vite)" | grep -v grep | awk '{print $2}')

if [ ! -z "$REMAINING_PROCESSES" ]; then
    echo -e "${YELLOW}⚠️  发现遗留进程，正在清理...${NC}"
    echo "$REMAINING_PROCESSES" | xargs kill -9 2>/dev/null || true
fi

# 检查端口占用
echo -e "${YELLOW}🔍 检查端口占用...${NC}"

# 检查3000端口
PORT_3000=$(lsof -ti:3000 2>/dev/null)
if [ ! -z "$PORT_3000" ]; then
    echo -e "${YELLOW}⚠️  端口3000仍被占用，正在释放...${NC}"
    kill -9 $PORT_3000 2>/dev/null || true
fi

# 检查5173端口
PORT_5173=$(lsof -ti:5173 2>/dev/null)
if [ ! -z "$PORT_5173" ]; then
    echo -e "${YELLOW}⚠️  端口5173仍被占用，正在释放...${NC}"
    kill -9 $PORT_5173 2>/dev/null || true
fi

echo ""
echo -e "${GREEN}✅ 兰溪招聘项目已完全停止！${NC}"
echo ""
echo -e "${BLUE}📋 可用命令:${NC}"
echo -e "  启动服务: ./start.sh"
echo -e "  查看日志: tail -f logs/server.log 或 tail -f logs/client.log" 