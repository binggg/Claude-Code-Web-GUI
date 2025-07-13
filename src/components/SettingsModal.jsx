import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const SettingsModal = ({ isOpen, onClose, t }) => {
  const [apiKey, setApiKey] = useState('')

  useEffect(() => {
    if (isOpen) {
      const existingKey = localStorage.getItem('github-api-key') || ''
      setApiKey(existingKey)
    }
  }, [isOpen])

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('github-api-key', apiKey.trim())
      alert(t('apiKeySaved') || 'API密钥保存成功')
    } else {
      alert('请输入有效的API密钥')
    }
  }

  const removeApiKey = () => {
    localStorage.removeItem('github-api-key')
    setApiKey('')
    alert(t('apiKeyRemoved') || 'API密钥移除成功')
  }

  if (!isOpen) return null

  return (
    <div className="share-modal">
      <div className="share-modal-content">
        <div className="share-modal-header">
          <h3>⚙️ {t('apiKeySettings') || 'API密钥设置'}</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="share-modal-body">
          <div className="share-option">
            <h4>🔑 {t('githubApiKey') || 'GitHub API密钥'}</h4>
            <p style={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '12px' }}>
              {t('apiKeyDescription') || '可选：添加您的GitHub API密钥以避免频率限制'}
            </p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={t('apiKeyPlaceholder') || '输入GitHub API密钥（可选）...'}
              style={{
                width: '100%',
                background: '#262626',
                border: '1px solid #3f3f46',
                color: '#ffffff',
                padding: '8px',
                borderRadius: '4px',
                fontFamily: 'inherit',
                fontSize: '12px',
                marginBottom: '12px'
              }}
            />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <button 
                className="action-btn" 
                onClick={saveApiKey}
                style={{ flex: 1 }}
              >
                💾 {t('saveApiKey') || '保存API密钥'}
              </button>
              <button 
                className="action-btn" 
                onClick={removeApiKey}
                style={{ 
                  flex: 1, 
                  background: '#dc2626', 
                  borderColor: '#dc2626' 
                }}
              >
                🗑️ {t('removeApiKey') || '移除API密钥'}
              </button>
            </div>
            <p style={{ color: '#6b7280', fontSize: '11px' }}>
              <a 
                href="https://github.com/settings/tokens" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#667eea' }}
              >
                {t('apiKeyHelp') || '从 GitHub设置 > Developer settings > Personal access tokens 获取API密钥'}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal