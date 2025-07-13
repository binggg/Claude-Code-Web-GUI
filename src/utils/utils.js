// Utility functions for the React version - replaces various assets/js utilities
export class Utils {
  // Time formatting utilities (from original app.js)
  static formatTimeAgo(timestamp, t) {
    if (!timestamp) return t('timeAgo.unknown') || 'Unknown time'
    
    const now = new Date()
    const messageTime = new Date(timestamp)
    const diffMs = now - messageTime
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays > 0) {
      return t('timeAgo.daysAgo', diffDays)
    } else if (diffHours > 0) {
      return t('timeAgo.hoursAgo', diffHours)
    } else if (diffMinutes > 0) {
      return t('timeAgo.minutesAgo', diffMinutes)
    } else {
      return t('timeAgo.justNow')
    }
  }

  // Project name formatting (from original app.js)
  static getProjectDisplayName(projectName) {
    if (!projectName) return 'Unknown'
    
    // Handle various project name formats
    const name = projectName.replace(/-/g, '/')
    
    // Truncate very long names
    if (name.length > 50) {
      return name.substring(0, 47) + '...'
    }
    
    return name
  }

  // Copy to clipboard with feedback (from original chat-renderer.js)
  static async copyToClipboard(text, button = null) {
    try {
      await navigator.clipboard.writeText(text)
      
      if (button) {
        const originalText = button.textContent
        button.textContent = '✓'
        button.style.background = '#238636'
        button.style.color = '#fff'
        
        setTimeout(() => {
          button.textContent = originalText
          button.style.background = ''
          button.style.color = ''
        }, 2000)
      }
      
      return true
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      return false
    }
  }

  // VSCode integration (from original app.js)
  static openInVSCode(projectPath) {
    if (!projectPath) return
    
    // Try to open with VSCode protocol
    const vscodeUrl = `vscode://file${projectPath}`
    
    try {
      window.open(vscodeUrl, '_blank')
    } catch (error) {
      console.error('Failed to open in VSCode:', error)
      // Fallback: copy path to clipboard
      this.copyToClipboard(projectPath)
      alert('VSCode协议打开失败，路径已复制到剪贴板')
    }
  }

  // URL encoding/decoding utilities (from original app.js)
  static base64ToUnicode(str) {
    try {
      console.log('Decoding input length:', str.length)
      
      let cleanStr = str.replace(/\s/g, '') // Remove whitespace
      
      // Check if this looks like base64
      const isBase64 = /^[A-Za-z0-9+/]*={0,2}$/.test(cleanStr)
      
      if (!isBase64) {
        console.log('Not base64 format, treating as URL encoded')
        return decodeURIComponent(cleanStr)
      }
      
      // Add padding if needed
      const paddingNeeded = (4 - (cleanStr.length % 4)) % 4
      if (paddingNeeded > 0) {
        cleanStr += '='.repeat(paddingNeeded)
      }
      
      // Try to decode base64
      const decoded = atob(cleanStr)
      
      // Try UTF-8 decoding for Unicode content
      try {
        const utf8Result = decodeURIComponent(Array.prototype.map.call(decoded, (c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
        
        // Validate that it's valid JSON
        JSON.parse(utf8Result)
        return utf8Result
      } catch (utf8Error) {
        // Fallback: check if it's plain ASCII JSON
        try {
          JSON.parse(decoded)
          return decoded
        } catch (jsonError) {
          throw utf8Error
        }
      }
      
    } catch (error) {
      console.error('Base64 decode failed:', error)
      throw new Error(`Failed to decode: ${error.message}`)
    }
  }

  static unicodeToBase64(str) {
    try {
      // First encode as UTF-8, then base64
      const utf8Encoded = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode(parseInt(p1, 16))
      })
      
      return btoa(utf8Encoded)
    } catch (error) {
      console.error('Base64 encode failed:', error)
      throw new Error(`Failed to encode: ${error.message}`)
    }
  }

  // Session validation utilities
  static validateSessionData(sessionData) {
    if (!sessionData) return false
    if (!sessionData.messages || !Array.isArray(sessionData.messages)) return false
    if (sessionData.messages.length === 0) return false
    
    // Check that messages have required fields
    return sessionData.messages.every(msg => 
      msg.type && (msg.type === 'user' || msg.type === 'assistant') && msg.message
    )
  }

  // File size formatting
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 B'
    
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  // Debounce utility for search
  static debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }
}

// Export individual functions for easier importing
export const {
  formatTimeAgo,
  getProjectDisplayName,
  copyToClipboard,
  openInVSCode,
  base64ToUnicode,
  unicodeToBase64,
  validateSessionData,
  formatFileSize,
  debounce
} = Utils