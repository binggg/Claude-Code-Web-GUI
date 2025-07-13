// Language configuration
const LANGUAGES = {
    en: {
        title: 'Claude Code Web GUI',
        subtitle: 'Browse, view and share your Claude Code sessions - runs entirely in browser',
        github: 'GitHub',
        privacy: {
            title: 'Privacy Protection',
            text: 'Runs entirely locally, supports session sharing, no data uploads'
        },
        features: {
            title: 'Key Features',
            list: [
                '📁 **Local Browsing**: Securely view your Claude Code session history',
                '🔗 **Easy Sharing**: Share sessions with others via GitHub Gist'
            ]
        },
        instructions: {
            title: 'Get Started:',
            steps: [
                'Click the button below to select the .claude directory',
                'In the file picker, press Cmd+Shift+. (Mac) or Ctrl+H (Windows/Linux) to show hidden files',
                'Find and select the .claude directory (usually in user home directory: ~/)',
                'Start browsing your session history'
            ],
            locations: 'Click the button below to select the .claude directory',
            locationList: []
        },
        selectBtn: '📁 Select .claude directory',
        gistImportBtn: '🌐 View shared sessions',
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
            daysAgo: (n) => `${n} days ago`,
            unknown: 'Unknown time'
        },
        toolUse: 'Tool used',
        toolParams: 'Tool parameters',
        share: 'Share',
        export: 'Export',
        shareSuccess: 'Share link copied to clipboard!',
        shareManual: 'Please manually copy the share link:',
        sharedSession: 'Shared Session',
        shareToX: 'Share to X',
        shareToTwitter: 'Share to X',
        time: 'Time',
        sessionId: 'Session ID',
        sharedNote: 'This is a shared Claude Code session snippet',
        viewApp: 'View Full App',
        projectInfo: 'Project Info',
        openInVSCode: 'Open in VSCode',
        shareSession: 'Share Session',
        shareViaGist: 'Create Gist to Share Session',
        gistDescription: 'Share your complete session history via GitHub Gist, maintaining original JSONL format for easy import.',
        createGist: 'Start Creating Gist',
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
        importFromGist: 'View Others\' Shared Sessions',
        gistImportDescription: 'Enter a GitHub Gist URL to view shared session content.',
        gistUrlPlaceholder: 'Enter Gist URL...',
        importGist: 'View Session',
        invalidGistUrl: 'Invalid Gist URL',
        gistFetchFailed: 'Failed to fetch Gist content',
        gistImportError: 'Gist import failed',
        noSessionFileInGist: 'No session file found in Gist',
        noMarkdownInGist: 'No Markdown file found in Gist',
        gistRateLimited: 'GitHub API rate limited, using fallback method...',
        gistFallbackSuccess: 'Successfully loaded Gist content using fallback method',
        importedFromGist: 'Imported from Gist',
        viewOnGitHub: 'View on GitHub',
        backToApp: 'Back to App',
        gistId: 'Gist ID',
        created: 'Created',
        updated: 'Updated',
        format: 'Format',
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
        noMessagesInShare: 'No messages found in shared session',
        shareLinkLimitation: 'Note: Share links only include the first 10 messages. For complete sessions, please use Gist sharing',
        gistRecommendation: 'Recommended: Contains complete session content, supports original JSONL format, convenient for long-term storage and sharing',
        gistCreationSteps: 'Gist Creation Steps',
        gistStep1: 'Paste the copied content on the opened GitHub page',
        gistStep2: 'Name the file (recommended to use .jsonl extension)',
        gistStep3: 'Add description (optional)',
        gistStep4Public: 'Select "Create public gist" (Important: Must be public for others to access)',
        gistStep5: 'Copy the created Gist URL',
        shareGistUrl: 'Share Gist URL',
        shareGistUrlDesc: 'After creating the Gist, paste the URL below for social media sharing',
        pasteGistUrl: 'Paste created Gist URL...',
        copyImportLink: 'Copy Import Link',
        importLinkCopied: 'Import link copied to clipboard! Users can click this link to directly import the Gist session',
        publicGistReminder: 'Important Reminder',
        publicGistReminderText: 'Only public Gists can be accessed and viewed by others through sharing links. If you create a private Gist, others will not be able to see the session content.',
        gistFlowTitle: 'Sharing Process:',
        gistFlowStep1: 'Click the button below, it will automatically copy session content and open GitHub',
        gistFlowStep2: 'Create a <strong>public Gist</strong> on GitHub page (Important: Must be public for sharing)',
        gistFlowStep3: 'Copy the Gist URL and paste it here to generate sharing link',
        gistFlowStep4: 'Share the link with others, they can click to view session content directly',
        gistDescription2: 'Share your complete session history via GitHub Gist, maintaining original JSONL format for easy import.',
        gistImportDescription2: 'Enter a GitHub Gist URL to view shared session content.',
        gistContentCopiedMessage: '✅ Gist content copied to clipboard!\n\n📊 Content Statistics:\n- Size: {{size}} KB\n- Messages: {{count}} messages',
        gistTruncatedWarning: '\n\n⚠️ Due to Gist size limitations, truncated to first {{count}} messages',
        gistOpeningMessage: '\n\nOpening GitHub Gist creation page...',
        manualCopyGist: 'Please manually copy Gist content',
        sessionInfo: 'Session Info',
        sessionIdLabel: 'Session ID:',
        summaryLabel: 'Summary:',
        projectLabel: 'Project:',
        timeLabel: 'Time:',
        sharedTimeLabel: 'Shared Time:',
        toolCall: 'Tool Call',
        parametersLabel: 'Parameters:',
        gistViewTitle: 'Claude Code Gist View',
        gistViewDescription: '📋 Claude Code session imported from GitHub Gist: "{{title}}" - View and learn AI programming conversations online',
        formatLabel: 'Format:',
        originalFormat: 'JSONL (Original Format)',
        smartDescription: '🚀 Claude Code Smart Programming Session Sharing',
        sessionSharing: '💬 "{{content}}" - Claude Code Session Sharing',
        sessionTitle: '{{title}} - Claude Code Session',
        projectInfo2: '📊 Project: {{project}} | Time: {{time}}',
        gistCreationInfo: '📅 Created: {{date}} | Format: {{format}}',
        defaultMetaDescription: 'A simple and practical Claude Code session browser that runs entirely in your browser, supporting local browsing, easy sharing, import viewing and other features.',
        defaultOgTitle: 'Claude Code Web GUI - Smart Code Session Browser',
        defaultOgDescription: '🚀 Claude Code session browser that runs entirely in your browser, supporting local browsing, easy sharing, privacy protection. No server required, ready to use!',
        viewSharedSessions: 'View Shared Sessions',
        gistAddressInput: 'Enter Gist Address',
        supportedFormats: '💡 Supported formats:',
        fullUrlFormat: 'Full URL: https://gist.github.com/username/abc123...',
        gistIdFormat: 'Gist ID: abc123def456...',
        gistUrlOrIdPlaceholder: 'Enter Gist URL or ID...',
        viewSession: 'View Session',
        pleaseEnterGistUrlOrId: 'Please enter Gist URL or ID',
        claudeCodeSession: 'Claude Code Session',
        viewThisSession: '🚀 View this Claude Code session: "{{title}}"',
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
                '📁 **本地浏览**: 安全查看您的Claude Code会话历史',
                '🔗 **便捷分享**: 通过GitHub Gist与他人分享会话'
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
            locations: '点击下方按钮选择 .claude 目录开始浏览',
            locationList: []
        },
        selectBtn: '📁 选择 .claude 目录',
        gistImportBtn: '🌐 查看他人分享的会话',
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
        gistCreationSteps: 'Gist创建步骤',
        gistStep1: '在打开的GitHub页面中，粘贴已复制的内容',
        gistStep2: '为文件命名（建议使用 .jsonl 扩展名）',
        gistStep3: '添加描述（可选）',
        gistStep4: '点击"Create public gist"或"Create secret gist"',
        gistStep5: '复制创建的Gist URL',
        shareGistUrl: '分享Gist URL',
        shareGistUrlDesc: '创建Gist后，将URL粘贴到下方进行社交媒体分享',
        pasteGistUrl: '粘贴创建的Gist URL...',
        shareToX: '分享到X',
        copyImportLink: '复制导入链接',
        importLinkCopied: '导入链接已复制到剪贴板！用户点击该链接即可直接导入Gist会话',
        publicGistReminder: '重要提醒',
        publicGistReminderText: '只有公开的Gist才能被他人通过分享链接直接访问和查看。如果创建私有Gist，其他人将无法看到会话内容。',
        gistFlowTitle: '分享流程：',
        gistFlowStep1: '点击下方按钮，会自动复制会话内容并打开GitHub',
        gistFlowStep2: '在GitHub页面创建<strong>公开Gist</strong>（重要：必须公开才能分享）',
        gistFlowStep3: '复制Gist地址，粘贴到本页面生成分享链接',
        gistFlowStep4: '分享链接给他人，点击即可直接查看会话内容',
        gistDescription2: '通过GitHub Gist分享您的完整会话记录，保持原始JSONL格式，便于他人导入查看。',
        gistImportDescription2: '输入他人分享的GitHub Gist地址，即可查看其会话内容。',
        gistContentCopiedMessage: '✅ Gist内容已复制到剪贴板！\n\n📊 内容统计：\n- 大小：{{size}} KB\n- 消息数：{{count}} 条',
        gistTruncatedWarning: '\n\n⚠️ 由于Gist大小限制，已截断至前{{count}}条消息',
        gistOpeningMessage: '\n\n将为您打开GitHub Gist创建页面...',
        manualCopyGist: '请手动复制Gist内容',
        sessionInfo: '会话信息',
        sessionIdLabel: '会话ID:',
        summaryLabel: '摘要:',
        projectLabel: '项目:',
        timeLabel: '时间:',
        sharedTimeLabel: '分享时间:',
        toolCall: '工具调用',
        parametersLabel: '参数:',
        gistViewTitle: 'Claude Code Gist 查看',
        gistViewDescription: '📋 从 GitHub Gist 导入的 Claude Code 会话："{{title}}" - 在线查看和学习 AI 编程对话',
        formatLabel: '格式:',
        originalFormat: 'JSONL (原始格式)',
        smartDescription: '🚀 Claude Code 智能编程会话分享',
        sessionSharing: '💬 "{{content}}" - Claude Code 会话分享',
        sessionTitle: '{{title}} - Claude Code 会话',
        projectInfo2: '📊 项目: {{project}} | 时间: {{time}}',
        gistCreationInfo: '📅 创建: {{date}} | 格式: {{format}}',
        defaultMetaDescription: '一个简洁实用的 Claude Code 会话浏览器，完全在浏览器中运行，支持本地浏览、便捷分享、导入查看等功能。',
        defaultOgTitle: 'Claude Code Web GUI - 智能代码会话浏览器',
        defaultOgDescription: '🚀 完全在浏览器中运行的 Claude Code 会话浏览器，支持本地浏览、便捷分享、隐私保护。无需服务器，开箱即用！',
        viewSharedSessions: '查看他人分享的会话',
        gistAddressInput: '输入Gist地址',
        supportedFormats: '💡 支持的格式：',
        fullUrlFormat: '完整URL：https://gist.github.com/username/abc123...',
        gistIdFormat: 'Gist ID：abc123def456...',
        gistUrlOrIdPlaceholder: '输入Gist URL或ID...',
        viewSession: '查看会话',
        pleaseEnterGistUrlOrId: '请输入Gist URL或ID',
        claudeCodeSession: 'Claude Code会话',
        viewThisSession: '🚀 查看这个Claude Code会话："{{title}}"',
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
    
    // Update instructions/features
    const instructionsTitle = document.querySelector('.instructions h3');
    const instructionsList = document.querySelector('.instructions ol');
    const locationsTitle = document.querySelector('.instructions p strong');
    
    if (instructionsTitle) {
        // Show features first, then instructions
        instructionsTitle.textContent = t('features.title');
    }
    if (instructionsList) {
        // Combine features and instructions
        const featuresHtml = t('features.list')
            .map(feature => `<li>${feature}</li>`)
            .join('');
        const instructionsHtml = t('instructions.steps')
            .map(step => `<li>${step}</li>`)
            .join('');
        instructionsList.innerHTML = featuresHtml;
        
        // Add instructions title after the features list
        const instructionsSection = document.createElement('div');
        instructionsSection.innerHTML = `
            <h4 style="margin-top: 20px; margin-bottom: 10px; color: #e5e5e5;">${t('instructions.title')}</h4>
            <ol style="margin: 0; padding-left: 20px;">${instructionsHtml}</ol>
        `;
        instructionsList.parentElement.appendChild(instructionsSection);
    }
    if (locationsTitle && locationsTitle.parentElement) {
        locationsTitle.parentElement.innerHTML = `<p><strong>${t('instructions.locations')}</strong></p>`;
    }
    
    // Update buttons
    const accessBtns = document.querySelectorAll('.access-btn');
    if (accessBtns.length >= 1) accessBtns[0].textContent = t('selectBtn');
    if (accessBtns.length >= 2) accessBtns[1].textContent = t('gistImportBtn');
    
    // Update sidebar
    const sidebarBrand = document.querySelector('.sidebar-brand-text');
    if (sidebarBrand) sidebarBrand.textContent = t('title');
    
    // Update search placeholder
    const searchInput = document.querySelector('.search-input');
    if (searchInput) searchInput.placeholder = t('searchPlaceholder');
    
    // Update main title
    const mainTitle = document.querySelector('.main-title');
    if (mainTitle && (mainTitle.textContent.includes('选择一个会话') || mainTitle.textContent.includes('Select a session'))) {
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