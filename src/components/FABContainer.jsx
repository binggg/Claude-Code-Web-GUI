import React from 'react'

const FABContainer = ({ t, onShareSession }) => {
  const toggleChatInput = () => {
    // 显示通知说明功能暂未开放
    const notification = document.createElement('div')
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #18181b;
      border: 1px solid #27272a;
      color: #a1a1aa;
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 12px;
      z-index: 1001;
      transition: opacity 0.3s ease;
    `
    notification.textContent = t('chatInputDisabledTooltip') || '当前版本不支持直接在页面中与Claude对话'
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.opacity = '0'
      setTimeout(() => notification.remove(), 300)
    }, 3000)
  }

  return (
    <div className="fab-container visible">
      <button 
        className="fab-btn fab-share" 
        onClick={onShareSession}
        title={t('fabShareTooltip') || '分享会话'}
      >
        <span className="fab-icon">🔗</span>
        <span className="fab-text">{t('shareSession') || '分享会话'}</span>
      </button>
      
      <button 
        className="fab-btn fab-continue" 
        onClick={toggleChatInput}
        title={t('chatInputDisabledTooltip') || '继续对话'}
      >
        <span className="fab-icon">💬</span>
        <span className="fab-text">{t('continueConversation') || 'Continue conversation'}</span>
      </button>
    </div>
  )
}

export default FABContainer