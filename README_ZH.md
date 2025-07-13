# <div align="center"><img src="assets/icons/logo.svg" alt="Claude Code Web GUI" height="150"></div>

<div align="center">

# Claude Code Web GUI

[![GitHub stars](https://img.shields.io/github/stars/binggg/Claude-Code-Web-GUI?style=flat-square&logo=github)](https://github.com/binggg/Claude-Code-Web-GUI/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/binggg/Claude-Code-Web-GUI?style=flat-square&logo=github)](https://github.com/binggg/Claude-Code-Web-GUI/network)
[![GitHub issues](https://img.shields.io/github/issues/binggg/Claude-Code-Web-GUI?style=flat-square&logo=github)](https://github.com/binggg/Claude-Code-Web-GUI/issues)
[![GitHub license](https://img.shields.io/github/license/binggg/Claude-Code-Web-GUI?style=flat-square)](https://github.com/binggg/Claude-Code-Web-GUI/blob/main/LICENSE)
[![GitHub deployments](https://img.shields.io/github/deployments/binggg/Claude-Code-Web-GUI/github-pages?style=flat-square&label=deployment)](https://binggg.github.io/Claude-Code-Web-GUI/)

</div>

🚀 浏览、查看和分享您的 Claude Code 会话历史 - 完全在浏览器中运行，无需服务器！

[English](README.md) | 中文

https://github.com/user-attachments/assets/039dc640-d5fc-4c29-9bb8-a386bd1a9da8

> [!TIP]
> ⭐ 给个Star支持一下 — 为仓库点星

## 功能特性

- **本地运行** - 完全在浏览器中运行，无需安装软件或搭建服务器
- **会话浏览** - 按项目分组浏览本地 Claude Code 会话历史
- **搜索过滤** - 快速搜索和定位特定会话
- **会话分享** - 通过链接或 GitHub Gist 分享会话内容
- **响应式界面** - 适配桌面和移动设备
- **双语支持** - 中英文界面切换

## 快速开始

### 在线使用（推荐）
访问：https://binggg.github.io/Claude-Code-Web-GUI/

### 本地运行
```bash
git clone https://github.com/binggg/Claude-Code-Web-GUI.git
cd Claude-Code-Web-GUI
python -m http.server 8000
# 浏览器打开 http://localhost:8000
```

## 使用方法

1. 确保已安装使用 [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code)
2. 在支持 File System Access API 的浏览器中打开应用（Chrome/Edge）
3. 点击"选择 .claude 目录"，选择 `~/.claude` 文件夹
   - 按 `Cmd+Shift+.` (Mac) 或 `Ctrl+H` (Windows/Linux) 显示隐藏文件
4. 浏览您的会话历史

## 分享功能

### 直接链接分享
- 快速分享，包含会话前10条消息
- 适合简短内容的快速预览

### GitHub Gist 分享
- 包含完整会话内容
- 支持 Markdown 格式
- 推荐用于完整会话分享

## 浏览器兼容性

需要支持 File System Access API 的现代浏览器：
- Chrome 86+
- Edge 86+
- 其他基于 Chromium 的浏览器

## 技术架构

- 前端：原生 JavaScript ES6+
- 样式：现代 CSS（Grid + Flexbox）
- 文件访问：File System Access API
- 数据解析：JSONL 格式支持

## 隐私说明

本应用完全在本地浏览器中运行，不会上传任何数据到远程服务器。所有会话数据仅在您的设备上处理。

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 贡献

欢迎提交 Issue 和 Pull Request。

---

如果这个项目对您有帮助，请给个 ⭐ Star！
