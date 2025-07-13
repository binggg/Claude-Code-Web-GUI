#!/bin/bash

# Vue 3 开发服务器启动脚本

PORT=8080
HOST="localhost"

echo "🚀 启动Vue版本开发服务器..."
echo "📂 服务目录: $(pwd)"
echo "🌐 Vue版本: http://$HOST:$PORT/index-vue.html"
echo "📱 原版地址: http://$HOST:$PORT/index.html"
echo "⏹️  按 Ctrl+C 停止服务器"

# 检查端口是否被占用
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  端口 $PORT 已被占用，尝试使用端口 8081"
    PORT=8081
fi

# 自动打开浏览器（可选）
if command -v open >/dev/null 2>&1; then
    # macOS
    open "http://$HOST:$PORT/index-vue.html"
elif command -v xdg-open >/dev/null 2>&1; then
    # Linux
    xdg-open "http://$HOST:$PORT/index-vue.html"
elif command -v start >/dev/null 2>&1; then
    # Windows
    start "http://$HOST:$PORT/index-vue.html"
fi

# 启动服务器 (优先使用 Python 3)
if command -v python3 >/dev/null 2>&1; then
    python3 -m http.server $PORT
elif command -v python >/dev/null 2>&1; then
    python -m http.server $PORT
else
    echo "❌ 错误: 未找到 Python。请安装 Python 3"
    exit 1
fi