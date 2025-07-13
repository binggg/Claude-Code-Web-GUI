// LoadingModal.js - 加载模态框组件
export default {
  name: 'LoadingModal',
  props: {
    message: {
      type: String,
      default: ''
    },
    currentLang: {
      type: String,
      default: 'zh'
    }
  },
  template: `
    <div class="share-modal loading-modal">
      <div class="share-modal-content">
        <div class="share-modal-header">
          <h3>🔗 {{ message || t('loadingSharedSession') }}</h3>
        </div>
        <div class="share-modal-body" style="text-align: center; padding: 30px 20px;">
          <div class="loading-spinner" style="
            width: 40px; 
            height: 40px; 
            margin: 0 auto 20px; 
            border: 3px solid #3f3f46; 
            border-top: 3px solid #f97316; 
            border-radius: 50%; 
            animation: spin 1s linear infinite;
          "></div>
          <p style="color: #a1a1aa; margin: 0; font-size: 14px;">
            {{ t('fetchingFromGist') }}
          </p>
        </div>
      </div>
    </div>
  `,
  methods: {
    t(key) {
      // 临时实现，后续将使用统一的i18n
      const translations = {
        zh: {
          loadingSharedSession: '正在加载分享的会话...',
          fetchingFromGist: '正在直接从Gist获取内容（无频率限制）...'
        },
        en: {
          loadingSharedSession: 'Loading Shared Session...',
          fetchingFromGist: 'Fetching content directly from Gist (no rate limit)...'
        }
      }
      return translations[this.currentLang]?.[key] || key
    }
  },
  mounted() {
    // 添加动画CSS
    if (!document.querySelector('#spinner-animation')) {
      const style = document.createElement('style')
      style.id = 'spinner-animation'
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `
      document.head.appendChild(style)
    }
  }
}