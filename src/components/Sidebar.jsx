import React, { useState } from 'react'
import { Github, X, ChevronDown, ChevronRight, Search } from 'lucide-react'
import SessionGroup from './SessionGroup'

const Sidebar = ({ 
  t, 
  collapsed, 
  projects, 
  allSessions, 
  filteredSessions, 
  currentSession,
  onFilterSessions, 
  onShowSession, 
  onToggleSidebar, 
  onReturnToHomepage,
  view 
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [collapsedGroups, setCollapsedGroups] = useState(new Set())

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onFilterSessions(value.trim())
  }

  const toggleGroup = (projectName) => {
    setCollapsedGroups(prev => {
      const newSet = new Set(prev)
      if (newSet.has(projectName)) {
        newSet.delete(projectName)
      } else {
        newSet.add(projectName)
      }
      return newSet
    })
  }

  const getProjectDisplayName = (path) => {
    const parts = path.split('/')
    return parts[parts.length - 1] || path
  }

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return t('timeAgo.unknown') || 'Unknown time'
    
    const now = new Date()
    const date = new Date(timestamp)
    const diffMs = now - date
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    
    if (diffDays > 7) {
      return date.toLocaleDateString()
    } else if (diffDays > 0) {
      return t('timeAgo.daysAgo', diffDays)
    } else if (diffHours > 0) {
      return t('timeAgo.hoursAgo', diffHours)
    } else if (diffMinutes > 0) {
      return t('timeAgo.minutesAgo', diffMinutes)
    } else {
      return t('timeAgo.justNow')
    }
  }

  // Group sessions by project
  const sessionsToShow = filteredSessions.length > 0 ? filteredSessions : allSessions
  const sessionsByProject = {}
  
  sessionsToShow.forEach(session => {
    const projectName = getProjectDisplayName(session.projectName?.replace(/-/g, '/') || 'Unknown')
    if (!sessionsByProject[projectName]) {
      sessionsByProject[projectName] = []
    }
    sessionsByProject[projectName].push(session)
  })

  const totalProjects = new Set(allSessions.map(s => s.projectName)).size

  if (view === 'shared') {
    return null // Hide sidebar for shared sessions
  }

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand" onClick={onReturnToHomepage}>
          <img src="icons/logo.svg" className="sidebar-brand-logo" alt="Logo" />
          <div className="sidebar-brand-text">{t('title')}</div>
        </div>
        <div className="sidebar-controls">
          <button 
            className="sidebar-github"
            onClick={() => window.open('https://github.com/binggg/Claude-Code-Web-GUI', '_blank')}
          >
            <Github size={16} />
          </button>
          <button className="sidebar-toggle" onClick={onToggleSidebar}>
            <X size={14} />
          </button>
        </div>
      </div>
      
      <div className="sidebar-content">
        <div className="session-search">
          <input
            type="text"
            className="search-input"
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="session-stats">
          {t('sessionsCount', allSessions.length, totalProjects)}
        </div>

        {Object.entries(sessionsByProject).map(([projectName, sessions]) => (
          <SessionGroup
            key={projectName}
            projectName={projectName}
            sessions={sessions}
            collapsed={collapsedGroups.has(projectName)}
            currentSessionId={currentSession?.id}
            onToggle={() => toggleGroup(projectName)}
            onSessionClick={onShowSession}
            getTimeAgo={getTimeAgo}
            t={t}
          />
        ))}
      </div>
    </div>
  )
}

export default Sidebar