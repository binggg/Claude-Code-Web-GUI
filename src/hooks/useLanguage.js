import { useState, useEffect } from 'react'
import { LANGUAGES } from '../utils/i18n'

export function useLanguage() {
  const [currentLang, setCurrentLang] = useState('zh')

  useEffect(() => {
    // Detect system language
    const browserLang = navigator.language || navigator.userLanguage
    const isChineseSystem = browserLang.toLowerCase().includes('zh')
    const defaultLang = isChineseSystem ? 'zh' : 'en'
    
    const savedLang = localStorage.getItem('claude-gui-lang') || defaultLang
    setCurrentLang(savedLang)
  }, [])

  const switchLanguage = (lang) => {
    if (lang === currentLang) return
    
    setCurrentLang(lang)
    localStorage.setItem('claude-gui-lang', lang)
  }

  const t = (key, ...params) => {
    const keys = key.split('.')
    let value = LANGUAGES[currentLang]
    
    for (const k of keys) {
      value = value[k]
      if (!value) return key
    }
    
    if (typeof value === 'function') {
      return value(...params)
    }
    
    return value
  }

  return { t, currentLang, switchLanguage }
}