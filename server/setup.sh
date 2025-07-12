#!/bin/bash

# Claude Code GUI v2 Server Setup Script

echo "🚀 Setting up Claude Code GUI v2 Server..."

# Check if Bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed. Please install Bun first:"
    echo "   curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

echo "✅ Bun is installed"

# Check if Claude Code CLI is installed
if [ ! -d "$HOME/.claude" ]; then
    echo "⚠️  Warning: Claude Code CLI directory not found at ~/.claude"
    echo "   Please install Claude Code CLI first:"
    echo "   https://docs.anthropic.com/en/docs/claude-code"
    echo ""
    echo "   Continuing setup anyway..."
fi

# Navigate to server directory
cd "$(dirname "$0")"

# Install dependencies
echo "📦 Installing dependencies..."
bun install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create start script
cat > start.sh << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"
echo "🌟 Starting Claude Code GUI v2 Server..."
bun run start
EOF

chmod +x start.sh

# Create development script  
cat > dev.sh << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"
echo "🔧 Starting Claude Code GUI v2 Server in development mode..."
bun run dev
EOF

chmod +x dev.sh

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Quick start:"
echo "   Production:  ./start.sh"
echo "   Development: ./dev.sh"
echo ""
echo "🌐 Server will be available at: http://localhost:3000"
echo "💡 Web GUI will be served from the same address"
echo ""
echo "🔧 Configuration:"
echo "   Claude directory: ${CLAUDE_DIR:-$HOME/.claude}"
echo "   Port: ${PORT:-3000}"
echo ""
echo "📖 See README.md for more information"