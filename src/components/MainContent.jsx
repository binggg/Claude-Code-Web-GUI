import React from 'react'
import { Menu, ArrowLeft, ExternalLink } from 'lucide-react'
import ChatMessages from './ChatMessages'

const MainContent = ({ 
  t, 
  currentSession, 
  loading, 
  error, 
  onToggleSidebar, 
  onReturnToHomepage,
  view 
}) => {
  const getMainTitle = () => {
    if (view === 'shared' && currentSession) {
      return `📤 ${currentSession.title || currentSession.summary}`
    }
    if (currentSession) {
      return currentSession.summary
    }
    return t('selectSession')
  }

  const showSessionActions = currentSession && view === 'sessions'
  const showSharedActions = view === 'shared'

  const shareToX = () => {
    const currentUrl = window.location.href
    const sessionTitle = currentSession?.title || currentSession?.summary || t('claudeCodeSession')
    const text = t('viewThisSession')
    const hashtags = 'ClaudeCode'
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}&hashtags=${hashtags}`
    window.open(twitterUrl, '_blank')
  }

  return (
    <div className="main-content">
      <div className="main-header">
        <button className="menu-toggle" onClick={onToggleSidebar}>
          <Menu size={16} />
        </button>
        
        <div className="main-title" onClick={onReturnToHomepage}>
          {getMainTitle()}
        </div>
        
        {showSessionActions && (
          <div className="session-actions">
            <button className="action-btn" onClick={onReturnToHomepage}>
              <ArrowLeft size={14} />
              <span>{t('back')}</span>
            </button>
          </div>
        )}

        {showSharedActions && (
          <div className="session-actions">
            <button className="action-btn" onClick={onReturnToHomepage}>
              <ArrowLeft size={14} />
              <span>{t('back')}</span>
            </button>
            <button className="action-btn twitter-share" onClick={shareToX}>
              <span>𝕏</span>
              <span>{t('shareToX')}</span>
            </button>
          </div>
        )}

        {view === 'shared' && (
          <div className="shared-indicator">
            <span>🔗</span>
            <span>{t('sharedSession')}</span>
          </div>
        )}
      </div>
      
      <div className="chat-messages">
        {error && (
          <div className="error">
            {error}
          </div>
        )}
        
        {loading && !currentSession && (
          <div className="loading">
            <p>{t('loading')}</p>
          </div>
        )}
        
        {!loading && !currentSession && !error && (
          <div className="empty-state">
            <h3>{t('welcome')}</h3>
            <p>{t('welcomeText')}</p>
          </div>
        )}
        
        {currentSession && (
          <ChatMessages 
            session={currentSession}
            t={t}
            view={view}
          />
        )}
      </div>
    </div>
  )
}

export default MainContent