// Vue 3 应用主文件
const { createApp, ref, reactive, computed, onMounted, nextTick } = Vue

// 导入模块 (临时简化版本用于测试)
// import { GistManager } from '../modules/gist-manager.js'

// 临时的GistManager类用于测试
class GistManager {
  extractGistId(url) {
    const patterns = [
      /gist\.github\.com\/[^\/]+\/([a-f0-9]+)/,
      /gist\.github\.com\/([a-f0-9]+)/,
      /^([a-f0-9]+)$/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        return match[1]
      }
    }
    return null
  }
  
  async fetchGist(gistId) {
    // 模拟加载
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 模拟成功返回
    return {
      id: gistId,
      title: `测试 Gist ${gistId}`,
      content: '{"role": "user", "content": "Hello World"}',
      url: `https://gist.github.com/${gistId}`,
      created: new Date().toISOString(),
      isJSONL: true
    }
  }
}

// 导入组件
import AppHeader from './components/AppHeader.js'
import LoadingModal from './components/LoadingModal.js'
import ErrorModal from './components/ErrorModal.js'
import { 
  AppSidebar, 
  MainContent, 
  GistImportModal, 
  SettingsModal, 
  ShareModal, 
  SharedSession, 
  FabButtons, 
  LanguageToggle 
} from './components/PlaceholderComponents.js'

