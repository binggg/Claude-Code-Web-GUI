import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Copy, Check, X } from 'lucide-react'

const ToolCall = ({ toolUse, t }) => {
  const [collapsed, setCollapsed] = useState(true)
  const [copyFeedback, setCopyFeedback] = useState(null)

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  const copyToolParameters = async () => {
    const jsonString = JSON.stringify(toolUse.input, null, 2)
    
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(jsonString)
        showCopyFeedback('success')
      } else {
        fallbackCopyToClipboard(jsonString)
        showCopyFeedback('success')
      }
    } catch (err) {
      console.error('Failed to copy:', err)
      showCopyFeedback('error')
    }
  }

  const fallbackCopyToClipboard = (text) => {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    textArea.style.opacity = '0'
    textArea.style.pointerEvents = 'none'
    
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    try {
      const successful = document.execCommand('copy')
      if (!successful) {
        throw new Error('execCommand failed')
      }
    } finally {
      document.body.removeChild(textArea)
    }
  }

  const showCopyFeedback = (type) => {
    setCopyFeedback(type)
    setTimeout(() => {
      setCopyFeedback(null)
    }, 1500)
  }

  const highlightJSON = (jsonStr) => {
    // JSON syntax highlighting
    const escaped = jsonStr
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
    
    return escaped
      .replace(/(&quot;.*?&quot;)\s*:/g, '<span style="color: #79c0ff;">$1</span>:')
      .replace(/:\s*(&quot;.*?&quot;)/g, ': <span style="color: #a5d6ff;">$1</span>')
      .replace(/:\s*(true|false)\b/g, ': <span style="color: #ff7b72;">$1</span>')
      .replace(/:\s*(null)\b/g, ': <span style="color: #8b949e;">$1</span>')
      .replace(/:\s*(\d+\.?\d*)/g, ': <span style="color: #79c0ff;">$1</span>')
  }

  const formatToolInput = (input) => {
    const jsonStr = JSON.stringify(input, null, 2)
    return highlightJSON(jsonStr)
  }

  return (
    <div className="tool-call">
      <div className="tool-call-header" onClick={toggleCollapsed}>
        <div className="tool-call-icon">🔧</div>
        <span className="tool-name">{toolUse.name}</span>
        <div className="tool-toggle">
          {collapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
        </div>
      </div>
      
      <div className={`tool-call-content ${collapsed ? 'collapsed' : ''}`}>
        {toolUse.input && Object.keys(toolUse.input).length > 0 && (
          <div className="tool-call-input">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <strong style={{ color: '#e4e4e7', fontSize: '11px' }}>
                Parameters:
              </strong>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  copyToolParameters()
                }}
                style={{
                  background: copyFeedback === 'success' ? '#238636' : 
                             copyFeedback === 'error' ? '#da3633' : '#262626',
                  border: '1px solid #404040',
                  color: copyFeedback ? '#ffffff' : '#a1a1aa',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  fontSize: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
                title="Copy parameters"
              >
                {copyFeedback === 'success' ? (
                  <Check size={10} />
                ) : copyFeedback === 'error' ? (
                  <X size={10} />
                ) : (
                  <Copy size={10} />
                )}
              </button>
            </div>
            <pre style={{
              margin: '8px 0 0 0',
              overflow: 'auto',
              fontSize: '11px',
              lineHeight: '1.4'
            }}>
              <code dangerouslySetInnerHTML={{
                __html: formatToolInput(toolUse.input)
              }} />
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default ToolCall