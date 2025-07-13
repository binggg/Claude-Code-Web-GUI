import React, { useEffect, useRef } from 'react'
import Message from './Message'

const ChatMessages = ({ session, t, view }) => {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [session])

  if (!session) return null

  const messages = session.messages || session.msgs || []

  const renderSessionInfo = () => {
    if (view !== 'shared') return null

    return (
      <div className="session-info-header" style={{
        background: '#0a0a0a',
        border: '1px solid #262626',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3>📄 {session.title || session.summary || 'Shared Session'}</h3>
        <div className="session-meta" style={{
          fontSize: '12px',
          color: '#a1a1aa',
          marginTop: '8px'
        }}>
          <div>📁 {session.project || session.projectName || 'Unknown Project'}</div>
          <div>🕒 {session.timestamp ? new Date(session.timestamp).toLocaleString() : 'Unknown Time'}</div>
        </div>
        <hr style={{
          margin: '16px 0',
          border: 'none',
          height: '1px',
          background: '#262626'
        }} />
      </div>
    )
  }

  const renderSessionFooter = () => {
    if (view !== 'shared') return null

    return (
      <div className="session-footer" style={{
        background: '#0a0a0a',
        border: '1px solid #262626',
        borderRadius: '8px',
        padding: '16px',
        marginTop: '20px',
        textAlign: 'center'
      }}>
        <hr style={{
          margin: '0 0 16px 0',
          border: 'none',
          height: '1px',
          background: '#262626'
        }} />
        <p style={{
          color: '#71717a',
          fontSize: '12px',
          margin: '0 0 8px 0'
        }}>
          💡 <strong>Tip:</strong> 你也可以使用 Claude Code Web GUI 浏览和分享自己的会话
        </p>
        <a 
          href="/" 
          style={{
            color: '#667eea',
            textDecoration: 'none',
            fontSize: '12px'
          }}
        >
          🚀 Try Claude Code Web GUI
        </a>
      </div>
    )
  }

  return (
    <>
      {renderSessionInfo()}
      
      {messages.map((message, index) => (
        <Message
          key={`${message.type}-${index}`}
          message={message}
          index={index}
          t={t}
          view={view}
        />
      ))}
      
      {renderSessionFooter()}
      
      <div ref={messagesEndRef} />
    </>
  )
}

export default ChatMessages