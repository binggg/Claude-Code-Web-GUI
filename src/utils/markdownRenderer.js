// Enhanced Markdown renderer for Claude Code GUI React - matching Claude Code CLI styles
export class MarkdownRenderer {
  constructor() {
    this.setupStyles()
  }

  setupStyles() {
    // Only add styles if they don't exist
    if (document.querySelector('#claude-markdown-styles')) return

    const style = document.createElement('style')
    style.id = 'claude-markdown-styles'
    style.textContent = `
      .claude-markdown {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.4;
        color: #e6edf3;
        font-size: 13px;
        letter-spacing: 0.01em;
      }

      .claude-markdown h1 {
        font-size: 15px;
        font-weight: 600;
        margin: 12px 0 8px 0;
        color: #f0f6fc;
        border-bottom: 1px solid #21262d;
        padding-bottom: 3px;
      }

      .claude-markdown h2 {
        font-size: 14px;
        font-weight: 600;
        margin: 10px 0 6px 0;
        color: #f0f6fc;
      }

      .claude-markdown h3 {
        font-size: 13px;
        font-weight: 600;
        margin: 8px 0 4px 0;
        color: #f0f6fc;
      }

      .claude-markdown h4, .claude-markdown h5, .claude-markdown h6 {
        font-size: 13px;
        font-weight: 500;
        margin: 6px 0 4px 0;
        color: #e6edf3;
      }

      .claude-markdown p {
        margin: 4px 0 8px 0;
        line-height: 1.4;
      }

      .claude-markdown blockquote {
        border-left: 2px solid #30363d;
        margin: 6px 0;
        padding: 2px 8px;
        color: #7d8590;
        font-style: italic;
        background-color: rgba(13, 17, 23, 0.3);
      }

      .claude-markdown ul, .claude-markdown ol {
        margin: 4px 0 8px 0;
        padding-left: 20px;
      }

      .claude-markdown li {
        margin: 2px 0;
        line-height: 1.3;
      }

      .claude-markdown li > p {
        margin: 2px 0;
      }

      .claude-markdown code {
        background-color: #21262d;
        color: #f85149;
        padding: 1px 4px;
        border-radius: 3px;
        font-family: 'SFMono-Regular', 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
        font-size: 11px;
        border: 1px solid #30363d;
      }

      .claude-markdown pre {
        background-color: #0d1117;
        border: 1px solid #21262d;
        border-radius: 6px;
        padding: 0;
        margin: 6px 0 10px 0;
        overflow: hidden;
        position: relative;
        font-size: 12px;
        line-height: 1.35;
      }

      .claude-markdown pre code {
        background-color: transparent;
        color: #e6edf3;
        padding: 12px;
        border: none;
        font-size: 12px;
        line-height: 1.35;
        display: block;
        overflow-x: auto;
      }

      .claude-markdown .code-block-header {
        background: #161b22;
        border-bottom: 1px solid #21262d;
        padding: 8px 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 11px;
        margin: 0;
        line-height: 1;
      }

      .claude-markdown .code-language {
        color: #7d8590;
        font-weight: 500;
        text-transform: uppercase;
        font-size: 10px;
        letter-spacing: 0.5px;
        margin: 0;
        padding: 0;
        flex: 1;
        text-align: left;
      }

      .claude-markdown .code-copy-btn {
        background: #21262d;
        border: 1px solid #30363d;
        color: #7d8590;
        padding: 4px 8px;
        border-radius: 3px;
        font-size: 11px;
        cursor: pointer;
        opacity: 0.8;
        transition: all 0.15s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
        margin: 0;
        margin-left: auto;
        flex-shrink: 0;
      }

      .claude-markdown .code-copy-btn:hover {
        background: #30363d;
        color: #e6edf3;
        opacity: 1;
      }

      .claude-markdown strong {
        font-weight: 600;
        color: #f0f6fc;
      }

      .claude-markdown em {
        font-style: italic;
        color: #a5a5a5;
      }

      .claude-markdown a {
        color: #58a6ff;
        text-decoration: none;
      }

      .claude-markdown a:hover {
        text-decoration: underline;
      }

      .claude-markdown hr {
        border: none;
        height: 1px;
        background-color: #21262d;
        margin: 12px 0;
      }

      /* Syntax highlighting */
      .claude-markdown .keyword { color: #ff7b72; }
      .claude-markdown .string { color: #a5d6ff; }
      .claude-markdown .comment { color: #8b949e; font-style: italic; }
      .claude-markdown .number { color: #79c0ff; }
      .claude-markdown .operator { color: #ff7b72; }
      .claude-markdown .function { color: #d2a8ff; }
      .claude-markdown .variable { color: #ffa657; }
    `
    document.head.appendChild(style)
  }

  render(markdownText) {
    if (!markdownText) return ''
    
    const html = this.parseMarkdown(markdownText)
    return this.wrapInContainer(html)
  }

