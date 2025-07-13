// ErrorModal.js - 错误模态框组件
export default {
  name: 'ErrorModal',
  props: {
    error: {
      type: Object,
      required: true
    },
    currentLang: {
      type: String,
      default: 'zh'
    }
  },
  emits: ['retry', 'configure-api', 'close'],
  computed: {
    suggestion() {
      const error = this.error
      if (!error) return ''
      
      if (error.message.includes('rate limit') || error.message.includes('403')) {
        return this.t('rateLimitSuggestion')
      } else if (error.message.includes('fetch') || error.message.includes('network')) {
        return this.t('networkErrorSuggestion')
      } else {
        return this.t('invalidGistSuggestion')
      }
    },
    showApiKeyButton() {
      return this.error?.message.includes('rate limit') || this.error?.message.includes('403')
    }
  },
  template: `
    <div class="share-modal error-modal">
      <div class="share-modal-content">
        <div class="share-modal-header">
          <h3>❌ {{ t('loadingFailed') }}</h3>
          <button class="close-btn" @click="$emit('close')">✕</button>
        </div>
        <div class="share-modal-body">
          <div style="
            background: #7f1d1d; 
            border: 1px solid #dc2626; 
            border-radius: 6px; 
            padding: 16px; 
            margin-bottom: 16px;
          ">
            <p style="color: #fecaca; margin: 0; font-size: 13px; line-height: 1.5;">
              {{ suggestion }}
            </p>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button 
              v-if="showApiKeyButton"
              class="action-btn" 
              @click="$emit('configure-api')"
              style="flex: 1; min-width: 120px;"
            >
              ⚙️ {{ t('configureApiKey') }}
            </button>
            <button 
              class="action-btn" 
              @click="$emit('retry')"
              style="flex: 1; min-width: 100px;"
            >
              🔄 {{ t('retryLoading') }}
            </button>
            <button 
              class="action-btn secondary" 
              @click="$emit('close')"
              style="flex: 1; min-width: 80px;"
            >
              {{ t('closeError') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  methods: {
    t(key) {
      const translations = {
        zh: {
          loadingFailed: '加载失败',
          rateLimitSuggestion: 'GitHub API频率限制。为避免此问题，建议在设置中添加您的GitHub API密钥。',
          networkErrorSuggestion: '网络连接失败。请检查您的网络连接并重试。',
          invalidGistSuggestion: '分享链接无效或者Gist可能已被删除。',
          configureApiKey: '配置API密钥',
          retryLoading: '重试',
          closeError: '关闭'
        },
        en: {
          loadingFailed: 'Loading Failed',
          rateLimitSuggestion: 'GitHub API rate limit reached. To avoid this issue, consider adding your GitHub API key in settings.',
          networkErrorSuggestion: 'Network connection failed. Please check your internet connection and try again.',
          invalidGistSuggestion: 'The shared link appears to be invalid or the Gist may have been deleted.',
          configureApiKey: 'Configure API Key',
          retryLoading: 'Retry',
          closeError: 'Close'
        }
      }
      return translations[this.currentLang]?.[key] || key
    }
  }
}