# Claude Code Web GUI

A simple and practical Claude Code session browser that runs entirely in your browser with no server required.

English | [中文](README_ZH.md)

## Features

- **Local Operation** - Runs entirely in your browser without requiring software installation or server setup
- **Session Browsing** - Browse local Claude Code session history organized by projects  
- **Search & Filter** - Quickly search and locate specific sessions
- **Session Sharing** - Share session content via direct links or GitHub Gist
- **Responsive UI** - Works on desktop and mobile devices
- **Bilingual Support** - Switch between Chinese and English interfaces

## Quick Start

### Online Usage (Recommended)
Visit: https://binggg.github.io/claude-code-web-gui/

### Local Development
```bash
git clone https://github.com/binggg/claude-code-web-gui.git
cd claude-code-web-gui
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