  parseMarkdown(text) {
    let html = text

    // Escape HTML first
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

    // Headers (process in reverse order to avoid conflicts)
    html = html.replace(/^######\s+(.*$)/gim, '<h6>$1</h6>')
    html = html.replace(/^#####\s+(.*$)/gim, '<h5>$1</h5>')
    html = html.replace(/^####\s+(.*$)/gim, '<h4>$1</h4>')
    html = html.replace(/^###\s+(.*$)/gim, '<h3>$1</h3>')
    html = html.replace(/^##\s+(.*$)/gim, '<h2>$1</h2>')
    html = html.replace(/^#\s+(.*$)/gim, '<h1>$1</h1>')

    // Horizontal rules
    html = html.replace(/^---+$/gim, '<hr>')
    html = html.replace(/^\*\*\*+$/gim, '<hr>')

    // Code blocks (process before inline code)
    html = html.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, lang, code) => {
      return this.createCodeBlock(code.trim(), lang)
    })

    // Inline code (avoid code already in code blocks)
    html = html.replace(/(?<!<code[^>]*>)`([^`\n]+)`(?![^<]*<\/code>)/g, '<code>$1</code>')

    // Bold and italic (process bold first to avoid conflicts)
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')

    // Blockquotes
    html = html.replace(/^&gt;\s*(.*$)/gim, '<blockquote>$1</blockquote>')
    
    // Merge consecutive blockquotes
    html = html.replace(/(<\/blockquote>\s*<blockquote>)/g, '<br>')

    // Lists
    html = this.processLists(html)

    // Line breaks and paragraphs
    html = html.replace(/\n\n+/g, '</p><p>')
    html = html.replace(/\n/g, '<br>')
    
    // Wrap in paragraph if needed
    if (!html.match(/^<(?:h[1-6]|ul|ol|blockquote|pre|hr)/)) {
      html = '<p>' + html + '</p>'
    }

    // Clean up empty paragraphs
    html = html.replace(/<p>\s*<\/p>/g, '')

    return html
  }

  processLists(html) {
    // Handle unordered lists
    html = html.replace(/^[\*\-\+]\s+(.*$)/gim, '<li>$1</li>')
    
    // Handle ordered lists  
    html = html.replace(/^\d+\.\s+(.*$)/gim, '<li>$1</li>')
    
    // Wrap consecutive list items in ul/ol tags
    html = html.replace(/(<li>.*?<\/li>)(\s*<li>.*?<\/li>)*/gims, (match) => {
      const isOrdered = match.includes('1.') || match.includes('2.') || match.includes('3.')
      const tag = isOrdered ? 'ol' : 'ul'
      return `<${tag}>${match}</${tag}>`
    })

    return html
  }

  createCodeBlock(code, language) {
    const id = 'code-' + Math.random().toString(36).substr(2, 9)
    const highlighted = this.highlightCode(code, language)
    const displayLanguage = language || 'plaintext'
    
    return `<pre class="code-block" data-language="${displayLanguage}">
      <div class="code-block-header">
        <span class="code-language">${displayLanguage}</span>
        <button class="code-copy-btn" onclick="window.copyCode && window.copyCode('${id}')" title="Copy code">📋</button>
      </div>
      <code id="${id}" class="language-${displayLanguage}">${highlighted}</code>
    </pre>`
  }

  highlightCode(code, language) {
    if (!language) return code

    let highlighted = code

    // JavaScript/TypeScript highlighting
    if (['javascript', 'js', 'typescript', 'ts', 'jsx', 'tsx'].includes(language)) {
      highlighted = highlighted.replace(/\b(const|let|var|function|class|interface|type|if|else|for|while|return|import|export|from|async|await|try|catch|finally|throw|new|this|super|extends|implements|public|private|protected|static|readonly)\b/g, '<span class="keyword">$1</span>')
      highlighted = highlighted.replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="string">$1$2$1</span>')
      highlighted = highlighted.replace(/\/\/.*$/gm, '<span class="comment">$&</span>')
      highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>')
      highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>')
    }

    // Python highlighting
    if (['python', 'py'].includes(language)) {
      highlighted = highlighted.replace(/\b(def|class|import|from|if|else|elif|for|while|return|print|len|range|str|int|float|list|dict|set|tuple|and|or|not|in|is|None|True|False|try|except|finally|with|as|lambda|yield|global|nonlocal)\b/g, '<span class="keyword">$1</span>')
      highlighted = highlighted.replace(/(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="string">$1$2$1</span>')
      highlighted = highlighted.replace(/("""[\s\S]*?"""|'''[\s\S]*?''')/g, '<span class="string">$1</span>')
      highlighted = highlighted.replace(/#.*$/gm, '<span class="comment">$&</span>')
      highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>')
    }

    return highlighted
  }

  wrapInContainer(html) {
    return `<div class="claude-markdown">${html}</div>`
  }
}

// Global copy function for code blocks
window.copyCode = function(codeId) {
  const codeElement = document.getElementById(codeId)
  if (!codeElement) return
  
  const text = codeElement.textContent || codeElement.innerText
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      const btn = codeElement.parentElement.querySelector('.code-copy-btn')
      if (btn) {
        const originalText = btn.textContent
        btn.textContent = '✓'
        btn.style.background = '#238636'
        btn.style.color = '#fff'
        
        setTimeout(() => {
          btn.textContent = originalText
          btn.style.background = ''
          btn.style.color = ''
        }, 1500)
      }
    }).catch(err => {
      console.error('Failed to copy: ', err)
    })
  }
}