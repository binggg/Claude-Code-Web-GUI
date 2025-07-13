import React from 'react'

const LanguageToggle = ({ currentLang, onLanguageChange }) => {
  return (
    <div className="language-toggle">
      <button 
        className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`}
        onClick={() => onLanguageChange('en')}
      >
        EN
      </button>
      <button 
        className={`lang-btn ${currentLang === 'zh' ? 'active' : ''}`}
        onClick={() => onLanguageChange('zh')}
      >
        中
      </button>
    </div>
  )
}

export default LanguageToggle