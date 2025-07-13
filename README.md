# <div align="center"><img src="assets/icons/logo.png" alt="Claude Code Web GUI" height="100"></div>

<div align="center">

# Claude Code Web GUI

[![GitHub stars](https://img.shields.io/github/stars/binggg/Claude-Code-Web-GUI?style=flat-square&logo=github)](https://github.com/binggg/Claude-Code-Web-GUI/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/binggg/Claude-Code-Web-GUI?style=flat-square&logo=github)](https://github.com/binggg/Claude-Code-Web-GUI/network)
[![GitHub issues](https://img.shields.io/github/issues/binggg/Claude-Code-Web-GUI?style=flat-square&logo=github)](https://github.com/binggg/Claude-Code-Web-GUI/issues)
[![GitHub license](https://img.shields.io/github/license/binggg/Claude-Code-Web-GUI?style=flat-square)](https://github.com/binggg/Claude-Code-Web-GUI/blob/main/LICENSE)
[![GitHub deployments](https://img.shields.io/github/deployments/binggg/Claude-Code-Web-GUI/github-pages?style=flat-square&label=deployment)](https://binggg.github.io/Claude-Code-Web-GUI/)

</div>

🚀 Browse, view and share your Claude Code sessions - runs entirely in browser, no server required!

English | [中文](README_ZH.md)

https://github.com/user-attachments/assets/039dc640-d5fc-4c29-9bb8-a386bd1a9da8

> [!TIP]
> ⭐ Show your support — star the repo

## Features

- **Local Operation** - Runs entirely in your browser without requiring software installation or server setup
- **Session Browsing** - Browse local Claude Code session history organized by projects  
- **Search & Filter** - Quickly search and locate specific sessions
- **Session Sharing** - Share session content via direct links or GitHub Gist
- **Responsive UI** - Works on desktop and mobile devices
- **Bilingual Support** - Switch between Chinese and English interfaces

## Quick Start

### Online Usage (Recommended)
Visit: https://binggg.github.io/Claude-Code-Web-GUI/

### Local Development
```bash
git clone https://github.com/binggg/Claude-Code-Web-GUI.git
cd Claude-Code-Web-GUI
python -m http.server 8000
# Open http://localhost:8000 in browser
```

## How to Use

1. Ensure you have installed and used [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code)
2. Open the app in a browser that supports File System Access API (Chrome/Edge)
3. Click "Select .claude directory" and choose the `~/.claude` folder
   - Press `Cmd+Shift+.` (Mac) or `Ctrl+H` (Windows/Linux) to show hidden files
4. Browse your session history

## Sharing Features

### Direct Link Sharing
- Quick sharing with first 10 messages of a session
- Suitable for brief content previews

### GitHub Gist Sharing  
- Contains complete session content
- Supports Markdown formatting
- Recommended for sharing full sessions

## Browser Compatibility

Requires modern browsers with File System Access API support:
- Chrome 86+
- Edge 86+
- Other Chromium-based browsers

## Technical Architecture

- Frontend: Vanilla JavaScript ES6+
- Styling: Modern CSS (Grid + Flexbox)
- File Access: File System Access API
- Data Parsing: JSONL format support

## Privacy Notice

This application runs entirely in your local browser and does not upload any data to remote servers. All session data is processed only on your device.

## License

MIT License - see [LICENSE](LICENSE) file for details

## Contributing

Issues and Pull Requests are welcome.

---

If this project helps you, please give it a ⭐ Star!
