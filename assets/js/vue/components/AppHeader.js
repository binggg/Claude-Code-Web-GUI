// AppHeader.js - 应用头部组件
export default {
  name: 'AppHeader',
  props: {
    currentLang: {
      type: String,
      default: 'zh'
    }
  },
  emits: ['switch-lang', 'select-directory', 'open-gist-import', 'open-settings'],
  template: `
    <div class="header" id="header">
      <div class="header-title">
        <img src="assets/icons/logo.png" class="logo-svg" alt="Claude Code Web GUI">
        <h1>{{ t('title') }}</h1>
      </div>
      <p>{{ t('subtitle') }}</p>
      
      <div class="header-links">
        <button class="settings-btn" @click="$emit('open-settings')" :title="t('apiKeySettings')">
          ⚙️
        </button>
        <a href="https://github.com/binggg/Claude-Code-Web-GUI" target="_blank" class="github-link">
          <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          {{ t('github') }}
        </a>
      </div>
      
      <div class="privacy-notice">
        <div class="notice-icon">🔒</div>
        <div class="notice-text">
          <strong>{{ t('privacy.title') }}</strong>：{{ t('privacy.text') }}
        </div>
      </div>
      
      <div class="instructions">
        <h3>{{ t('features.title') }}</h3>
        <ol>
          <li v-for="feature in features" :key="feature" v-html="feature"></li>
        </ol>
        <p><strong>{{ t('instructions.title') }}</strong>{{ t('instructions.locations') }}</p>
      </div>
      
      <div class="homepage-actions">
        <button class="access-btn primary" @click="$emit('select-directory')">
          {{ t('selectBtn') }}
        </button>
        
        <button class="access-btn secondary" @click="$emit('open-gist-import')">
          {{ t('gistImportBtn') }}
        </button>
      </div>
    </div>
  `,
  computed: {
    features() {
      return [
        '📁 <strong>本地浏览</strong>：安全查看您的 Claude Code 会话记录',
        '🔗 <strong>便捷分享</strong>：通过 GitHub Gist 分享会话给他人'
      ]
    }
  },
  methods: {
    t(key) {
      const translations = {
        zh: {
          title: 'Claude Code Web GUI',
          subtitle: '浏览、查看和分享您的 Claude Code 会话 - 完全在浏览器中运行',
          github: 'GitHub',
          privacy: {
            title: '隐私保护',
            text: '完全本地运行，支持会话分享，无数据上传'
          },
          features: {
            title: '功能特色：'
          },
          instructions: {
            title: '开始使用：',
            locations: '点击下方按钮选择 .claude 目录开始浏览'
          },
          selectBtn: '📁 选择 .claude 目录',
          gistImportBtn: '🌐 查看他人分享的会话',
          apiKeySettings: '设置'
        },
        en: {
          title: 'Claude Code Web GUI',
          subtitle: 'Browse, view and share your Claude Code sessions - runs entirely in browser',
          github: 'GitHub',
          privacy: {
            title: 'Privacy Protection',
            text: 'Runs entirely locally, supports session sharing, no data uploads'
          },
          features: {
            title: 'Key Features:'
          },
          instructions: {
            title: 'Get Started:',
            locations: 'Click the button below to select the .claude directory'
          },
          selectBtn: '📁 Select .claude directory',
          gistImportBtn: '🌐 View shared sessions',
          apiKeySettings: 'Settings'
        }
      }
      
      const keys = key.split('.')
      let value = translations[this.currentLang]
      
      for (const k of keys) {
        value = value?.[k]
        if (!value) return key
      }
      
      return value
    }
  }
}