// 简化的组件占位符 - 用于快速测试Vue架构

export const AppSidebar = {
  name: 'AppSidebar',
  template: '<div class="sidebar">Sidebar Placeholder</div>'
}

export const MainContent = {
  name: 'MainContent', 
  template: '<div class="main-content">Main Content Placeholder</div>'
}

export const GistImportModal = {
  name: 'GistImportModal',
  emits: ['close', 'import'],
  template: `
    <div class="share-modal">
      <div class="share-modal-content">
        <div class="share-modal-header">
          <h3>🌐 导入Gist会话</h3>
          <button class="close-btn" @click="$emit('close')">✕</button>
        </div>
        <div class="share-modal-body">
          <input 
            v-model="gistUrl" 
            placeholder="输入Gist URL..."
            style="width: 100%; margin-bottom: 10px; padding: 8px;"
          >
          <button class="action-btn" @click="handleImport">导入</button>
        </div>
      </div>
    </div>
  `,
  data() {
    return { gistUrl: '' }
  },
  methods: {
    handleImport() {
      if (this.gistUrl.trim()) {
        this.$emit('import', this.gistUrl.trim())
      }
    }
  }
}

export const SettingsModal = {
  name: 'SettingsModal',
  emits: ['close'],
  template: `
    <div class="share-modal">
      <div class="share-modal-content">
        <div class="share-modal-header">
          <h3>⚙️ 设置</h3>
          <button class="close-btn" @click="$emit('close')">✕</button>
        </div>
        <div class="share-modal-body">
          <p>设置功能占位符</p>
        </div>
      </div>
    </div>
  `
}

export const ShareModal = {
  name: 'ShareModal',
  emits: ['close'],
  template: `
    <div class="share-modal">
      <div class="share-modal-content">
        <div class="share-modal-header">
          <h3>🔗 分享会话</h3>
          <button class="close-btn" @click="$emit('close')">✕</button>
        </div>
        <div class="share-modal-body">
          <p>分享功能占位符</p>
        </div>
      </div>
    </div>
  `
}

export const SharedSession = {
  name: 'SharedSession',
  template: '<div class="shared-session">分享会话显示占位符</div>'
}

export const FabButtons = {
  name: 'FabButtons', 
  template: '<div class="fab-container">FAB按钮占位符</div>'
}

export const LanguageToggle = {
  name: 'LanguageToggle',
  props: ['currentLang'],
  emits: ['switch'],
  template: `
    <div class="language-toggle">
      <button 
        class="lang-btn" 
        :class="{ active: currentLang === 'en' }"
        @click="$emit('switch', 'en')"
      >EN</button>
      <button 
        class="lang-btn" 
        :class="{ active: currentLang === 'zh' }"
        @click="$emit('switch', 'zh')"
      >中</button>
    </div>
  `
}