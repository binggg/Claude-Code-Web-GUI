import React, { useState } from 'react'
import { Github, Settings } from 'lucide-react'
import SettingsModal from './SettingsModal'

const Header = ({ 
  t, 
  onRequestDirectoryAccess, 
  onOpenGistImport, 
  loading, 
  error 
}) => {
  const [showSettings, setShowSettings] = useState(false)

  const openSettingsModal = () => {
    setShowSettings(true)
  }

  const closeSettingsModal = () => {
    setShowSettings(false)
  }

  return (
    <div className="header">
      <div className="header-title">
        <img src="/icons/logo.svg" className="logo-svg" alt="Claude Code Web GUI" />
        <h1>{t('title')}</h1>
      </div>
      <p>{t('subtitle')}</p>
      
      <div className="header-links">
        <button className="settings-btn" onClick={openSettingsModal} title={t('apiKeySettings')}>
          <Settings size={16} />
        </button>
        <a 
          href="https://github.com/binggg/Claude-Code-Web-GUI" 
          target="_blank" 
          rel="noopener noreferrer"
          className="github-link"
        >
          <Github size={14} />
          {t('github')}
        </a>
      </div>
      
      <div className="privacy-notice">
        <div className="notice-icon">🔒</div>
        <div className="notice-text">
          <strong>{t('privacy.title')}</strong>：{t('privacy.text')}
        </div>
      </div>
      
      <div className="instructions">
        <h3>{t('features.title')}</h3>
        <ol>
          {t('features.list').map((feature, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: feature }} />
          ))}
        </ol>
        
        <h4 style={{ marginTop: '20px', marginBottom: '10px', color: '#e5e5e5' }}>
          {t('instructions.title')}
        </h4>
        <ol>
          {t('instructions.steps').map((step, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: step }} />
          ))}
        </ol>
        <p><strong>{t('instructions.locations')}</strong></p>
      </div>
      
      <div className="homepage-actions">
        <button 
          className="access-btn primary" 
          onClick={onRequestDirectoryAccess}
          disabled={loading}
        >
          {t('selectBtn')}
        </button>
        
        <button 
          className="access-btn secondary" 
          onClick={onOpenGistImport}
          disabled={loading}
        >
          {t('gistImportBtn')}
        </button>
      </div>

      {error && (
        <div className="error" style={{ marginTop: '20px' }}>
          {error}
        </div>
      )}

      <SettingsModal 
        isOpen={showSettings}
        onClose={closeSettingsModal}
        t={t}
      />
    </div>
  )
}

export default Header