
@echo off
chcp 65001 >nul
echo 🛑 停止兰溪招聘项目...
echo.

:: 停止占用端口3000的进程
echo 🔧 停止后端API服务...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    if not "%%a"=="0" (
        echo 停止进程 %%a
        taskkill /F /PID %%a >nul 2>&1
    )
)

:: 停止占用端口5173的进程
echo 🎨 停止前端开发服务器...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do (
    if not "%%a"=="0" (
        echo 停止进程 %%a
        taskkill /F /PID %%a >nul 2>&1
    )
)

:: 停止Node.js相关进程
echo 🧹 清理Node.js进程...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM npm.cmd >nul 2>&1

echo.
echo ✅ 兰溪招聘项目已完全停止！
echo.
echo 📋 可用命令:
echo   启动服务: start.bat
echo   查看日志: type logs\server.log 或 type logs\client.log
echo.
pause 