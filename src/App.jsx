import React, { useState, useEffect, useCallback } from 'react'
import { Settings, Github, Menu, X } from 'lucide-react'

// Import components
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import LanguageToggle from './components/LanguageToggle'
import FABContainer from './components/FABContainer'
import GistImportModal from './components/GistImportModal'
import ShareModal from './components/ShareModal'

// Import utilities
import { ClaudeCodeManager } from './utils/claudeCodeManager'
import { useLanguage } from './hooks/useLanguage'

function App() {
  const [appState, setAppState] = useState({
    view: 'homepage', // 'homepage', 'sessions', 'shared'
    directoryHandle: null,
    projects: [],
    allSessions: [],
    filteredSessions: [],
    currentSession: null,
    sidebarCollapsed: false,
    loading: false,
    error: null
  })

  const [showGistImport, setShowGistImport] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  const { t, currentLang, switchLanguage } = useLanguage()
  const [claudeManager] = useState(() => new ClaudeCodeManager())

  // Check for shared session on app load
  useEffect(() => {
    claudeManager.checkForSharedSession(setAppState)
  }, [claudeManager])

  const requestDirectoryAccess = useCallback(async () => {
    try {
      if (!('showDirectoryPicker' in window)) {
        setAppState(prev => ({ 
          ...prev, 
          error: t('errors.unsupported') 
        }))
        return
      }

      const instructions = t('confirmDialog.instructions').join('\n')
      const shouldContinue = confirm(
        `${t('confirmDialog.title')}

${instructions}

${t('confirmDialog.continue')}`
      )

      if (!shouldContinue) return

      setAppState(prev => ({ ...prev, loading: true, error: null }))

      const directoryHandle = await window.showDirectoryPicker({
        mode: 'read'
      })

      if (!directoryHandle.name.includes('claude')) {
        const proceed = confirm(t('wrongDirectory', directoryHandle.name))
        if (!proceed) {
          setAppState(prev => ({ ...prev, loading: false }))
          return
        }
      }

      const { projects, allSessions } = await claudeManager.loadProjects(directoryHandle)

      setAppState(prev => ({
        ...prev,
        view: 'sessions',
        directoryHandle,
        projects,
        allSessions,
        loading: false,
        error: null
      }))

    } catch (error) {
      if (error.name === 'AbortError') {
        setAppState(prev => ({ ...prev, loading: false }))
        return
      }
      
      let errorMessage = `${t('errors.accessFailed')}: ${error.message}`
      if (error.name === 'NotFoundError') {
        errorMessage = t('errors.noProjects')
      }
      
      setAppState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }))
    }
  }, [claudeManager, t])

  const openGistImportDialog = useCallback(() => {
    setShowGistImport(true)
  }, [])

  const closeGistImportDialog = useCallback(() => {
    setShowGistImport(false)
  }, [])

  const handleGistImport = useCallback(async (gistUrl) => {
    await claudeManager.autoImportGist(gistUrl, setAppState)
    setShowGistImport(false)
  }, [claudeManager])

  const returnToHomepage = useCallback(() => {
    setAppState(prev => ({
      ...prev,
      view: 'homepage',
      directoryHandle: null,
      projects: [],
      allSessions: [],
      filteredSessions: [],
      currentSession: null,
      error: null
    }))
  }, [])

  const toggleSidebar = useCallback(() => {
    setAppState(prev => ({ 
      ...prev, 
      sidebarCollapsed: !prev.sidebarCollapsed 
    }))
  }, [])

  const filterSessions = useCallback((searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      setAppState(prev => ({ ...prev, filteredSessions: [] }))
      return
    }

    const filtered = appState.allSessions
      .filter(session => {
        const summaryMatch = session.summary?.toLowerCase().includes(searchTerm.toLowerCase())
        const projectMatch = session.projectName?.toLowerCase().includes(searchTerm.toLowerCase())
        return summaryMatch || projectMatch
      })
      .slice(0, 50) // Limit results for performance

    setAppState(prev => ({ ...prev, filteredSessions: filtered }))
  }, [appState.allSessions])

  const showSession = useCallback(async (session) => {
    try {
      setAppState(prev => ({ ...prev, loading: true, currentSession: session }))
      const messages = await claudeManager.loadSessionMessages(session)
      setAppState(prev => ({ 
        ...prev, 
        loading: false,
        currentSession: { ...session, messages }
      }))
    } catch (error) {
      setAppState(prev => ({ 
        ...prev, 
        loading: false, 
        error: `${t('errors.sessionLoadFailed')}: ${error.message}` 
      }))
    }
  }, [claudeManager, t])

  const shareSession = useCallback(() => {
    if (!appState.currentSession) return
    setShowShareModal(true)
  }, [appState.currentSession])

  const handleCreateGist = useCallback(async (sessionData) => {
    await claudeManager.gistManager.shareToGist(sessionData, t)
  }, [claudeManager, t])

  const handleImportFromShare = useCallback(async (gistUrl) => {
    await claudeManager.autoImportGist(gistUrl, setAppState)
  }, [claudeManager])

  return (
    <div className="container">
      <LanguageToggle 
        currentLang={currentLang}
        onLanguageChange={switchLanguage}
      />

      {appState.view === 'homepage' && (
        <Header
          t={t}
          onRequestDirectoryAccess={requestDirectoryAccess}
          onOpenGistImport={openGistImportDialog}
          loading={appState.loading}
          error={appState.error}
        />
      )}

      {(appState.view === 'sessions' || appState.view === 'shared') && (
        <div className="main-layout">
          <Sidebar
            t={t}
            collapsed={appState.sidebarCollapsed}
            projects={appState.projects}
            allSessions={appState.allSessions}
            filteredSessions={appState.filteredSessions}
            currentSession={appState.currentSession}
            onFilterSessions={filterSessions}
            onShowSession={showSession}
            onToggleSidebar={toggleSidebar}
            onReturnToHomepage={returnToHomepage}
            view={appState.view}
          />
          
          <MainContent
            t={t}
            currentSession={appState.currentSession}
            loading={appState.loading}
            error={appState.error}
            onToggleSidebar={toggleSidebar}
            onReturnToHomepage={returnToHomepage}
            view={appState.view}
          />
        </div>
      )}

      {appState.currentSession && appState.view === 'sessions' && (
        <FABContainer
          t={t}
          onShareSession={shareSession}
        />
      )}

      {appState.loading && (
        <div className="loading">
          <p>{t('loading')}</p>
        </div>
      )}

      <GistImportModal
        isOpen={showGistImport}
        onClose={closeGistImportDialog}
        onImport={handleGistImport}
        t={t}
      />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        sessionData={appState.currentSession}
        onCreateGist={handleCreateGist}
        onImportGist={handleImportFromShare}
        t={t}
      />
    </div>
  )
}

export default App