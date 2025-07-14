import React, { useState } from 'react'
import { X } from 'lucide-react'

const ShareModal = ({ isOpen, onClose, sessionData, onCreateGist, onImportGist, t }) => {
  const [gistUrl, setGistUrl] = useState('')
  const [createdGistUrl, setCreatedGistUrl] = useState('')
  const [importing, setImporting] = useState(false)

  const handleCreateGist = async () => {
    try {
      await onCreateGist(sessionData)
      // Don't close modal - user needs to come back to complete flow
    } catch (error) {
      console.error('Failed to create Gist:', error)
      alert(t('shareError') || '分享失败: ' + error.message)
    }
  }

  const handleCopyImportLink = () => {
    if (!createdGistUrl.trim()) return
    
    const importLink = `${window.location.origin}${window.location.pathname}#import=${encodeURIComponent(createdGistUrl)}`
    
    try {
      navigator.clipboard.writeText(importLink)
      alert(t('importLinkCopied') || '导入链接已复制到剪贴板！')
    } catch (err) {
      console.error('Failed to copy import link:', err)
      prompt(t('manualCopyGist') || '请手动复制导入链接:', importLink)
    }
  }

  const handleImportGist = async () => {
    if (!gistUrl.trim()) {
      alert(t('pleaseEnterGistUrlOrId') || '请输入Gist URL或ID')
      return
    }

    setImporting(true)
    try {
      await onImportGist(gistUrl.trim())
      onClose()
    } catch (error) {
      console.error('Failed to import Gist:', error)
      alert(t('gistImportError') || 'Gist导入失败: ' + error.message)
    } finally {
      setImporting(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleImportGist()
    }
  }

  if (!isOpen) return null

  return (
    <div className="share-modal">
      <div className="share-modal-content">
        <div className="share-modal-header">
          <h3>🚀 {t('shareSession') || '分享会话'}</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="share-modal-body">
          <div className="share-option">
            <h4>📝 {t('shareViaGist') || '创建Gist分享会话'}</h4>
            <p style={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '12px' }}>
              {t('gistDescription2') || '通过GitHub Gist分享您的完整会话记录，保持原始JSONL格式，便于他人导入查看。'}
            </p>
            <div 
              className="share-flow-note" 
              style={{ 
                background: '#0f1f13', 
                border: '1px solid #2a7a2a', 
                borderRadius: '4px', 
                padding: '12px', 
                margin: '12px 0' 
              }}
            >
              <strong style={{ color: '#74d474' }}>
                💡 {t('gistFlowTitle') || '分享流程：'}
              </strong>
              <ol style={{ 
                color: '#74d474', 
                fontSize: '11px', 
                margin: '8px 0 0 16px', 
                lineHeight: '1.5' 
              }}>
                <li>{t('gistFlowStep1') || '点击下方按钮，会自动复制会话内容并打开GitHub'}</li>
                <li dangerouslySetInnerHTML={{ 
                  __html: t('gistFlowStep2') || '在GitHub页面创建<strong>公开Gist</strong>（重要：必须公开才能分享）'
                }} />
                <li>{t('gistFlowStep3') || '复制Gist地址，粘贴到本页面生成分享链接'}</li>
                <li>{t('gistFlowStep4') || '分享链接给他人，点击即可直接查看会话内容'}</li>
              </ol>
            </div>
            <button 
              className="action-btn gist-btn" 
              onClick={handleCreateGist}
              style={{ width: '100%', marginBottom: '12px' }}
            >
              🚀 {t('createGist') || '开始创建Gist'}
            </button>
            
            <div style={{ marginTop: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#a1a1aa' }}>
                {t('pasteGistUrl') || '粘贴创建的Gist URL...'}
              </label>
              <input
                type="text"
                className="gist-url-input"
                placeholder={t('pasteGistUrl') || '粘贴创建的Gist URL...'}
                value={createdGistUrl}
                onChange={(e) => setCreatedGistUrl(e.target.value)}
                style={{
                  width: '100%',
                  marginBottom: '8px',
                  background: '#262626',
                  border: '1px solid #3f3f46',
                  color: '#ffffff',
                  padding: '8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontFamily: 'inherit'
                }}
              />
              {createdGistUrl && (
                <button 
                  className="action-btn gist-btn" 
                  onClick={handleCopyImportLink}
                  style={{ width: '100%' }}
                >
                  📋 {t('copyImportLink') || '复制导入链接'}
                </button>
              )}
            </div>
            
            {createdGistUrl && (
              <div style={{ marginTop: '12px' }}>
                <input
                  type="text"
                  className="gist-url-input"
                  value={`${window.location.origin}${window.location.pathname}#import=${encodeURIComponent(createdGistUrl)}`}
                  readOnly
                  style={{
                    width: '100%',
                    marginBottom: '8px',
                    background: '#1a1a1a',
                    border: '1px solid #3f3f46',
                    color: '#ffffff',
                    padding: '8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}
                />
                <button 
                  className="action-btn gist-btn" 
                  onClick={handleCopyImportLink}
                  style={{ width: '100%' }}
                >
                  📋 {t('copyImportLink') || '复制导入链接'}
                </button>
              </div>
            )}
          </div>
          
          <div className="share-option">
            <h4>📥 {t('importFromGist') || '查看他人分享的会话'}</h4>
            <p style={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '12px' }}>
              {t('gistImportDescription2') || '输入他人分享的GitHub Gist地址，即可查看其会话内容。'}
            </p>
            <div className="gist-import-section">
              <input
                type="text"
                className="gist-url-input"
                placeholder={t('gistUrlPlaceholder') || '输入Gist URL...'}
                value={gistUrl}
                onChange={(e) => setGistUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={importing}
                style={{
                  width: '100%',
                  marginBottom: '8px',
                  background: '#262626',
                  border: '1px solid #3f3f46',
                  color: '#ffffff',
                  padding: '8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontFamily: 'inherit'
                }}
              />
              <button 
                className="action-btn gist-btn" 
                onClick={handleImportGist}
                disabled={importing}
                style={{ width: '100%' }}
              >
                {importing ? '🔄 导入中...' : `📖 ${t('importGist') || '查看会话'}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShareModal