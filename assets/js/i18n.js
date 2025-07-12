// Language configuration
const LANGUAGES = {
    en: {
        title: 'Claude Code Web GUI',
        subtitle: 'Browse and view your Claude Code session history - entirely in your browser, no server required',
        github: 'GitHub',
        privacy: {
            title: 'Privacy Protection',
            text: 'This app runs entirely in your browser locally and will not upload any data to servers'
        },
        features: {
            title: 'Key Features',
            list: [
                'View and browse Claude Code session history directly in your browser',
                'Share and collaborate on conversation records with others',
                'Import shared sessions from GitHub Gist for learning and teaching',
                'Export sessions to multiple formats (Markdown, PDF, etc.)',
                'Complete privacy - all processing happens locally in your browser'
            ]
        },
        instructions: {
            title: 'Instructions:',
            steps: [
                'Click the button below to select directory',
                'In the file selector, press <kbd>Cmd+Shift+.</kbd> (Mac) or <kbd>Ctrl+H</kbd> (Windows/Linux) to show hidden files',
                'Find and select the <code>.claude</code> directory (usually in home directory: <code>~/</code>)',
                'Start browsing your session records'
            ],
            locations: 'Common locations:',
            locationList: [
                'Mac: <code>/Users/[username]/.claude</code>',
                'Windows: <code>C:\\Users\\[username]\\.claude</code>',
                'Linux: <code>/home/[username]/.claude</code>'
            ]
        },
        selectBtn: '📁 Select .claude directory',
        loading: 'Loading...',
        sessionHistory: 'Session History',
        searchPlaceholder: 'Search sessions...',
        selectSession: 'Select a session to start viewing',
        welcome: 'Welcome to Claude Code Web GUI',
        welcomeText: 'Please select a session from the left to view conversation records',
        sessionsCount: (total, projects) => `${total} sessions · ${projects} projects`,
        timeAgo: {
            justNow: 'Just now',
            minutesAgo: (n) => `${n} minutes ago`,
            hoursAgo: (n) => `${n} hours ago`,
            daysAgo: (n) => `${n} days ago`
        },
        toolUse: 'Tool used',
        toolParams: 'Tool parameters',
        share: 'Share',
        export: 'Export',
        shareSuccess: 'Share link copied to clipboard!',
        shareManual: 'Please manually copy the share link:',
        sharedSession: 'Shared Session',
        shareToTwitter: 'Share to X',
        time: 'Time',
        sessionId: 'Session ID',
        sharedNote: 'This is a shared Claude Code session snippet',
        viewApp: 'View Full App',
        projectInfo: 'Project Info',
        openInVSCode: 'Open in VSCode',
        shareSession: 'Share Session',
        shareViaGist: 'Share via GitHub Gist',
        gistDescription: 'Create a GitHub Gist to share this session',
        createGist: 'Create Gist',
        downloadMarkdown: 'Download Markdown File',
        markdownDescription: 'Download the session as a Markdown file for sharing',
        download: 'Download',
        copyToClipboard: 'Copy Link',
        copyLinkDescription: 'Copy share link to send to others directly',
        clipboardDescription: 'Copy Markdown content to clipboard',
        copy: 'Copy',
        gistContentCopied: 'Gist content copied to clipboard, opening GitHub Gist page',
        markdownCopied: 'Markdown content copied to clipboard',
        manualCopy: 'Please copy manually:',
        importFromGist: 'Import from Gist',
        gistImportDescription: 'Enter a GitHub Gist URL to view shared sessions',
        gistUrlPlaceholder: 'Enter Gist URL...',
        importGist: 'Import',
        invalidGistUrl: 'Invalid Gist URL',
        gistFetchFailed: 'Failed to fetch Gist content',
        gistImportError: 'Gist import failed',
        noMarkdownInGist: 'No Markdown file found in Gist',
        gistRateLimited: 'GitHub API rate limited, using fallback method...',
        gistFallbackSuccess: 'Successfully loaded Gist content using fallback method',
        importedFromGist: 'Imported from Gist',
        viewOnGitHub: 'View on GitHub',
        backToApp: 'Back to App',
        gistId: 'Gist ID',
        created: 'Created',
        updated: 'Updated',
        importedNote: 'This content was imported from a GitHub Gist',
        pleaseEnterGistUrl: 'Please enter a Gist URL',
        gistImportHelp: 'Gist Import Help',
        manualImport: 'Manual Import',
        manualImportDescription: 'If automatic import fails, you can manually copy Gist content',
        openGistPage: 'Open Gist page',
        copyGistContent: 'Copy file content',
        pasteContentBelow: 'Paste content in the text box below',
        pasteGistContent: 'Paste Gist content...',
        importContent: 'Import Content',
        pleaseEnterContent: 'Please enter content',
        manuallyImported: 'Manually Imported Content',
        gistFallbackInstructions: 'Unable to automatically fetch Gist content. Please:\n1. Open Gist page\n2. Click "Raw" button\n3. Copy the complete URL path\n4. Or copy file content directly to clipboard',
        fabShareTooltip: 'Share Session',
        openVSCodeInstructions: 'VSCode Open Instructions',
        projectPath: 'Project Path',
        vscodeOptions: 'Open Options',
        clickLink: 'Click link to open directly',
        manualOpen: 'Manual open',
        copyPath: 'Copy path to clipboard, then open in VSCode',
        copyPathConfirm: 'Copy path to clipboard?',
        pathCopied: 'Path copied to clipboard',
        chatInputPlaceholder: 'This feature is not yet available, please look forward to future versions...',
        chatInputDisabledTooltip: 'The current version does not support direct conversation with Claude in the page',
        chatSendDisabledTooltip: 'Send function is not yet available',
        send: 'Send',
        back: 'Back',
        shareLinkLimitation: 'Note: Share links only include the first 10 messages. For complete sessions, please use Gist sharing',
        gistRecommendation: 'Recommended: Contains complete session content, supports Markdown format, convenient for long-term storage and sharing',
        errors: {
            unsupported: 'Your browser does not support the File System Access API. Please use the latest version of Chrome or Edge.',
            accessFailed: 'Failed to access directory',
            loadFailed: 'Failed to load projects',
            sessionLoadFailed: 'Failed to load session details',
            noProjects: 'projects directory not found. Please make sure you selected the correct .claude directory.'
        },
        confirmDialog: {
            title: 'About to open directory selector.',
            instructions: [
                'If you cannot see the .claude directory, please:',
                '• Mac users: Press Cmd+Shift+. to show hidden files',
                '• Windows users: Press Ctrl+H to show hidden files', 
                '• Linux users: Press Ctrl+H to show hidden files',
                '• Then find the .claude folder in the user home directory'
            ],
            continue: 'Click "OK" to continue selecting directory'
        },
        wrongDirectory: (name) => `You selected directory: ${name}\n\nThis doesn't seem to be the .claude directory. Continue anyway?\n(If this is indeed the correct directory, click "OK" to continue)`
    },
    zh: {
        title: 'Claude Code Web GUI',
        subtitle: '浏览和查看您的 Claude Code 会话历史 - 完全在浏览器中运行，无需服务器',
        github: 'GitHub',
        privacy: {
            title: '隐私保护',
            text: '此应用完全在浏览器本地运行，不会上传任何数据到服务器'
        },
        features: {
            title: '主要特性',
            list: [
                '直接在浏览器中查看和浏览 Claude Code 会话历史',
                '与他人分享和协作查看对话记录',
                '从 GitHub Gist 导入共享会话，方便学习和教学',
                '导出会话到多种格式（Markdown、PDF 等）',
                '完全隐私 - 所有处理都在您的浏览器本地进行'
            ]
        },
        instructions: {
            title: '使用说明：',
            steps: [
                '点击下方按钮选择目录',
                '在文件选择器中，按 <kbd>Cmd+Shift+.</kbd> (Mac) 或 <kbd>Ctrl+H</kbd> (Windows/Linux) 显示隐藏文件',
                '找到并选择 <code>.claude</code> 目录（通常在用户主目录下：<code>~/</code>)',
                '开始浏览您的会话记录'
            ],
            locations: '常见位置：',
            locationList: [
                'Mac: <code>/Users/[用户名]/.claude</code>',
                'Windows: <code>C:\\Users\\[用户名]\\.claude</code>',
                'Linux: <code>/home/[用户名]/.claude</code>'
            ]
        },
        selectBtn: '📁 选择 .claude 目录',
        loading: '正在加载...',
        sessionHistory: '会话历史',
        searchPlaceholder: '搜索会话...',
        selectSession: '选择一个会话开始查看',
        welcome: '欢迎使用 Claude Code Web GUI',
        welcomeText: '请从左侧选择一个会话开始查看对话记录',
        sessionsCount: (total, projects) => `${total} 个会话 · ${projects} 个项目`,
        timeAgo: {
            justNow: '刚刚',
            minutesAgo: (n) => `${n}分钟前`,
            hoursAgo: (n) => `${n}小时前`,
            daysAgo: (n) => `${n}天前`
        },
        toolUse: '使用工具',
        toolParams: '工具参数',
        share: '分享',
        export: '导出',
        shareSuccess: '分享链接已复制到剪贴板！',
        shareManual: '请手动复制分享链接：',
        sharedSession: '分享的会话',
        shareToTwitter: '分享到X',
        time: '时间',
        sessionId: '会话ID',
        sharedNote: '这是一个分享的Claude Code会话片段',
        viewApp: '访问完整应用',
        projectInfo: '项目信息',
        openInVSCode: '在VSCode中打开',
        shareSession: '分享会话',
        shareViaGist: '通过GitHub Gist分享',
        gistDescription: '创建一个GitHub Gist来分享这个会话',
        createGist: '创建Gist',
        downloadMarkdown: '下载Markdown文件',
        markdownDescription: '下载会话的Markdown文件进行分享',
        download: '下载',
        copyToClipboard: '复制链接',
        copyLinkDescription: '复制分享链接，直接发送给他人查看',
        clipboardDescription: '复制Markdown内容到剪贴板',
        copy: '复制',
        gistContentCopied: 'Gist内容已复制到剪贴板，将打开GitHub Gist页面',
        markdownCopied: 'Markdown内容已复制到剪贴板',
        manualCopy: '请手动复制：',
        importFromGist: '从Gist导入会话',
        gistImportDescription: '输入GitHub Gist URL来查看分享的会话',
        gistUrlPlaceholder: '输入Gist URL...',
        importGist: '导入',
        invalidGistUrl: '无效的Gist URL',
        gistFetchFailed: '获取Gist内容失败',
        gistImportError: 'Gist导入失败',
        noMarkdownInGist: 'Gist中未找到Markdown文件',
        gistRateLimited: 'GitHub API频率限制，使用备用方法...',
        gistFallbackSuccess: '已使用备用方法成功加载Gist内容',
        importedFromGist: '从Gist导入',
        viewOnGitHub: '在GitHub查看',
        backToApp: '返回应用',
        gistId: 'Gist ID',
        created: '创建时间',
        updated: '更新时间',
        importedNote: '这是从GitHub Gist导入的会话内容',
        pleaseEnterGistUrl: '请输入Gist URL',
        gistImportHelp: 'Gist导入帮助',
        manualImport: '手动导入',
        manualImportDescription: '如果自动导入失败，您可以手动复制Gist内容',
        openGistPage: '打开Gist页面',
        copyGistContent: '复制文件内容',
        pasteContentBelow: '将内容粘贴到下方文本框',
        pasteGistContent: '粘贴Gist内容...',
        importContent: '导入内容',
        pleaseEnterContent: '请输入内容',
        manuallyImported: '手动导入的内容',
        gistFallbackInstructions: '无法自动获取Gist内容。请：\n1. 打开Gist页面\n2. 点击"Raw"按钮\n3. 复制URL中的完整路径\n4. 或者直接复制文件内容到剪贴板',
        fabShareTooltip: '分享会话',
        openVSCodeInstructions: 'VSCode打开说明',
        projectPath: '项目路径',
        vscodeOptions: '打开方式',
        clickLink: '点击链接直接打开',
        manualOpen: '手动打开',
        copyPath: '复制路径到剪贴板，然后在VSCode中打开',
        copyPathConfirm: '是否复制路径到剪贴板？',
        pathCopied: '路径已复制到剪贴板',
        chatInputPlaceholder: '此功能暂未开放，请期待后续版本...',
        chatInputDisabledTooltip: '当前版本不支持直接在页面中与Claude对话',
        chatSendDisabledTooltip: '发送功能暂未开放',
        send: '发送',
        back: '返回',
        shareLinkLimitation: '注意：分享链接仅包含前10条消息，如需分享完整会话请使用Gist功能',
        gistRecommendation: '推荐：包含完整会话内容，支持Markdown格式，便于长期保存和分享',
        errors: {
            unsupported: '您的浏览器不支持文件系统访问 API。请使用最新版本的 Chrome 或 Edge 浏览器。',
            accessFailed: '访问目录失败',
            loadFailed: '加载项目失败',
            sessionLoadFailed: '加载会话详情失败',
            noProjects: '未找到 projects 目录。请确保选择的是正确的 .claude 目录。'
        },
        confirmDialog: {
            title: '即将打开目录选择器。',
            instructions: [
                '如果看不到 .claude 目录，请：',
                '• Mac用户：按 Cmd+Shift+. 显示隐藏文件',
                '• Windows用户：按 Ctrl+H 显示隐藏文件',
                '• Linux用户：按 Ctrl+H 显示隐藏文件',
                '• 然后在用户主目录中找到 .claude 文件夹'
            ],
            continue: '点击"确定"继续选择目录'
        },
        wrongDirectory: (name) => `您选择的目录是：${name}\n\n这似乎不是 .claude 目录。是否继续？\n（如果确实是正确的目录，点击"确定"继续）`
    }
};

