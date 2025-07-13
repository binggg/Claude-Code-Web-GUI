// GistManager.js - Gist管理服务
export class GistManager {
  constructor() {
    this.apiKey = localStorage.getItem('github-api-key')
  }
  
  /**
   * 获取Gist内容 - 使用Raw URL优先策略
   */
  async fetchGist(gistId) {
    // 策略1: 优先尝试Raw URL访问（无限制）
    try {
      const rawData = await this.fetchGistRaw(gistId)
      if (rawData) {
        console.log('Successfully fetched via Raw URL (no rate limit)')
        return rawData
      }
    } catch (error) {
      console.log('Raw URL failed, trying API method:', error.message)
    }
    
    // 策略2: 降级到GitHub API（如果用户配置了密钥）
    if (this.apiKey) {
      try {
        return await this.fetchGistViaAPI(gistId, this.apiKey)
      } catch (error) {
        console.log('API with user key failed:', error.message)
      }
    }
    
    // 策略3: 尝试无认证API调用（60次/小时限制）
    try {
      return await this.fetchGistViaAPI(gistId)
    } catch (error) {
      console.log('Unauthenticated API failed:', error.message)
      // 如果是403错误，建议配置API密钥
      if (error.message.includes('403') || error.message.includes('rate limit')) {
        throw new Error('GitHub API rate limit exceeded. Please configure your API key in settings for unlimited access.')
      }
      throw error
    }
  }
  
  /**
   * 通过Raw URL获取Gist内容
   */
  async fetchGistRaw(gistId) {
    const rawPatterns = [
      `https://gist.githubusercontent.com/raw/${gistId}`,
      `https://gist.github.com/${gistId}/raw`,
    ]
    
    for (const url of rawPatterns) {
      try {
        console.log(`Trying raw URL: ${url}`)
        const response = await fetch(url)
        
        if (response.ok) {
          const content = await response.text()
          
          // 检查内容是否为空或错误页面
          if (!content || content.trim().length === 0) {
            continue
          }
          
          // 检查是否是GitHub的404页面
          if (content.includes('<!DOCTYPE html>') && content.includes('GitHub')) {
            continue
          }
          
          return {
            id: gistId,
            title: `Gist ${gistId}`,
            content: content,
            url: `https://gist.github.com/${gistId}`,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            isJSONL: this.detectJSONLFormat(content),
            source: 'raw'
          }
        }
      } catch (error) {
        console.log(`Raw URL ${url} failed:`, error.message)
        continue
      }
    }
    
    throw new Error('Unable to fetch Gist content via Raw URLs')
  }
  
  /**
   * 通过GitHub API获取Gist内容
   */
  async fetchGistViaAPI(gistId, apiKey = null) {
    const headers = {}
    if (apiKey) {
      headers['Authorization'] = `token ${apiKey}`
    }
    
    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: headers
    })
    
    if (response.ok) {
      const gist = await response.json()
      
      // 查找会话文件
      const files = Object.values(gist.files)
      let sessionFile = files.find(file => 
        file.filename.endsWith('.jsonl') || 
        file.type === 'text/plain' ||
        file.filename.toLowerCase().includes('session') ||
        file.filename.toLowerCase().includes('claude')
      )
      
      // 如果没找到JSONL文件，查找markdown文件
      if (!sessionFile) {
        sessionFile = files.find(file => 
          file.filename.endsWith('.md') || 
          file.type === 'text/markdown' ||
          file.filename.toLowerCase().includes('conversation')
        )
      }
      
      if (!sessionFile) {
        throw new Error('Gist中未找到会话文件')
      }
      
      return {
        id: gistId,
        title: gist.description || sessionFile.filename,
        content: sessionFile.content,
        url: gist.html_url,
        created: gist.created_at,
        updated: gist.updated_at,
        isJSONL: sessionFile.filename.endsWith('.jsonl') || sessionFile.type === 'text/plain',
        source: 'api'
      }
    } else if (response.status === 403) {
      throw new Error('GitHub API rate limit exceeded')
    } else if (response.status === 404) {
      throw new Error('Gist not found or private')
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
  }
  
  /**
   * 检测内容是否为JSONL格式
   */
  detectJSONLFormat(content) {
    const lines = content.trim().split('\n')
    if (lines.length === 0) return false
    
    let jsonCount = 0
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      try {
        JSON.parse(lines[i])
        jsonCount++
      } catch (e) {
        // 不是JSON行
      }
    }
    
    return jsonCount > 0 && jsonCount / Math.min(3, lines.length) > 0.5
  }
  
  /**
   * 从URL中提取Gist ID
   */
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
  
  /**
   * 更新API密钥
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey
    if (apiKey) {
      localStorage.setItem('github-api-key', apiKey)
    } else {
      localStorage.removeItem('github-api-key')
    }
  }
}