// 主应用
const app = createApp({
  components: {
    AppHeader,
    AppSidebar,
    MainContent,
    LoadingModal,
    ErrorModal,
    GistImportModal,
    SettingsModal,
    ShareModal,
    SharedSession,
    FabButtons,
    LanguageToggle
  },
  
  setup() {
    // ===== 状态管理 =====
    const state = reactive({
      // 核心状态
      directoryHandle: null,
      currentSession: null,
      sessions: [],
      projects: [],
      sharedSession: null,
      
      // UI 状态
      currentLang: 'zh',
      loading: false,
      initialLoading: false,
      error: null,
      modalError: null,
      loadingMessage: '',
      
      // 搜索和过滤
      searchQuery: '',
      filteredSessions: [],
      
      // 模态框状态
      showGistImport: false,
      showSettings: false,
      showShareModal: false,
      
      // 重试相关
      lastGistUrl: null,
      lastAction: null
    })
    
    // ===== 服务实例 =====
    const gistManager = new GistManager()
    
    // ===== 计算属性 =====
    const sessionStats = computed(() => {
      const totalSessions = state.sessions.length
      const totalProjects = state.projects.length
      return `${totalSessions} 个会话 · ${totalProjects} 个项目`
    })
    
    // ===== 方法 =====
    
    // 初始化
    const init = async () => {
      // 检测系统语言
      const browserLang = navigator.language || navigator.userLanguage
      const isChineseSystem = browserLang.toLowerCase().includes('zh')
      const savedLang = localStorage.getItem('claude-gui-lang') || (isChineseSystem ? 'zh' : 'en')
      state.currentLang = savedLang
      
      // 检查分享的会话
      await checkForSharedSession()
      
      // 检查浏览器支持
      if (!('showDirectoryPicker' in window)) {
        state.error = t('errors.unsupported')
      }
    }
    
    // 检查分享的会话
    const checkForSharedSession = async () => {
      const hash = window.location.hash
      
      // 检查 #session= 参数
      if (hash.startsWith('#session=')) {
        const sessionParam = hash.substring(9)
        try {
          const sessionData = JSON.parse(base64ToUnicode(sessionParam))
          state.sharedSession = sessionData
          return
        } catch (error) {
          console.error('Failed to load shared session from hash:', error)
          state.error = `Failed to load shared session: ${error.message}`
        }
      }
      
      // 检查 #import= 参数 (Gist 自动导入)
      if (hash.startsWith('#import=')) {
        const gistUrl = decodeURIComponent(hash.substring(8))
        await autoImportGist(gistUrl)
        return
      }
    }
    
    // 自动导入Gist
    const autoImportGist = async (gistUrl) => {
      state.loading = true
      state.loadingMessage = t('loadingSharedSession')
      state.modalError = null
      state.lastGistUrl = gistUrl
      state.lastAction = 'autoImportGist'
      
      try {
        const gistData = await gistManager.fetchGist(gistManager.extractGistId(gistUrl))
        state.sharedSession = gistData
      } catch (error) {
        console.error('Auto-import failed:', error)
        state.modalError = error
      } finally {
        state.loading = false
      }
    }
    
    // 语言切换
    const switchLanguage = (lang) => {
      if (lang === state.currentLang) return
      
      state.currentLang = lang
      localStorage.setItem('claude-gui-lang', lang)
      // i18n.setLanguage(lang) // 暂时禁用
    }
    
    // 请求目录访问
    const requestDirectoryAccess = async () => {
      try {
        if (!('showDirectoryPicker' in window)) {
          state.error = '您的浏览器不支持文件系统访问 API'
          return
        }
        
        state.directoryHandle = await window.showDirectoryPicker()
        state.initialLoading = true
        
        // 模拟加载项目
        setTimeout(() => {
          state.initialLoading = false
          state.sessions = [
            { id: '1', summary: '测试会话1', project: '项目A' },
            { id: '2', summary: '测试会话2', project: '项目B' }
          ]
          state.filteredSessions = state.sessions
        }, 1000)
      } catch (error) {
        if (error.name !== 'AbortError') {
          state.error = '访问目录失败'
          console.error('Directory access failed:', error)
        }
      }
    }
    
    // 搜索处理
    const handleSearch = (query) => {
      state.searchQuery = query
      if (!query.trim()) {
        state.filteredSessions = state.sessions
      } else {
        state.filteredSessions = state.sessions.filter(session =>
          session.summary.toLowerCase().includes(query.toLowerCase()) ||
          session.project.toLowerCase().includes(query.toLowerCase())
        )
      }
    }
    
    // 选择会话
    const selectSession = async (session) => {
      try {
        // 模拟加载会话内容
        state.currentSession = { ...session, content: '模拟会话内容' }
      } catch (error) {
        state.error = '加载会话失败'
        console.error('Session load failed:', error)
      }
    }
    
    // 分享会话
    const shareSession = () => {
      if (state.currentSession) {
        state.showShareModal = true
      }
    }
    
    // 导出会话
    const exportSession = async () => {
      if (state.currentSession) {
        console.log('导出会话:', state.currentSession)
      }
    }
    
    // Gist导入
    const handleGistImport = async (gistUrl) => {
      state.showGistImport = false
      await autoImportGist(gistUrl)
    }
    
    // 模态框控制
    const openGistImportDialog = () => { state.showGistImport = true }
    const closeGistImportDialog = () => { state.showGistImport = false }
    const openSettingsModal = () => { state.showSettings = true }
    const closeSettingsModal = () => { state.showSettings = false }
    const openShareModal = () => { state.showShareModal = true }
    const closeShareModal = () => { state.showShareModal = false }
    
    // 错误处理
    const clearModalError = () => { state.modalError = null }
    const retryLastAction = () => {
      if (state.lastAction === 'autoImportGist' && state.lastGistUrl) {
        autoImportGist(state.lastGistUrl)
      }
    }
    
    // 导航
    const returnToHomepage = () => {
      state.currentSession = null
      window.location.hash = ''
    }
    
    const backToHome = () => {
      state.sharedSession = null
      window.location.hash = ''
    }
    
    // 侧边栏切换
    const toggleSidebar = () => {
      // 实现侧边栏切换逻辑
    }
    
    const toggleChatInput = () => {
      // 实现聊天输入切换逻辑
    }
    
    // 工具函数
    const base64ToUnicode = (str) => {
      return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    }
    
    // 简化的翻译函数
    const t = (key) => {
      const translations = {
        zh: {
          loadingSharedSession: '正在加载分享的会话...',
          loading: '正在加载...'
        },
        en: {
          loadingSharedSession: 'Loading Shared Session...',
          loading: 'Loading...'
        }
      }
      return translations[state.currentLang]?.[key] || key
    }
    
    // ===== 生命周期 =====
    onMounted(() => {
      init()
    })
    
    // ===== 返回状态和方法 =====
    return {
      // 状态
      ...state,
      sessionStats,
      
      // 方法
      switchLanguage,
      requestDirectoryAccess,
      handleSearch,
      selectSession,
      shareSession,
      exportSession,
      handleGistImport,
      openGistImportDialog,
      closeGistImportDialog,
      openSettingsModal,
      closeSettingsModal,
      openShareModal,
      closeShareModal,
      clearModalError,
      retryLastAction,
      returnToHomepage,
      backToHome,
      toggleSidebar,
      toggleChatInput,
      
      // 工具
      t
    }
  }
})

// 挂载应用
app.mount('#app')