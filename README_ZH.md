# <div align="center"><img src="assets/icons/logo.png" alt="Claude Code Web GUI" height="100"></div>

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

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
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

## 开发指南

### 前置要求
- Node.js 16+
- 支持 File System Access API 的现代浏览器

### 项目结构
```
src/
├── components/          # React 组件
│   ├── Header.jsx      # 主页头部
│   ├── Sidebar.jsx     # 会话浏览器
│   ├── MainContent.jsx # 主内容区域
│   └── ...             # 其他组件
├── hooks/              # 自定义 React 钩子
├── utils/              # 业务逻辑和工具函数
├── styles/             # CSS 样式
└── App.jsx            # 主应用组件
```

### 添加新功能
1. 在 `src/components/` 中创建组件
2. 在 `src/utils/claudeCodeManager.js` 中添加业务逻辑
3. 在 `src/utils/i18n.js` 中更新翻译
4. 在 `src/styles/globals.css` 中添加样式

## 技术架构

### React 版本（当前）
- 前端：React 18 现代化钩子
- 构建工具：Vite 快速开发和优化构建
- 样式：现代 CSS（Grid + Flexbox）
- 文件访问：File System Access API
- 数据解析：JSONL 格式支持
- 组件结构：模块化、可复用的 React 组件

### 核心组件
- **Header**：主页头部与操作区
- **Sidebar**：会话浏览器与项目分组
- **MainContent**：聊天消息显示区域
- **MarkdownContent**：增强的 Markdown 渲染与语法高亮
- **ToolCall**：工具调用可视化
- **FABContainer**：快速操作浮动按钮

## 隐私说明

本应用完全在本地浏览器中运行，不会上传任何数据到远程服务器。所有会话数据仅在您的设备上处理。

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 贡献

欢迎提交 Issue 和 Pull Request。

---

如果这个项目对您有帮助，请给个 ⭐ Star！
