// Claude Code Manager - handles all core functionality for React version
import { Utils } from './utils'
export class ClaudeCodeManager {
  constructor() {
    this.gistManager = new GistManager()
    this.MAX_GIST_SIZE = 900000 // ~900KB limit for safety
  }

  async checkForSharedSession(setAppState) {
    const hash = window.location.hash
    
    // Check for shared session via hash
    if (hash.startsWith('#session=')) {
      const sessionParam = hash.substring(9)
      try {
        console.log('Hash session param found:', sessionParam.substring(0, 50) + '...')
        const sessionData = JSON.parse(this.base64ToUnicode(sessionParam))
        this.displaySharedSession(sessionData, setAppState)
        return
      } catch (error) {
        console.error('Failed to load shared session from hash:', error)
        setAppState(prev => ({ 
          ...prev, 
          error: `Failed to load shared session: ${error.message}` 
        }))
      }
    }
    
    // Check for Gist auto-import
    if (hash.startsWith('#import=')) {
      const gistUrl = decodeURIComponent(hash.substring(8))
      this.autoImportGist(gistUrl, setAppState)
      return
    }
  }

  async autoImportGist(gistUrl, setAppState) {
    setAppState(prev => ({ ...prev, loading: true }))
    
    try {
      const gistData = await this.gistManager.importFromGist(gistUrl)
      this.displayImportedGist(gistData, setAppState)
    } catch (error) {
      console.error('Auto-import failed:', error)
      setAppState(prev => ({ 
        ...prev, 
        loading: false,
        error: `Failed to import Gist: ${error.message}` 
      }))
    }
  }

  displaySharedSession(sessionData, setAppState) {
    setAppState(prev => ({
      ...prev,
      view: 'shared',
      currentSession: {
        ...sessionData,
        messages: sessionData.msgs || sessionData.messages || []
      },
      loading: false
    }))
  }

  displayImportedGist(gistData, setAppState) {
    // Parse JSONL content if it's a JSONL gist
    let sessionData = gistData
    
    if (gistData.isJSONL) {
      sessionData = this.parseJSONLContent(gistData.content)
      sessionData.title = gistData.title
      sessionData.url = gistData.url
    }

    setAppState(prev => ({
      ...prev,
      view: 'shared',
      currentSession: sessionData,
      loading: false
    }))
  }

  parseJSONLContent(jsonlContent) {
    const lines = jsonlContent.trim().split('\n')
    let sessionInfo = null
    const messages = []
    
    for (const line of lines) {
      try {
        const record = JSON.parse(line)
        if (record.type === 'session_info') {
          sessionInfo = record
        } else if (record.type === 'user' || record.type === 'assistant') {
          // Convert optimized format back to standard format
          const standardMessage = this.convertOptimizedMessage(record)
          messages.push(standardMessage)
        }
      } catch (e) {
        console.warn('Failed to parse JSONL line:', line)
      }
    }
    
    return {
      id: sessionInfo?.id || 'imported',
      title: sessionInfo?.summary || 'Imported Session',
      summary: sessionInfo?.summary || 'Imported Session',
      timestamp: sessionInfo?.timestamp,
      projectName: sessionInfo?.projectName,
      messages: messages
    }
  }

  convertOptimizedMessage(optimizedMsg) {
    if (optimizedMsg.msg) {
      // New optimized format
      return {
        type: optimizedMsg.type,
        timestamp: optimizedMsg.ts || optimizedMsg.timestamp,
        message: optimizedMsg.msg
      }
    } else {
      // Old format, return as is
      return optimizedMsg
    }
  }

  async loadProjects(directoryHandle) {
    const projects = []
    const allSessions = []
    
    try {
      const projectsHandle = await directoryHandle.getDirectoryHandle('projects')
      
      for await (const [name, handle] of projectsHandle.entries()) {
        if (handle.kind === 'directory') {
          const sessions = []
          for await (const [fileName, fileHandle] of handle.entries()) {
            if (fileName.endsWith('.jsonl')) {
              const sessionId = fileName.replace('.jsonl', '')
              sessions.push({ id: sessionId, handle: fileHandle, projectName: name })
            }
          }
          
          const projectPath = name.replace(/-/g, '/')
          projects.push({
            name: projectPath,
            path: name,
            sessions: sessions,
            handle: handle
          })
          
          allSessions.push(...sessions)
        }
      }
      
      // Load session metadata
      const sessionsWithData = await this.loadAllSessionsMetadata(allSessions)
      
      return { projects, allSessions: sessionsWithData }
      
    } catch (error) {
      throw new Error(`Failed to load projects: ${error.message}`)
    }
  }

