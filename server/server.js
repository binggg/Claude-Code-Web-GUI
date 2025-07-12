import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { cors } from 'hono/cors'
import { readdir, readFile, writeFile, access } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = new Hono()

// Configuration
const PORT = process.env.PORT || 3000
const CLAUDE_DIR = process.env.CLAUDE_DIR || join(process.env.HOME || '', '.claude')

// CORS configuration
app.use('*', cors({
  origin: ['http://localhost:8000', 'http://127.0.0.1:8000', 'http://localhost:3000'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Serve static files from parent directory
app.use('/*', serveStatic({
  root: join(__dirname, '..'),
  rewriteRequestPath: (path) => path.replace(/^\//, '')
}))

// API Routes

// Health check
app.get('/api/health', (c) => {
  return c.json({ 
    status: 'ok', 
    version: '2.0.0',
    timestamp: new Date().toISOString()
  })
})

// Get projects list
app.get('/api/projects', async (c) => {
  try {
    const projectsDir = join(CLAUDE_DIR, 'projects')
    await access(projectsDir)
    
    const projects = await readdir(projectsDir, { withFileTypes: true })
    const projectList = []
    
    for (const project of projects) {
      if (project.isDirectory()) {
        const projectPath = join(projectsDir, project.name)
        const sessions = await readdir(projectPath)
        const sessionFiles = sessions.filter(file => file.endsWith('.jsonl'))
        
        projectList.push({
          name: project.name,
          displayName: project.name.replace(/-/g, '/'),
          sessionCount: sessionFiles.length,
          sessions: sessionFiles.map(file => file.replace('.jsonl', ''))
        })
      }
    }
    
    return c.json({ projects: projectList })
  } catch (error) {
    console.error('Failed to load projects:', error)
    return c.json({ error: 'Failed to load projects', details: error.message }, 500)
  }
})

// Get session details
app.get('/api/sessions/:projectName/:sessionId', async (c) => {
  try {
    const { projectName, sessionId } = c.req.param()
    const sessionPath = join(CLAUDE_DIR, 'projects', projectName, `${sessionId}.jsonl`)
    
    await access(sessionPath)
    const content = await readFile(sessionPath, 'utf-8')
    const lines = content.trim().split('\n')
    
    const messages = []
    let summary = null
    let lastTimestamp = null
    
    for (const line of lines) {
      try {
        const record = JSON.parse(line)
        if (record.type === 'summary') {
          summary = record.summary
        } else if (record.type === 'user' || record.type === 'assistant') {
          messages.push(record)
        }
        if (record.timestamp) {
          lastTimestamp = record.timestamp
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
    
    return c.json({
      id: sessionId,
      projectName,
      summary: summary || 'Untitled',
      timestamp: lastTimestamp,
      messages
    })
  } catch (error) {
    console.error('Failed to load session:', error)
    return c.json({ error: 'Failed to load session', details: error.message }, 500)
  }
})

// Continue conversation endpoint
app.post('/api/sessions/:projectName/:sessionId/continue', async (c) => {
  try {
    const { projectName, sessionId } = c.req.param()
    const { message, model = 'claude-3-sonnet-20240229' } = await c.req.json()
    
    if (!message) {
      return c.json({ error: 'Message is required' }, 400)
    }
    
    // For now, return a mock response
    // In production, this would integrate with Claude API
    const mockResponse = {
      id: `msg_${Date.now()}`,
      type: 'assistant',
      timestamp: new Date().toISOString(),
      message: {
        content: [
          {
            type: 'text',
            text: `This is a mock response from the v2 server. You sent: "${message}"\n\nNote: This is a development placeholder. In production, this would send your message to Claude and return the actual response. The server would also append both your message and Claude's response to the session file.`
          }
        ]
      }
    }
    
    // TODO: In production version:
    // 1. Append user message to session file
    // 2. Send message to Claude API
    // 3. Append Claude's response to session file
    // 4. Return the response
    
    return c.json({
      success: true,
      response: mockResponse,
      session: {
        id: sessionId,
        projectName,
        updated: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Failed to continue conversation:', error)
    return c.json({ error: 'Failed to continue conversation', details: error.message }, 500)
  }
})

// Create new session
app.post('/api/sessions/:projectName', async (c) => {
  try {
    const { projectName } = c.req.param()
    const { summary, initialMessage } = await c.req.json()
    
    if (!initialMessage) {
      return c.json({ error: 'Initial message is required' }, 400)
    }
    
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const sessionPath = join(CLAUDE_DIR, 'projects', projectName, `${sessionId}.jsonl`)
    
    // Create initial session data
    const timestamp = new Date().toISOString()
    const sessionData = [
      {
        type: 'summary',
        summary: summary || 'New Session',
        timestamp
      },
      {
        type: 'user',
        timestamp,
        message: {
          content: initialMessage
        }
      }
    ]
    
    const sessionContent = sessionData.map(record => JSON.stringify(record)).join('\n')
    await writeFile(sessionPath, sessionContent + '\n', 'utf-8')
    
    return c.json({
      success: true,
      session: {
        id: sessionId,
        projectName,
        summary: summary || 'New Session',
        created: timestamp
      }
    })
  } catch (error) {
    console.error('Failed to create session:', error)
    return c.json({ error: 'Failed to create session', details: error.message }, 500)
  }
})

// Claude Code integration status
app.get('/api/claude-code/status', async (c) => {
  try {
    // Check if Claude Code CLI is available
    const claudeConfigExists = await access(join(CLAUDE_DIR, 'config.json')).then(() => true).catch(() => false)
    const projectsExist = await access(join(CLAUDE_DIR, 'projects')).then(() => true).catch(() => false)
    
    return c.json({
      claudeCodeInstalled: claudeConfigExists && projectsExist,
      configPath: join(CLAUDE_DIR, 'config.json'),
      projectsPath: join(CLAUDE_DIR, 'projects'),
      recommendation: claudeConfigExists && projectsExist 
        ? 'Claude Code CLI is properly configured'
        : 'Please install and configure Claude Code CLI first'
    })
  } catch (error) {
    return c.json({ 
      claudeCodeInstalled: false, 
      error: error.message 
    }, 500)
  }
})

// Server configuration endpoint
app.get('/api/config', (c) => {
  return c.json({
    port: PORT,
    claudeDir: CLAUDE_DIR,
    version: '2.0.0',
    features: {
      continuousConversation: true,
      sessionManagement: true,
      claudeCodeIntegration: true,
      webGuiCompatibility: true
    }
  })
})

// Error handling middleware
app.onError((err, c) => {
  console.error('Server error:', err)
  return c.json({
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  }, 500)
})

// 404 handler
app.notFound((c) => {
  return c.json({
    error: 'Not found',
    path: c.req.path,
    method: c.req.method
  }, 404)
})

// Start server
console.log(`🚀 Claude Code GUI v2 Server starting on port ${PORT}`)
console.log(`📁 Claude directory: ${CLAUDE_DIR}`)
console.log(`🌐 Server will be available at: http://localhost:${PORT}`)

serve({
  fetch: app.fetch,
  port: PORT,
}, (info) => {
  console.log(`✅ Server is running on http://localhost:${info.port}`)
  console.log('\n📋 Available endpoints:')
  console.log('  GET  /api/health              - Health check')
  console.log('  GET  /api/config              - Server configuration')
  console.log('  GET  /api/claude-code/status  - Claude Code CLI status')
  console.log('  GET  /api/projects            - List all projects')
  console.log('  GET  /api/sessions/:project/:session - Get session details')
  console.log('  POST /api/sessions/:project/:session/continue - Continue conversation')
  console.log('  POST /api/sessions/:project   - Create new session')
  console.log('\n💡 The web GUI is also served at: http://localhost:' + info.port)
})