import React, { useState } from 'react'
import { X } from 'lucide-react'

const GistImportModal = ({ isOpen, onClose, onImport, t }) => {
  const [gistUrl, setGistUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleImport = async () => {
    if (!gistUrl.trim()) {
      alert(t('pleaseEnterGistUrlOrId') || '请输入Gist URL或ID')
      return
    }

    setLoading(true)
    try {
      await onImport(gistUrl.trim())
      onClose()
    } catch (error) {
      console.error('Import failed:', error)
      alert(`导入失败: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setGistUrl('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="share-modal">
      <div className="share-modal-content">
        <div className="share-modal-header">
          <h3>🌐 {t('viewSharedSessions') || '查看他人分享的会话'}</h3>
          <button className="close-btn" onClick={handleClose}>
            <X size={16} />
          </button>
        </div>
        <div className="share-modal-body">
          <div className="share-option">
            <h4>📖 {t('gistAddressInput') || '输入Gist地址'}</h4>
            <p style={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '12px' }}>
              {t('gistImportDescription2') || '输入他人分享的GitHub Gist地址，即可查看其会话内容。支持完整URL或Gist ID。'}
            </p>
            <div 
              style={{
                background: '#13141a',
                border: '1px solid #3f3f46',
                borderRadius: '4px',
                padding: '10px',
                margin: '12px 0'
              }}
            >
              <small style={{ color: '#60a5fa' }}>
                {t('supportedFormats') || '💡 支持的格式：'}
              </small>
              <ul style={{
                color: '#71717a',
                fontSize: '11px',
                margin: '6px 0 0 16px',
                lineHeight: '1.4'
              }}>
                <li>{t('fullUrlFormat') || '完整URL：https://gist.github.com/username/abc123...'}</li>
                <li>{t('gistIdFormat') || 'Gist ID：abc123def456...'}</li>
              </ul>
            </div>
            <div className="gist-import-section">
              <input
                type="text"
                className="gist-url-input"
                placeholder={t('gistUrlOrIdPlaceholder') || '输入Gist URL或ID...'}
                value={gistUrl}
                onChange={(e) => setGistUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleImport()}
                style={{
                  width: '100%',
                  marginBottom: '12px',
                  background: '#262626',
                  border: '1px solid #3f3f46',
                  color: '#ffffff',
                  padding: '8px 10px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontFamily: 'inherit'
                }}
                disabled={loading}
              />
              <button 
                className="action-btn gist-btn" 
                onClick={handleImport}
                disabled={loading}
                style={{ width: '100%' }}
              >
                {loading ? '🔄 加载中...' : `🚀 ${t('viewSession') || '查看会话'}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GistImportModal