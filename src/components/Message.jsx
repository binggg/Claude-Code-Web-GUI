import React from 'react'
import ToolCall from './ToolCall'
import MarkdownContent from './MarkdownContent'

const Message = ({ message, index, t, view }) => {
  const isUser = message.type === 'user'
  
  // Handle both standard and optimized message formats
  const msgData = message.message || message.msg
  
  const renderUserContent = (content) => {
    if (typeof content === 'string') {
      return <div className="user-text">{content}</div>
    }
    
    if (Array.isArray(content)) {
      return content.map((part, idx) => {
        if (part.type === 'text') {
          return <div key={idx} className="user-text">{part.text}</div>
        } else if (part.type === 'image') {
          return (
            <div key={idx} className="user-image">
              {part.summary || '[Image]'}
            </div>
          )
        }
        return null
      })
    }
    
    return <div className="user-text">[No content]</div>
  }

  const renderAssistantContent = (content) => {
    if (!content) {
      return <div className="assistant-text">[No content]</div>
    }

    return content.map((part, idx) => {
      if (part.type === 'text') {
        return (
          <MarkdownContent 
            key={idx}
            text={part.text}
            className="assistant-text claude-formatted"
          />
        )
      } else if (part.type === 'tool_use') {
        return (
          <ToolCall
            key={idx}
            toolUse={part}
            t={t}
          />
        )
      }
      return null
    })
  }

  return (
    <div className={`message ${message.type}`} data-message-index={index}>
      <div className="message-avatar">
        {isUser ? (
          'U'
        ) : (
          <img 
            src="/icons/claude-avatar.svg" 
            className="claude-avatar-svg" 
            alt="Claude" 
          />
        )}
      </div>
      
      <div className="message-content">
        {isUser ? (
          renderUserContent(msgData?.content)
        ) : (
          renderAssistantContent(msgData?.content)
        )}
        
        {message.timestamp && (
          <div className="message-timestamp" style={{
            fontSize: '10px',
            color: '#71717a',
            marginTop: '6px'
          }}>
            {new Date(message.timestamp).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  )
}

export default Message