  async loadAllSessionsMetadata(sessions) {
    const sessionsWithData = []
    
    for (const session of sessions) {
      try {
        const file = await session.handle.getFile()
        const content = await file.text()
        const lines = content.trim().split('\n')
        
        let summary = null
        let firstMessage = null
        let lastTimestamp = null
        
        for (const line of lines) {
          try {
            const record = JSON.parse(line)
            if (record.type === 'summary') {
              summary = record.summary
            } else if (record.type === 'user' && !firstMessage) {
              firstMessage = record.message.content
            }
            if (record.timestamp) {
              lastTimestamp = record.timestamp
            }
          } catch (e) {
            // Ignore parsing errors
          }
        }
        
        sessionsWithData.push({
          ...session,
          summary: summary || firstMessage || 'Untitled',
          timestamp: lastTimestamp,
        })
      } catch (error) {
        console.error('Failed to load session:', session.id, error)
      }
    }
    
    // Sort by time (newest first)
    return sessionsWithData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  async loadSessionMessages(session) {
    try {
      const file = await session.handle.getFile()
      const content = await file.text()
      const lines = content.trim().split('\n')
      
      const messages = []
      
      for (const line of lines) {
        try {
          const record = JSON.parse(line)
          if (record.type === 'user' || record.type === 'assistant') {
            messages.push(record)
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
      
      return messages
    } catch (error) {
      throw new Error(`Failed to load session messages: ${error.message}`)
    }
  }

  async prepareSessionForSharing(session) {
    const file = await session.handle.getFile()
    const content = await file.text()
    const lines = content.trim().split('\n')
    
    const messages = []
    for (const line of lines) {
      try {
        const record = JSON.parse(line)
        if (record.type === 'user' || record.type === 'assistant') {
          messages.push(record)
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
    
    return {
      id: session.id,
      summary: session.summary,
      timestamp: session.timestamp,
      projectName: session.projectName,
      messages: messages,
      metadata: {
        sharedAt: new Date().toISOString(),
        sharedBy: 'Claude Code Web GUI',
        version: '1.0.0'
      }
    }
  }

  async shareSession(session, t) {
    // This method is no longer used - React components handle the UI
    // Keeping for backwards compatibility
    console.warn('shareSession method deprecated - use React ShareModal instead')
  }

  sessionToJSONL(sessionData) {
    const lines = []
    
    // Add session metadata
    lines.push(JSON.stringify({
      type: 'session_info',
      id: sessionData.id,
      summary: sessionData.summary,
      timestamp: sessionData.timestamp,
      projectName: sessionData.projectName,
      sharedAt: sessionData.metadata?.sharedAt || new Date().toISOString(),
      version: sessionData.metadata?.version || '1.0.0'
    }))
    
    // Add optimized messages
    const optimizedMessages = this.optimizeMessagesForSharing(sessionData.messages)
    let totalSize = lines.join('\n').length
    
    for (const message of optimizedMessages) {
      const messageJson = JSON.stringify(message)
      if (totalSize + messageJson.length > this.MAX_GIST_SIZE) {
        // Add truncation notice
        lines.push(JSON.stringify({
          type: 'truncation_notice',
          message: `Due to size limitations, only the first ${lines.length - 1} messages are included.`,
          originalCount: sessionData.messages.length,
          includedCount: lines.length - 1
        }))
        break
      }
      lines.push(messageJson)
      totalSize += messageJson.length + 1 // +1 for newline
    }
    
    return lines.join('\n')
  }

  optimizeMessagesForSharing(messages) {
    const optimized = []
    const seenContent = new Set()
    
    for (const message of messages) {
      // Create content hash for deduplication
      const contentStr = JSON.stringify(message.message?.content || '')
      if (seenContent.has(contentStr)) {
        continue // Skip duplicate content
      }
      seenContent.add(contentStr)
      
      // Optimize message format to save space
      const optimizedMessage = {
        type: message.type,
        ts: message.timestamp,
        msg: message.message
      }
      
      optimized.push(optimizedMessage)
    }
    
    return optimized
  }

  base64ToUnicode(str) {
    return Utils.base64ToUnicode(str)
  }
}

// Enhanced GistManager for the React version
class GistManager {
  constructor() {
    this.MAX_GIST_SIZE = 900000 // ~900KB limit for safety
  }

  async shareToGist(sessionData, t) {
    // Prepare content and metadata
    const jsonlContent = this.sessionToJSONL(sessionData)
    
    // Copy content to clipboard first
    try {
      await navigator.clipboard.writeText(jsonlContent)
      console.log('Content copied to clipboard successfully')
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      alert(t('copyFailed') || '复制失败: ' + err.message)
      return
    }
    
    // Open GitHub Gist in new tab
    window.open('https://gist.github.com/', '_blank')
  }

  sessionToJSONL(sessionData) {
    const lines = []
    
    // Add session metadata
    lines.push(JSON.stringify({
      type: 'session_info',
      id: sessionData.id,
      summary: sessionData.summary,
      timestamp: sessionData.timestamp,
      projectName: sessionData.projectName,
      sharedAt: sessionData.metadata?.sharedAt || new Date().toISOString(),
      version: sessionData.metadata?.version || '1.0.0'
    }))
    
    // Add optimized messages
    const optimizedMessages = this.optimizeMessagesForSharing(sessionData.messages)
    let totalSize = lines.join('\n').length
    
    for (const message of optimizedMessages) {
      const messageJson = JSON.stringify(message)
      if (totalSize + messageJson.length > this.MAX_GIST_SIZE) {
        // Add truncation notice
        lines.push(JSON.stringify({
          type: 'truncation_notice',
          message: `Due to size limitations, only the first ${lines.length - 1} messages are included.`,
          originalCount: sessionData.messages.length,
          includedCount: lines.length - 1
        }))
        break
      }
      lines.push(messageJson)
      totalSize += messageJson.length + 1 // +1 for newline
    }
    
    return lines.join('\n')
  }

  optimizeMessagesForSharing(messages) {
    const optimized = []
    const seenContent = new Set()
    
    for (const message of messages) {
      // Create content hash for deduplication
      const contentStr = JSON.stringify(message.message?.content || '')
      if (seenContent.has(contentStr)) {
        continue // Skip duplicate content
      }
      seenContent.add(contentStr)
      
      // Optimize message format to save space
      const optimizedMessage = {
        type: message.type,
        ts: message.timestamp,
        msg: message.message
      }
      
      optimized.push(optimizedMessage)
    }
    
    return optimized
  }

  async importFromGist(gistUrl) {
    if (!gistUrl) {
      throw new Error('Invalid Gist URL')
    }
    
    const gistId = this.extractGistId(gistUrl)
    if (!gistId) {
      throw new Error('Invalid Gist URL format')
    }
    
    return await this.fetchGistContent(gistId)
  }

  extractGistId(url) {
    const patterns = [
      /gist\.github\.com\/[^\/]+\/([a-f0-9]+)/,
      /gist\.github\.com\/([a-f0-9]+)/,
      /^([a-f0-9]+)$/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        return match[1]
      }
    }
    return null
  }

  async fetchGistContent(gistId) {
    // Try Raw URLs first (no rate limits)
    try {
      return await this.fetchGistRaw(gistId)
    } catch (error) {
      console.log('Raw URL strategy failed, trying API...')
    }
    
    // Try API as fallback
    try {
      return await this.fetchGistViaAPI(gistId)
    } catch (error) {
      throw new Error(`Failed to fetch Gist: ${error.message}`)
    }
  }

  async fetchGistRaw(gistId) {
    const rawUrls = [
      `https://gist.githubusercontent.com/raw/${gistId}/claude-session.jsonl`,
      `https://gist.githubusercontent.com/raw/${gistId}`,
      `https://gist.github.com/${gistId}/raw/claude-session.jsonl`,
      `https://gist.github.com/${gistId}/raw`
    ]
    
    for (const url of rawUrls) {
      try {
        const response = await fetch(url)
        if (response.ok) {
          const content = await response.text()
          if (!content || content.trim().length === 0) continue
          if (content.includes('<!DOCTYPE html>')) continue
          
          return {
            id: gistId,
            title: `Gist ${gistId}`,
            content: content,
            url: `https://gist.github.com/${gistId}`,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            isJSONL: this.detectJSONLFormat(content)
          }
        }
      } catch (error) {
        console.log(`Raw URL error: ${error.message}`)
      }
    }
    
    throw new Error('All Raw URL attempts failed')
  }

  async fetchGistViaAPI(gistId) {
    const apiUrl = `https://api.github.com/gists/${gistId}`
    const response = await fetch(apiUrl)
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Gist not found or private')
      } else if (response.status === 403) {
        throw new Error('API rate limit exceeded')
      } else {
        throw new Error(`API request failed: ${response.status}`)
      }
    }
    
    const gistData = await response.json()
    const files = Object.values(gistData.files)
    
    // Find session file
    let sessionFile = files.find(file => 
      file.filename.endsWith('.jsonl') || 
      file.filename.toLowerCase().includes('session') ||
      file.filename.toLowerCase().includes('claude')
    )
    
    if (!sessionFile) {
      sessionFile = files.find(file => 
        file.filename.endsWith('.md') || 
        file.filename.toLowerCase().includes('conversation')
      )
    }
    
    if (!sessionFile) {
      throw new Error('No valid session file found in Gist')
    }
    
    return {
      id: gistId,
      title: gistData.description || sessionFile.filename,
      content: sessionFile.content,
      url: gistData.html_url,
      created: gistData.created_at,
      updated: gistData.updated_at,
      isJSONL: sessionFile.filename.endsWith('.jsonl')
    }
  }

  detectJSONLFormat(content) {
    const lines = content.trim().split('\n')
    if (lines.length === 0) return false
    
    let validJsonLines = 0
    const samplesToCheck = Math.min(5, lines.length)
    
    for (let i = 0; i < samplesToCheck; i++) {
      try {
        const parsed = JSON.parse(lines[i])
        if (parsed && typeof parsed === 'object') {
          validJsonLines++
        }
      } catch (e) {
        // Not valid JSON
      }
    }
    
    return validJsonLines >= Math.ceil(samplesToCheck * 0.8)
  }
}