// Current language state
let currentLang = 'zh';

// Language functions
function t(key, ...params) {
    const keys = key.split('.');
    let value = LANGUAGES[currentLang];
    
    for (const k of keys) {
        value = value[k];
        if (!value) return key;
    }
    
    if (typeof value === 'function') {
        return value(...params);
    }
    
    return value;
}

function switchLanguage(lang) {
    if (lang === currentLang) return;
    
    currentLang = lang;
    localStorage.setItem('claude-gui-lang', lang);
    updateUI();
    
    // Update active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

function updateUI() {
    // Update header content
    const headerTitle = document.querySelector('.header h1');
    const headerSubtitle = document.querySelector('.header p');
    const githubLink = document.querySelector('.github-link');
    
    if (headerTitle) headerTitle.textContent = t('title');
    if (headerSubtitle) headerSubtitle.textContent = t('subtitle');
    if (githubLink) githubLink.innerHTML = `
        <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        ${t('github')}
    `;
    
    // Update privacy notice
    const privacyTitle = document.querySelector('.notice-text strong');
    const privacyText = document.querySelector('.notice-text');
    if (privacyTitle && privacyText) {
        privacyText.innerHTML = `<strong>${t('privacy.title')}</strong>：${t('privacy.text')}`;
    }
    
    // Update instructions
    const instructionsTitle = document.querySelector('.instructions h3');
    const instructionsList = document.querySelector('.instructions ol');
    const locationsTitle = document.querySelector('.instructions p strong');
    const locationsList = document.querySelector('.instructions ul');
    
    if (instructionsTitle) instructionsTitle.textContent = t('instructions.title');
    if (instructionsList) {
        instructionsList.innerHTML = t('instructions.steps')
            .map(step => `<li>${step}</li>`)
            .join('');
    }
    if (locationsTitle) locationsTitle.textContent = t('instructions.locations');
    if (locationsList) {
        locationsList.innerHTML = t('instructions.locationList')
            .map(location => `<li>${location}</li>`)
            .join('');
    }
    
    // Update button
    const accessBtn = document.querySelector('.access-btn');
    if (accessBtn) accessBtn.textContent = t('selectBtn');
    
    // Update sidebar
    const sidebarBrand = document.querySelector('.sidebar-brand-text');
    if (sidebarBrand) sidebarBrand.textContent = t('title');
    
    // Update search placeholder
    const searchInput = document.querySelector('.search-input');
    if (searchInput) searchInput.placeholder = t('searchPlaceholder');
    
    // Update main title
    const mainTitle = document.querySelector('.main-title');
    if (mainTitle && mainTitle.textContent.includes('选择一个会话') || mainTitle.textContent.includes('Select a session')) {
        mainTitle.textContent = t('selectSession');
    }
    
    // Update empty state
    const emptyStateTitle = document.querySelector('.empty-state h3');
    const emptyStateText = document.querySelector('.empty-state p');
    if (emptyStateTitle) emptyStateTitle.textContent = t('welcome');
    if (emptyStateText) emptyStateText.textContent = t('welcomeText');
    
    // Update loading
    const loadingText = document.querySelector('.loading p');
    if (loadingText) loadingText.textContent = t('loading');
    
    // Update action buttons
    const shareText = document.getElementById('share-text');
    const exportText = document.getElementById('export-text');
    const backText = document.getElementById('back-text');
    if (shareText) shareText.textContent = t('share');
    if (exportText) exportText.textContent = t('export');
    if (backText) backText.textContent = t('back');
}

// Initialize language
function initLanguage() {
    // Detect system language
    const browserLang = navigator.language || navigator.userLanguage;
    const isChineseSystem = browserLang.toLowerCase().includes('zh');
    const defaultLang = isChineseSystem ? 'zh' : 'en';
    
    const savedLang = localStorage.getItem('claude-gui-lang') || defaultLang;
    currentLang = savedLang;
    
    // Create language toggle
    const langToggle = document.createElement('div');
    langToggle.className = 'language-toggle';
    langToggle.innerHTML = `
        <button class="lang-btn ${savedLang === 'en' ? 'active' : ''}" data-lang="en" onclick="switchLanguage('en')">EN</button>
        <button class="lang-btn ${savedLang === 'zh' ? 'active' : ''}" data-lang="zh" onclick="switchLanguage('zh')">中</button>
    `;
    document.body.appendChild(langToggle);
    
    updateUI();
}

// Export for global use
window.t = t;
window.switchLanguage = switchLanguage;
window.initLanguage = initLanguage;