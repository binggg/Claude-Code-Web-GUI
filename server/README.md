# Claude Code GUI v2 Server

A local Bun server that extends the Claude Code Web GUI with continue conversation functionality.

## Features

- **Continue Conversations**: Add messages to existing Claude Code sessions
- **Session Management**: Create and manage Claude Code sessions
- **API Integration**: RESTful API for web GUI integration
- **Claude Code Compatible**: Works with existing `.claude` directory structure
- **Development Ready**: Mock responses for development, ready for Claude API integration

## Prerequisites

- [Bun](https://bun.sh/) runtime installed
- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) installed and configured
- Existing `.claude` directory with projects

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
bun install
```

## Usage

### Development Mode
```bash
bun run dev
```

### Production Mode
```bash
bun run start
```

The server will start on `http://localhost:3000` by default.

## Configuration

### Environment Variables

- `PORT`: Server port (default: 3000)
- `CLAUDE_DIR`: Path to Claude directory (default: `~/.claude`)

### Example
```bash
PORT=8080 CLAUDE_DIR=/custom/path/.claude bun run start
```

## API Endpoints

### Health & Configuration
- `GET /api/health` - Health check
- `GET /api/config` - Server configuration
- `GET /api/claude-code/status` - Claude Code CLI status

### Projects & Sessions
- `GET /api/projects` - List all projects
- `GET /api/sessions/:project/:session` - Get session details
- `POST /api/sessions/:project/:session/continue` - Continue conversation
- `POST /api/sessions/:project` - Create new session

### Example: Continue Conversation
```bash
curl -X POST http://localhost:3000/api/sessions/my-project/session-123/continue \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, can you help me with this code?"}'
```

## Integration with Web GUI

The server serves the web GUI files and provides API endpoints for enhanced functionality. When running the server:

1. Access the web GUI at `http://localhost:3000`
2. The GUI will detect server availability and enable continue conversation features
3. FAB button functionality will connect to the server API

## Development Notes

### Current Status
- ✅ Basic server structure
- ✅ Project and session listing
- ✅ Mock continue conversation endpoint
- ⏳ Claude API integration (placeholder)
- ⏳ Web GUI server integration
- ⏳ Real-time session updates

### Next Steps
1. Integrate with Claude API for real conversation continuation
2. Add authentication and security measures
3. Implement real-time updates via WebSockets
4. Add session export/import functionality
5. Enhanced error handling and logging

## File Structure

```
server/
├── package.json          # Dependencies and scripts
├── server.js             # Main server application
├── README.md             # This file
└── (future additions)
    ├── api/              # API route handlers
    ├── middleware/       # Custom middleware
    ├── utils/            # Utility functions
    └── tests/            # Test files
```

## Security Considerations

- Server runs locally only (localhost)
- No external API keys stored in code
- CORS configured for local development
- File system access limited to Claude directory

## Troubleshooting

### Common Issues

1. **Claude directory not found**
   - Ensure Claude Code CLI is installed
   - Verify `CLAUDE_DIR` environment variable
   - Check directory permissions

2. **Port already in use**
   - Change port with `PORT=3001 bun run start`
   - Check for other running services

3. **Dependencies not found**
   - Run `bun install` in server directory
   - Ensure Bun is properly installed

### Logging

Server logs include:
- Startup information
- API request handling
- Error details
- Claude Code integration status

## License

MIT License - see parent directory LICENSE file.