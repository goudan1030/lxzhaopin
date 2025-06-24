@echo off
chcp 65001 >nul
echo 🚀 启动兰溪招聘项目...
echo.

:: 检查Node.js是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js 未安装，请先安装 Node.js
    pause
    exit /b 1
)

:: 检查npm是否安装
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm 未安装，请先安装 npm
    pause
    exit /b 1
)

:: 获取当前脚本所在目录
set SCRIPT_DIR=%~dp0
set SERVER_DIR=%SCRIPT_DIR%server
set CLIENT_DIR=%SCRIPT_DIR%client

echo 📁 项目目录: %SCRIPT_DIR%

:: 检查目录是否存在
if not exist "%SERVER_DIR%" (
    echo ❌ 后端目录不存在: %SERVER_DIR%
    pause
    exit /b 1
)

if not exist "%CLIENT_DIR%" (
    echo ❌ 前端目录不存在: %CLIENT_DIR%
    pause
    exit /b 1
)

:: 创建日志目录
if not exist "%SCRIPT_DIR%logs" mkdir "%SCRIPT_DIR%logs"

:: 安装后端依赖
echo 📦 检查后端依赖...
cd /d "%SERVER_DIR%"
if not exist "node_modules" (
    echo 📦 安装后端依赖...
    npm install
    if errorlevel 1 (
        echo ❌ 后端依赖安装失败
        pause
        exit /b 1
    )
)

:: 检查后端环境变量文件
if not exist "%SERVER_DIR%\.env" (
    echo ⚠️  后端 .env 文件不存在，复制示例文件...
    if exist "%SERVER_DIR%\env.example" (
        copy "%SERVER_DIR%\env.example" "%SERVER_DIR%\.env"
        echo ⚠️  请编辑 %SERVER_DIR%\.env 文件配置数据库信息
        pause
    ) else (
        echo ❌ env.example 文件不存在
        pause
        exit /b 1
    )
)

:: 安装前端依赖
echo 📦 检查前端依赖...
cd /d "%CLIENT_DIR%"
if not exist "node_modules" (
    echo 📦 安装前端依赖...
    npm install
    if errorlevel 1 (
        echo ❌ 前端依赖安装失败
        pause
        exit /b 1
    )
)

:: 检查前端环境变量文件
if not exist "%CLIENT_DIR%\.env" (
    echo ⚠️  前端 .env 文件不存在，复制示例文件...
    if exist "%CLIENT_DIR%\env.example" (
        copy "%CLIENT_DIR%\env.example" "%CLIENT_DIR%\.env"
        echo ✅ 已创建前端环境变量文件
    )
)

:: 启动后端服务
echo 🔧 启动后端API服务...
cd /d "%SERVER_DIR%"
start /B npm start > "%SCRIPT_DIR%logs\server.log" 2>&1

:: 等待后端启动
echo ⏳ 等待后端服务启动...
timeout /t 5 /nobreak >nul

:: 启动前端服务
echo 🎨 启动前端开发服务器...
cd /d "%CLIENT_DIR%"
start /B npm run dev > "%SCRIPT_DIR%logs\client.log" 2>&1

:: 等待前端启动
echo ⏳ 等待前端服务启动...
timeout /t 8 /nobreak >nul

echo.
echo 🎉 兰溪招聘项目启动完成！
echo 🌐 前端访问地址: http://localhost:5173
echo 📱 后端API地址: http://localhost:3000/api
echo 🔍 API健康检查: http://localhost:3000/api/health
echo.
echo 📋 管理命令:
echo   停止服务: stop.bat
echo   查看后端日志: type logs\server.log
echo   查看前端日志: type logs\client.log
echo.
echo 💡 提示: 服务在后台运行，关闭终端不会停止服务
echo          要停止服务请运行 stop.bat
echo.

:: 尝试打开浏览器
start http://localhost:5173

pause 