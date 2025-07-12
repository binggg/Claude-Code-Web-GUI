# GitHub Pages 缓存解决方案

## 问题描述
GitHub Pages 使用 CDN 缓存，导致更新后页面不会立即刷新。

## 解决方法

### 1. 用户端强制刷新
- **硬刷新**: `Ctrl+F5` (Windows) 或 `Cmd+Shift+R` (Mac)
- **开发者工具**: F12 → 网络标签 → 勾选"禁用缓存"
- **隐身模式**: 使用浏览器隐身/无痕模式访问

### 2. 查看缓存状态
访问这些URL查看文件是否已更新：
- https://binggg.github.io/Claude-Code-Web-GUI/assets/css/styles.css
- https://binggg.github.io/Claude-Code-Web-GUI/assets/js/app.js
- https://binggg.github.io/Claude-Code-Web-GUI/index.html

### 3. 缓存失效时间
- HTML文件：约10-15分钟
- CSS/JS文件：约1-2小时
- 完全更新：最多24小时

### 4. 开发建议
对于频繁更新的项目，可以考虑：
- 使用版本号参数：`app.js?v=1.0.1`
- 使用哈希值：`app-abc123.js`
- 设置自定义域名以更好控制缓存策略

## 当前部署状态
最新提交: `e76efcb`
包含改进: FAB按钮动画、JSONL分享格式、首页光效

等待缓存刷新时间: 10-60分钟