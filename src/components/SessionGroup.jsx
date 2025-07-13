import React from 'react'
import { ChevronDown, ChevronRight, Folder, MessageCircle, Zap } from 'lucide-react'

const SessionGroup = ({ 
  projectName, 
  sessions, 
  collapsed, 
  currentSessionId,
  onToggle, 
  onSessionClick, 
  getTimeAgo,
  t 
}) => {
  const openInVSCode = (e, projectName) => {
    e.stopPropagation()
    // VSCode integration would go here
    console.log('Open in VSCode:', projectName)
  }

  return (
    <div className={`session-group ${collapsed ? 'collapsed' : ''}`}>
      <div className="session-group-header" onClick={onToggle}>
        <div className="session-group-title">
          <Folder size={12} />
          <span>{projectName}</span>
          <span className="session-group-count">{sessions.length}</span>
        </div>
        <div className="session-group-actions">
          <button 
            className="project-vscode-btn" 
            onClick={(e) => openInVSCode(e, projectName)}
            title={t('openInVSCode') || '在VSCode中打开'}
          >
            <Zap size={12} />
          </button>
          <div className="session-group-toggle">
            {collapsed ? <ChevronRight size={10} /> : <ChevronDown size={10} />}
          </div>
        </div>
      </div>
      
      {!collapsed && (
        <div className="session-list">
          {sessions.map(session => (
            <button
              key={session.id}
              className={`session-item-sidebar ${
                currentSessionId === session.id ? 'active' : ''
              }`}
              onClick={() => onSessionClick(session)}
            >
              <div className="session-icon">
                <MessageCircle size={12} />
              </div>
              <div className="session-content">
                <div className="session-title">{session.summary}</div>
                <div className="session-meta">
                  <span className="session-time">{getTimeAgo(session.timestamp)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SessionGroup