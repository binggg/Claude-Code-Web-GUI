// Main application logic
class ClaudeCodeGUI {
    constructor() {
        this.directoryHandle = null;
        this.currentProject = null;
        this.projects = [];
        this.allSessions = [];
        this.currentSession = null;
        this.filteredSessions = [];
        
        this.init();
    }
    
    init() {
        // Initialize language support
        initLanguage();
        
        // Check for shared session in URL
        this.checkForSharedSession();
        
        // Check browser support
        if (!('showDirectoryPicker' in window)) {
            this.showError(t('errors.unsupported'));
        }
    }
    
    checkForSharedSession() {
        // Check for URL hash fragment first (new method using #session=)
        const hash = window.location.hash;
        
        if (hash.startsWith('#session=')) {
            const sessionParam = hash.substring(9); // Remove '#session='
            try {
                console.log('Hash session param found:', sessionParam.substring(0, 50) + '...');
                console.log('Session param length:', sessionParam.length);
                
                const sessionData = JSON.parse(this.base64ToUnicode(sessionParam));
                console.log('Hash session data parsed successfully');
                console.log('Title:', sessionData.title);
                console.log('Messages count:', sessionData.msgs ? sessionData.msgs.length : 0);
                
                this.displaySharedSession(sessionData);
                this.setupTwitterSharing(sessionData);
                return;
            } catch (error) {
                console.error('Failed to load shared session from hash:', error);
                this.showError(`Failed to load shared session: ${error.message}`);
            }
        }
        
        // Check for URL query parameter (fallback for old links)
        let sessionParam = null;
        
        // Method 1: URLSearchParams
        try {
            const urlParams = new URLSearchParams(window.location.search);
            sessionParam = urlParams.get('session');
            console.log('URLSearchParams result:', sessionParam ? sessionParam.length : 'null');
        } catch (e) {
            console.error('URLSearchParams failed:', e);
        }
        
        // Method 2: Manual parsing if URLSearchParams failed or returned null
        if (!sessionParam) {
            try {
                const search = window.location.search;
                console.log('Raw search string:', search);
                const match = search.match(/[?&]session=([^&]*)/);
                if (match && match[1]) {
                    sessionParam = decodeURIComponent(match[1]);
                    console.log('Manual parsing result:', sessionParam.length);
                }
            } catch (e) {
                console.error('Manual parsing failed:', e);
            }
        }
        
        if (sessionParam) {
            try {
                console.log('Query session param found:', sessionParam.substring(0, 50) + '...');
                console.log('Session param length:', sessionParam.length);
                
                const sessionData = JSON.parse(this.base64ToUnicode(sessionParam));
                console.log('Query session data parsed successfully');
                console.log('Title:', sessionData.title);
                console.log('Messages count:', sessionData.msgs ? sessionData.msgs.length : 0);
                
                this.displaySharedSession(sessionData);
                this.setupTwitterSharing(sessionData);
                return;
            } catch (error) {
                console.error('Failed to load shared session from query param:', error);
                this.showError(`Failed to load shared session: ${error.message}`);
            }
        }
        
        // Check for import parameter for Gist auto-import
        if (hash.startsWith('#import=')) {
            const gistUrl = decodeURIComponent(hash.substring(8));
            this.autoImportGist(gistUrl);
            return;
        }
        
        // Fallback to old hash method for backwards compatibility
        if (hash.startsWith('#shared=')) {
            const compressed = hash.substring(8);
            try {
                const sessionData = JSON.parse(atob(compressed));
                this.displaySharedSession(sessionData);
                this.setupTwitterSharing(sessionData);
            } catch (error) {
                console.error('Failed to load shared session from hash:', error);
            }
        }
    }
    
    async autoImportGist(gistUrl) {
        // Show loading
        this.showLoading(true);
        
        try {
            await this.importFromGist(gistUrl);
        } catch (error) {
            console.error('Auto-import failed:', error);
            // Show error and fallback to manual import
            this.showError(`${t('gistImportError') || 'Gist导入失败'}: ${error.message}`);
        } finally {
            this.showLoading(false);
        }
    }
    
    displaySharedSession(sessionData) {
        // Update page meta tags for social sharing
        this.updateMetaTagsForSession(sessionData);
        
        // Hide header and show shared session
        document.getElementById('header').classList.add('collapsed');
        document.getElementById('main-layout').classList.remove('hidden');
        
        // Hide language toggle when viewing shared session
        this.hideLangToggle();
        
        // Hide sidebar for shared sessions
        document.getElementById('sidebar').classList.add('collapsed');
        
        // Update title
        document.getElementById('main-title').textContent = `📤 ${sessionData.title}`;
        
        // Show back button in header actions
        const actionsDiv = document.getElementById('session-actions');
        actionsDiv.style.display = 'flex';
        actionsDiv.innerHTML = `
            <button class="action-btn" onclick="returnToHomepage()">
                <span>⬅️</span>
                <span>${t('back') || '返回'}</span>
            </button>
            <button class="action-btn twitter-share" onclick="shareSessionToX()">
                <span>𝕏</span>
                <span>${t('shareToX') || '分享到X'}</span>
            </button>
        `;
        
        // Show shared indicator
        const existingIndicator = document.querySelector('.shared-indicator');
        if (existingIndicator) existingIndicator.remove();
        
        const sharedIndicator = document.createElement('div');
        sharedIndicator.className = 'shared-indicator';
        sharedIndicator.innerHTML = `
            <span>🔗</span>
            <span>${t('sharedSession') || '分享的会话'}</span>
        `;
        document.querySelector('.main-header').appendChild(sharedIndicator);
        
        // Display messages
        this.renderSharedChat(sessionData);
        
        // Hide FAB buttons for shared sessions
        this.hideFabButton();
    }
    
    renderSharedChat(sessionData) {
        const container = document.getElementById('chat-messages');
        container.innerHTML = '';
        
        // Add session info header
        const infoDiv = document.createElement('div');
        infoDiv.className = 'shared-session-info';
        infoDiv.innerHTML = `
            <h2>📤 ${sessionData.title}</h2>
            <p><strong>${t('time') || '时间'}:</strong> ${new Date(sessionData.time).toLocaleString()}</p>
            <p><strong>${t('sessionId') || '会话ID'}:</strong> ${sessionData.id}</p>
            <hr style="margin: 20px 0; border: 1px solid #262626;">
        `;
        container.appendChild(infoDiv);
        
        // Display messages (handle simplified format for shared sessions)
        if (sessionData.msgs && sessionData.msgs.length > 0) {
            sessionData.msgs.forEach((msg, index) => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${msg.type}`;
                
                const avatar = document.createElement('div');
                avatar.className = 'message-avatar';
                
                if (msg.type === 'user') {
                    avatar.textContent = 'U';
                } else {
                    avatar.innerHTML = `<img src="assets/icons/claude-avatar.svg" class="claude-avatar-svg" alt="Claude">`;
                }
                
                const content = document.createElement('div');
                content.className = 'message-content';
                
                const textDiv = document.createElement('div');
                textDiv.className = 'message-text';
                
                // Handle simplified message format in shared sessions
                textDiv.textContent = msg.content || '';
                content.appendChild(textDiv);
                
                messageDiv.appendChild(avatar);
                messageDiv.appendChild(content);
                container.appendChild(messageDiv);
            });
        } else {
            // Show message if no messages found
            const noMsgDiv = document.createElement('div');
            noMsgDiv.style.cssText = 'text-align: center; color: #71717a; margin: 40px 0;';
            noMsgDiv.textContent = t('noMessagesInShare') || '分享的会话中没有消息内容';
            container.appendChild(noMsgDiv);
        }
        
        // Add footer
        const footerDiv = document.createElement('div');
        footerDiv.className = 'shared-session-footer';
        footerDiv.innerHTML = `
            <p><em>${t('sharedNote') || '这是一个分享的Claude Code会话片段'}</em></p>
            <p><a href="${window.location.origin}${window.location.pathname}" style="color: #667eea;">${t('viewApp') || '访问完整应用'}</a></p>
        `;
        container.appendChild(footerDiv);
    }
    
    setupTwitterSharing(sessionData) {
        // Add Twitter share button
        const twitterBtn = document.createElement('button');
        twitterBtn.className = 'action-btn twitter-share';
        twitterBtn.innerHTML = `
            <span>🐦</span>
            <span>${t('shareToTwitter') || '分享到X'}</span>
        `;
        twitterBtn.onclick = () => this.shareToTwitter(sessionData);
        
        const actionsDiv = document.getElementById('session-actions') || document.createElement('div');
        if (!document.getElementById('session-actions')) {
            actionsDiv.id = 'session-actions';
            actionsDiv.className = 'session-actions';
            document.querySelector('.main-header').appendChild(actionsDiv);
        }
        actionsDiv.style.display = 'flex';
        actionsDiv.appendChild(twitterBtn);
    }
    
    shareToTwitter(sessionData) {
        const text = `Check out this Claude Code session: "${sessionData.title}"`;
        const url = window.location.href;
        const hashtags = 'ClaudeCode,AI,Programming';
        
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${hashtags}`;
        window.open(twitterUrl, '_blank');
    }
    
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('collapsed');
    }

    toggleSessionGroup(projectName) {
        const group = document.querySelector(`[data-project="${projectName}"]`);
        if (group) {
            group.classList.toggle('collapsed');
        }
    }

    filterSessions() {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;
        
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        // Clear previous timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        
        // Debounce search to prevent performance issues
        this.searchTimeout = setTimeout(() => {
            try {
                // Add performance protection for large datasets
                if (this.allSessions.length > 1000) {
                    console.warn('Large dataset detected, limiting search results');
                }
                
                if (searchTerm === '') {
                    this.filteredSessions = [];
                } else if (searchTerm.length < 2) {
                    // Don't search for single characters to improve performance
                    return;
                } else {
                    // Limit search results to prevent UI freezing
                    const maxResults = 50;
                    this.filteredSessions = [];
                    
                    for (const session of this.allSessions) {
                        if (this.filteredSessions.length >= maxResults) {
                            break;
                        }
                        
                        if (!session.summary) continue;
                        
                        const summaryMatch = session.summary.toLowerCase().includes(searchTerm);
                        const projectMatch = session.projectName && 
                            this.getProjectDisplayName(session.projectName.replace(/-/g, '/')).toLowerCase().includes(searchTerm);
                        
                        if (summaryMatch || projectMatch) {
                            this.filteredSessions.push(session);
                        }
                    }
                    
                    // Show message if results were limited
                    if (this.filteredSessions.length === maxResults) {
                        console.log(`Search limited to ${maxResults} results for performance`);
                    }
                }
                
                this.renderSidebar();
            } catch (error) {
                console.error('Search failed:', error);
                // Reset search on error
                this.filteredSessions = [];
                this.renderSidebar();
                
                // Show user-friendly error
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                    searchInput.style.borderColor = '#ef4444';
                    setTimeout(() => {
                        searchInput.style.borderColor = '';
                    }, 2000);
                }
            }
        }, 300); // 300ms debounce
    }

    async requestDirectoryAccess() {
        try {
            if ('showDirectoryPicker' in window) {
                // Show confirmation dialog
                const instructions = t('confirmDialog.instructions').join('\n');
                const shouldContinue = confirm(
                    `${t('confirmDialog.title')}

${instructions}

${t('confirmDialog.continue')}`
                );
                
                if (!shouldContinue) {
                    return;
                }
                
                // Use simple options for compatibility
                this.directoryHandle = await window.showDirectoryPicker({
                    mode: 'read'
                });
                
                // Verify if it's .claude directory
                if (!this.directoryHandle.name.includes('claude')) {
                    const proceed = confirm(t('wrongDirectory', this.directoryHandle.name));
                    
                    if (!proceed) {
                        return;
                    }
                }
                
                await this.loadProjects();
                this.hideError();
            } else {
                this.showError(t('errors.unsupported'));
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                return;
            } else if (error.name === 'NotFoundError') {
                this.showError(t('errors.noProjects'));
            } else {
                this.showError(`${t('errors.accessFailed')}: ${error.message}`);
            }
        }
    }

    async loadProjects() {
        this.showLoading(true);
        this.projects = [];
        this.allSessions = [];
        
        try {
            const projectsHandle = await this.directoryHandle.getDirectoryHandle('projects');
            
            for await (const [name, handle] of projectsHandle.entries()) {
                if (handle.kind === 'directory') {
                    const sessions = [];
                    for await (const [fileName, fileHandle] of handle.entries()) {
                        if (fileName.endsWith('.jsonl')) {
                            const sessionId = fileName.replace('.jsonl', '');
                            sessions.push({ id: sessionId, handle: fileHandle, projectName: name });
                        }
                    }
                    
                    const projectPath = name.replace(/-/g, '/');
                    this.projects.push({
                        name: projectPath,
                        path: name,
                        sessions: sessions,
                        handle: handle
                    });
                    
                    this.allSessions.push(...sessions);
                }
            }
            
            // Hide header instructions
            document.getElementById('header').classList.add('collapsed');
            
            // Hide language toggle when navigating away from homepage
            this.hideLangToggle();
            
            // Show main layout
            document.getElementById('main-layout').classList.remove('hidden');
            
            await this.loadAllSessions();
            this.renderSidebar();
            
        } catch (error) {
            this.showError(`${t('errors.loadFailed')}: ${error.message}`);
        } finally {
            this.showLoading(false);
        }
    }

    async loadAllSessions() {
        const sessionsWithData = [];
        
        for (const session of this.allSessions) {
            try {
                const file = await session.handle.getFile();
                const content = await file.text();
                const lines = content.trim().split('\n');
                
                let summary = null;
                let firstMessage = null;
                let lastTimestamp = null;
                
                for (const line of lines) {
                    try {
                        const record = JSON.parse(line);
                        if (record.type === 'summary') {
                            summary = record.summary;
                        } else if (record.type === 'user' && !firstMessage) {
                            firstMessage = record.message.content;
                        }
                        if (record.timestamp) {
                            lastTimestamp = record.timestamp;
                        }
                    } catch (e) {
                        // Ignore parsing errors
                    }
                }
                
                sessionsWithData.push({
                    ...session,
                    summary: summary || firstMessage || 'Untitled',
                    timestamp: lastTimestamp,
                });
            } catch (error) {
                console.error('Failed to load session:', session.id, error);
            }
        }
        
        // Sort by time
        this.allSessions = sessionsWithData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    renderSidebar() {
        const container = document.getElementById('sidebar-content');
        const sessionsToShow = this.filteredSessions.length > 0 ? this.filteredSessions : this.allSessions;
        
        // Update statistics
        const stats = document.getElementById('session-stats');
        const totalSessions = this.allSessions.length;
        const totalProjects = new Set(this.allSessions.map(s => s.projectName)).size;
        stats.textContent = t('sessionsCount', totalSessions, totalProjects);
        
        // Clear existing content, keep search box and stats
        const existingElements = container.querySelectorAll('.session-search, .session-stats');
        container.innerHTML = '';
        existingElements.forEach(el => container.appendChild(el));
        
        // Group by project
        const sessionsByProject = {};
        sessionsToShow.forEach(session => {
            const projectName = this.getProjectDisplayName(session.projectName.replace(/-/g, '/'));
            if (!sessionsByProject[projectName]) {
                sessionsByProject[projectName] = [];
            }
            sessionsByProject[projectName].push(session);
        });
        
        Object.entries(sessionsByProject).forEach(([projectName, sessions]) => {
            const group = document.createElement('div');
            group.className = 'session-group';
            group.setAttribute('data-project', projectName);
            
            const header = document.createElement('div');
            header.className = 'session-group-header';
            header.onclick = () => this.toggleSessionGroup(projectName);
            
                header.innerHTML = `
                <div class="session-group-title">
                    <span>📁</span>
                    <span>${projectName}</span>
                    <span class="session-group-count">${sessions.length}</span>
                </div>
                <div class="session-group-actions">
                    <button class="project-vscode-btn" onclick="openInVSCode('${projectName}')" title="${t('openInVSCode') || '在VSCode中打开'}">
                        <span>⚡</span>
                    </button>
                    <div class="session-group-toggle">▼</div>
                </div>
            `;
            
            const sessionList = document.createElement('div');
            sessionList.className = 'session-list';
            
            sessions.forEach(session => {
                const item = document.createElement('button');
                item.className = 'session-item-sidebar';
                item.onclick = () => this.showSession(session);
                
                const timeAgo = this.getTimeAgo(session.timestamp);
                
                item.innerHTML = `
                    <div class="session-icon">💬</div>
                    <div class="session-content">
                        <div class="session-title">${session.summary}</div>
                        <div class="session-meta">
                            <span class="session-time">${timeAgo}</span>
                        </div>
                    </div>
                `;
                
                sessionList.appendChild(item);
            });
            
            group.appendChild(header);
            group.appendChild(sessionList);
            container.appendChild(group);
        });
    }

    getTimeAgo(timestamp) {
        if (!timestamp) return t('timeAgo.unknown') || 'Unknown time';
        
        const now = new Date();
        const date = new Date(timestamp);
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        
        if (diffDays > 7) {
            return date.toLocaleDateString();
        } else if (diffDays > 0) {
            return t('timeAgo.daysAgo', diffDays);
        } else if (diffHours > 0) {
            return t('timeAgo.hoursAgo', diffHours);
        } else if (diffMinutes > 0) {
            return t('timeAgo.minutesAgo', diffMinutes);
        } else {
            return t('timeAgo.justNow');
        }
    }

    async showSession(session) {
        // Update current session
        this.currentSession = session;
        
        // Update active state
        document.querySelectorAll('.session-item-sidebar').forEach(item => {
            item.classList.remove('active');
        });
        event.target.closest('.session-item-sidebar').classList.add('active');
        
        // Update title
        document.getElementById('main-title').textContent = session.summary;
        
        // Show action buttons
        document.getElementById('session-actions').style.display = 'flex';
        
        // Show FAB button when session is loaded
        this.showFabButton();
        
        this.showLoading(true);
        
        try {
            const file = await session.handle.getFile();
            const content = await file.text();
            const lines = content.trim().split('\n');
            
            const messages = [];
            
            for (const line of lines) {
                try {
                    const record = JSON.parse(line);
                    if (record.type === 'user' || record.type === 'assistant') {
                        messages.push(record);
                    }
                } catch (e) {
                    // Ignore parsing errors
                }
            }
            
            this.renderChat(messages);
            
        } catch (error) {
            this.showError(`${t('errors.sessionLoadFailed')}: ${error.message}`);
        } finally {
            this.showLoading(false);
        }
    }

    renderChat(messages) {
        const container = document.getElementById('chat-messages');
        container.innerHTML = '';
        
        messages.forEach(record => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${record.type}`;
            
            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            
            if (record.type === 'user') {
                avatar.textContent = 'U';
            } else {
                // Claude logo for assistant
                avatar.innerHTML = `<img src="assets/icons/claude-avatar.svg" class="claude-avatar-svg" alt="Claude">`;
            }
            
            const content = document.createElement('div');
            content.className = 'message-content';
            
            if (record.type === 'user') {
                const textDiv = document.createElement('div');
                textDiv.className = 'message-text';
                
                // Fix [object Object] issue
                let messageContent = '';
                if (typeof record.message.content === 'string') {
                    messageContent = record.message.content;
                } else if (Array.isArray(record.message.content)) {
                    // If array, extract text content
                    messageContent = record.message.content
                        .filter(item => item.type === 'text')
                        .map(item => item.text)
                        .join('\n');
                } else if (record.message.content && record.message.content.text) {
                    messageContent = record.message.content.text;
                } else {
                    messageContent = JSON.stringify(record.message.content);
                }
                
                textDiv.textContent = messageContent;
                content.appendChild(textDiv);
            } else if (record.type === 'assistant') {
                // Handle assistant messages
                const message = record.message;
                if (message.content) {
                    message.content.forEach(item => {
                        if (item.type === 'text') {
                            const textDiv = document.createElement('div');
                            textDiv.className = 'message-text';
                            textDiv.textContent = item.text;
                            content.appendChild(textDiv);
                        } else if (item.type === 'tool_use') {
                            const toolDiv = document.createElement('div');
                            toolDiv.className = 'tool-call';
                            
                            const toolId = `tool-${Date.now()}-${Math.random()}`;
                            
                            toolDiv.innerHTML = `
                                <div class="tool-call-header" onclick="toggleToolParams('${toolId}')">
                                    <div class="tool-call-icon">🔧</div>
                                    <span>${t('toolUse')}: ${item.name}</span>
                                    <div class="tool-toggle">▼</div>
                                </div>
                                <div class="tool-call-content collapsed" id="${toolId}">
                                    <div>${t('toolParams')}:</div>
                                    <pre class="tool-call-input">${JSON.stringify(item.input, null, 2)}</pre>
                                </div>
                            `;
                            content.appendChild(toolDiv);
                        }
                    });
                }
            }
            
            // Add timestamp
            if (record.timestamp) {
                const timestamp = document.createElement('div');
                timestamp.className = 'timestamp';
                timestamp.textContent = new Date(record.timestamp).toLocaleString();
                content.appendChild(timestamp);
            }
            
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(content);
            container.appendChild(messageDiv);
        });
        
        // Add disabled input box at the bottom
        const inputContainer = document.createElement('div');
        inputContainer.className = 'chat-input-container';
        inputContainer.innerHTML = `
            <textarea class="chat-input" 
                      placeholder="${t('chatInputPlaceholder') || '此功能暂未开放，请期待后续版本...'}" 
                      disabled 
                      title="${t('chatInputDisabledTooltip') || '当前版本不支持直接在页面中与Claude对话'}"></textarea>
            <button class="chat-send-btn" disabled title="${t('chatSendDisabledTooltip') || '发送功能暂未开放'}">
                <span>📤</span>
                <span>${t('send') || '发送'}</span>
            </button>
        `;
        container.appendChild(inputContainer);
        
        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
    }

    getProjectDisplayName(path) {
        const parts = path.split('/');
        return parts[parts.length - 1] || path;
    }

    showError(message) {
        const errorEl = document.getElementById('error-message');
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
    }

    hideError() {
        document.getElementById('error-message').classList.add('hidden');
    }

    showLoading(show) {
        document.getElementById('loading').classList.toggle('hidden', !show);
    }
    
    // VSCode integration
    openInVSCode(projectName) {
        const project = this.projects.find(p => this.getProjectDisplayName(p.name) === projectName);
        if (!project) return;
        
        const realPath = project.name;
        
        // Try to open in VSCode using vscode:// protocol
        const vscodeUrl = `vscode://file/${realPath}`;
        
        // Show instructions to user
        const message = `
${t('openVSCodeInstructions') || 'VSCode打开说明'}

${t('projectPath') || '项目路径'}: ${realPath}

${t('vscodeOptions') || '打开方式'}:
1. ${t('clickLink') || '点击链接直接打开'}: ${vscodeUrl}
2. ${t('manualOpen') || '手动打开'}: ${t('copyPath') || '复制路径到剪贴板，然后在VSCode中打开'}
        `.trim();
        
        if (confirm(message + '\n\n' + (t('copyPathConfirm') || '是否复制路径到剪贴板？'))) {
            navigator.clipboard.writeText(realPath).then(() => {
                alert(t('pathCopied') || '路径已复制到剪贴板');
            }).catch(() => {
                prompt(t('manualCopy') || '请手动复制路径:', realPath);
            });
        }
        
        // Try to open VSCode
        try {
            window.open(vscodeUrl, '_blank');
        } catch (error) {
            console.warn('Failed to open VSCode:', error);
        }
    }
    
    // Session sharing functionality
    async shareSession() {
        if (!this.currentSession) return;
        
        const sessionData = await this.prepareSessionForSharing(this.currentSession);
        
        // Use GitHub Gist as primary sharing method
        this.showGistInstructions(sessionData);
    }
    
    showGistInstructions(sessionData) {
        // Create simplified modal for Gist-only sharing
        const modal = document.createElement('div');
        modal.className = 'share-modal';
        modal.innerHTML = `
            <div class="share-modal-content">
                <div class="share-modal-header">
                    <h3>🚀 ${t('shareSession') || '分享会话'}</h3>
                    <button class="close-btn" onclick="closeShareModal()">✕</button>
                </div>
                <div class="share-modal-body">
                    <div class="share-option">
                        <h4>📝 ${t('shareViaGist') || '创建Gist分享会话'}</h4>
                        <p style="color: #a1a1aa; font-size: 12px; margin-bottom: 12px;">
                            ${t('gistDescription2') || '通过GitHub Gist分享您的完整会话记录，保持原始JSONL格式，便于他人导入查看。'}
                        </p>
                        <div class="share-flow-note" style="background: #0f1f13; border: 1px solid #2a7a2a; border-radius: 4px; padding: 12px; margin: 12px 0;">
                            <strong style="color: #74d474;">💡 ${t('gistFlowTitle') || '分享流程：'}</strong>
                            <ol style="color: #74d474; font-size: 11px; margin: 8px 0 0 16px; line-height: 1.5;">
                                <li>${t('gistFlowStep1') || '点击下方按钮，会自动复制会话内容并打开GitHub'}</li>
                                <li>${t('gistFlowStep2') || '在GitHub页面创建<strong>公开Gist</strong>（重要：必须公开才能分享）'}</li>
                                <li>${t('gistFlowStep3') || '复制Gist地址，粘贴到本页面生成分享链接'}</li>
                                <li>${t('gistFlowStep4') || '分享链接给他人，点击即可直接查看会话内容'}</li>
                            </ol>
                        </div>
                        <button class="action-btn gist-btn" onclick="openGistCreation()">
                            🚀 ${t('createGist') || '开始创建Gist'}
                        </button>
                    </div>
                    <div class="share-option">
                        <h4>📥 ${t('importFromGist') || '查看他人分享的会话'}</h4>
                        <p style="color: #a1a1aa; font-size: 12px; margin-bottom: 12px;">
                            ${t('gistImportDescription2') || '输入他人分享的GitHub Gist地址，即可查看其会话内容。'}
                        </p>
                        <div class="gist-import-section">
                            <input type="text" class="gist-url-input" placeholder="${t('gistUrlPlaceholder') || '输入Gist URL...'}" id="gist-url-input">
                            <button class="action-btn gist-btn" onclick="importFromGist()">
                                📖 ${t('importGist') || '查看会话'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Store session data for modal functions (simplified)
        window.currentShareData = {
            sessionData
        };
    }
    
    async prepareSessionForSharing(session) {
        const file = await session.handle.getFile();
        const content = await file.text();
        const lines = content.trim().split('\n');
        
        const messages = [];
        for (const line of lines) {
            try {
                const record = JSON.parse(line);
                if (record.type === 'user' || record.type === 'assistant') {
                    messages.push(record);
                }
            } catch (e) {
                // Ignore parsing errors
            }
        }
        
        return {
            id: session.id,
            summary: session.summary,
            timestamp: session.timestamp,
            projectName: session.projectName,
            messages: messages,
            metadata: {
                sharedAt: new Date().toISOString(),
                sharedBy: 'Claude Code Web GUI',
                version: '1.0.0'
            }
        };
    }
    
    async shareToGist(sessionData) {
        // Prepare content and metadata
        const jsonlContent = this.sessionToJSONL(sessionData);
        
        // Analyze content for user feedback
        const contentSize = jsonlContent.length;
        const sizeInKB = Math.round(contentSize / 1024);
        const lines = jsonlContent.split('\n');
        const messageCount = lines.filter(line => {
            try {
                const parsed = JSON.parse(line);
                return parsed.type === 'user' || parsed.type === 'assistant';
            } catch (e) {
                return false;
            }
        }).length;
        
        // Copy content to clipboard first
        try {
            await navigator.clipboard.writeText(jsonlContent);
            
            // Show enhanced modal with size info
            this.showGistCreationInstructions();
            
            // Show detailed feedback about content
            let feedbackMessage = t('gistContentCopiedMessage') || `✅ Gist内容已复制到剪贴板！\n\n📊 内容统计：\n- 大小：${sizeInKB} KB\n- 消息数：${messageCount} 条`;
            feedbackMessage = feedbackMessage.replace('{{size}}', sizeInKB).replace('{{count}}', messageCount);
            
            // Check for truncation
            const truncationLine = lines.find(line => {
                try {
                    const parsed = JSON.parse(line);
                    return parsed.type === 'truncation_info';
                } catch (e) {
                    return false;
                }
            });
            
            if (truncationLine) {
                const truncationInfo = JSON.parse(truncationLine);
                const warningText = t('gistTruncatedWarning') || `\n\n⚠️ 由于Gist大小限制，已截断至前{{count}}条消息`;
                feedbackMessage += warningText.replace('{{count}}', truncationInfo.includedMessages);
            }
            
            const openingText = t('gistOpeningMessage') || '\n\n将为您打开GitHub Gist创建页面...';
            feedbackMessage += openingText;
            alert(feedbackMessage);
        } catch (err) {
            console.warn('Failed to copy to clipboard:', err);
            this.showGistCreationInstructions();
            alert(t('manualCopyGist') || '请手动复制Gist内容');
        }
        
        // Open simple GitHub Gist creation page
        const gistUrl = 'https://gist.github.com/new';
        window.open(gistUrl, '_blank');
        return gistUrl;
    }
    
    showGistCreationInstructions() {
        const modal = document.createElement('div');
        modal.className = 'share-modal gist-creation-modal';
        modal.innerHTML = `
            <div class="share-modal-content">
                <div class="share-modal-header">
                    <h3>${t('createGist') || '创建Gist'}</h3>
                    <button class="close-btn" onclick="this.closest('.share-modal').remove()">✕</button>
                </div>
                <div class="share-modal-body">
                    <div class="gist-instructions">
                        <h4>📝 ${t('gistCreationSteps') || 'Gist创建步骤'}</h4>
                        <ol style="color: #a1a1aa; font-size: 12px; margin: 12px 0; padding-left: 20px;">
                            <li>${t('gistStep1') || '在打开的GitHub页面中，粘贴已复制的内容'}</li>
                            <li>${t('gistStep2') || '为文件命名（建议使用 .jsonl 扩展名）'}</li>
                            <li>${t('gistStep3') || '添加描述（可选）'}</li>
                            <li style="background: #1a5f1a; padding: 4px 8px; border-radius: 4px; margin: 8px 0;"><strong>🌐 ${t('gistStep4Public') || '选择"Create public gist"（重要：必须选择公开以便他人访问）'}</strong></li>
                            <li>${t('gistStep5') || '复制创建的Gist URL'}</li>
                        </ol>
                        <div class="share-public-reminder" style="background: #0f1f13; border: 1px solid #2a7a2a; border-radius: 4px; padding: 12px; margin: 12px 0;">
                            <strong style="color: #74d474;">🔑 ${t('publicGistReminder') || '重要提醒'}：</strong>
                            <p style="color: #74d474; font-size: 11px; margin: 8px 0 0 0;">${t('publicGistReminderText') || '只有公开的Gist才能被他人通过分享链接直接访问和查看。如果创建私有Gist，其他人将无法看到会话内容。'}</p>
                        </div>
                        <div class="gist-url-section">
                            <h4>🔗 ${t('shareGistUrl') || '分享Gist URL'}</h4>
                            <p style="color: #a1a1aa; font-size: 12px; margin-bottom: 12px;">${t('shareGistUrlDesc') || '创建Gist后，将URL粘贴到下方进行社交媒体分享'}</p>
                            <div class="gist-url-input-section">
                                <input type="text" id="created-gist-url" placeholder="${t('pasteGistUrl') || '粘贴创建的Gist URL...'}" 
                                       style="flex: 1; background: #262626; border: 1px solid #3f3f46; color: #ffffff; padding: 8px 10px; border-radius: 4px; font-size: 12px; font-family: inherit; margin-bottom: 12px; width: 100%;">
                                <div class="social-share-buttons" style="display: flex; gap: 8px; justify-content: center;">
                                    <button class="action-btn twitter-share" onclick="shareGistToTwitter()" style="background: #1d9bf0 !important; border-color: #1d9bf0 !important; color: #ffffff !important;">
                                        <span>𝕏</span>
                                        <span>${t('shareToX') || '分享到X'}</span>
                                    </button>
                                    <button class="action-btn" onclick="copyGistImportLink()">
                                        <span>📋</span>
                                        <span>${t('copyImportLink') || '复制导入链接'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Export functionality (keep this)
    async exportSession() {
        if (!this.currentSession) return;
        
        const sessionData = await this.prepareSessionForSharing(this.currentSession);
        const markdown = this.sessionToMarkdown(sessionData);
        
        // Create and download file
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `session-${sessionData.id}-${sessionData.summary.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '-')}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }
    
    // Gist import functionality
    async importFromGist(gistUrl) {
        if (!gistUrl) return;
        
        try {
            // Extract gist ID from URL
            const gistId = this.extractGistId(gistUrl);
            if (!gistId) {
                alert(t('invalidGistUrl') || '无效的Gist URL');
                return;
            }
            
            // Fetch gist content
            const gistData = await this.fetchGistContent(gistId);
            if (!gistData) {
                alert(t('gistFetchFailed') || '获取Gist内容失败');
                return;
            }
            
            // Display the imported session
            this.displayImportedGist(gistData);
            
        } catch (error) {
            console.error('Failed to import gist:', error);
            
            // Show user-friendly error with options
            const errorMessage = error.message;
            if (errorMessage.includes('无法自动获取') || errorMessage.includes('fallback')) {
                this.showGistImportHelp(gistUrl);
            } else {
                alert(t('gistImportError') || 'Gist导入失败：' + errorMessage);
            }
        }
    }
    
    extractGistId(url) {
        // Support various gist URL formats
        const patterns = [
            /gist\.github\.com\/[^\/]+\/([a-f0-9]+)/,
            /gist\.github\.com\/([a-f0-9]+)/,
            /^([a-f0-9]+)$/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                return match[1];
            }
        }
        return null;
    }
    
    async fetchGistContent(gistId) {
        try {
            // Try GitHub API first
            const response = await fetch(`https://api.github.com/gists/${gistId}`);
            
            if (response.ok) {
                const gist = await response.json();
                
                // Find the session file (now look for JSONL format first, then fall back to markdown)
                const files = Object.values(gist.files);
                let sessionFile = files.find(file => 
                    file.filename.endsWith('.jsonl') || 
                    file.type === 'text/plain' ||
                    file.filename.toLowerCase().includes('session') ||
                    file.filename.toLowerCase().includes('claude')
                );
                
                // If no JSONL file found, look for markdown files for backward compatibility
                if (!sessionFile) {
                    sessionFile = files.find(file => 
                        file.filename.endsWith('.md') || 
                        file.type === 'text/markdown' ||
                        file.filename.toLowerCase().includes('conversation')
                    );
                }
                
                if (!sessionFile) {
                    throw new Error(t('noSessionFileInGist') || 'Gist中未找到会话文件');
                }
                
                return {
                    id: gistId,
                    title: gist.description || sessionFile.filename,
                    content: sessionFile.content,
                    url: gist.html_url,
                    created: gist.created_at,
                    updated: gist.updated_at,
                    isJSONL: sessionFile.filename.endsWith('.jsonl') || sessionFile.type === 'text/plain'
                };
            } else if (response.status === 403) {
                // Rate limit exceeded, try fallback method
                console.warn('GitHub API rate limit exceeded, trying fallback method');
                // Show user feedback about rate limiting
                const tempMessage = document.createElement('div');
                tempMessage.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #18181b; border: 1px solid #27272a; color: #a1a1aa; padding: 8px 12px; border-radius: 6px; font-size: 12px; z-index: 1001;';
                tempMessage.textContent = t('gistRateLimited') || 'GitHub API频率限制，使用备用方法...';
                document.body.appendChild(tempMessage);
                setTimeout(() => tempMessage.remove(), 3000);
                
                return await this.fetchGistContentFallback(gistId);
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            if (error.message.includes('rate limit') || error.message.includes('403')) {
                console.warn('GitHub API unavailable, trying fallback method');
                return await this.fetchGistContentFallback(gistId);
            }
            throw error;
        }
    }
    
    async fetchGistContentFallback(gistId) {
        // Fallback: Try common raw URLs for session files
        const commonFilenames = [
            'session.jsonl',
            'claude-session.jsonl', 
            'conversation.jsonl',
            'chat.jsonl',
            'session.md',
            'claude-session.md', 
            'conversation.md',
            'chat.md',
            'README.md',
            'session-export.md'
        ];
        
        // Try to fetch content directly from raw URLs
        for (const filename of commonFilenames) {
            try {
                const rawUrl = `https://gist.githubusercontent.com/${gistId}/raw/${filename}`;
                const response = await fetch(rawUrl);
                
                if (response.ok) {
                    const content = await response.text();
                    return {
                        id: gistId,
                        title: filename,
                        content: content,
                        url: `https://gist.github.com/${gistId}`,
                        created: new Date().toISOString(),
                        updated: new Date().toISOString(),
                        isJSONL: filename.endsWith('.jsonl')
                    };
                }
            } catch (error) {
                continue; // Try next filename
            }
        }
        
        // If common filenames don't work, show user instructions
        throw new Error(t('gistFallbackInstructions') || 
            '无法自动获取Gist内容。请:\\n1. 打开Gist页面\\n2. 点击"Raw"按钮\\n3. 复制URL中的完整路径\\n4. 或者直接复制文件内容到剪贴板');
    }
    
    showGistImportHelp(gistUrl) {
        const modal = document.createElement('div');
        modal.className = 'share-modal';
        modal.innerHTML = `
            <div class="share-modal-content">
                <div class="share-modal-header">
                    <h3>${t('gistImportHelp') || 'Gist导入帮助'}</h3>
                    <button class="close-btn" onclick="this.closest('.share-modal').remove()">✕</button>
                </div>
                <div class="share-modal-body">
                    <div class="share-option">
                        <h4>🔧 ${t('manualImport') || '手动导入'}</h4>
                        <p>${t('manualImportDescription') || '如果自动导入失败，您可以手动复制Gist内容'}</p>
                        <ol style="color: #a1a1aa; font-size: 12px; margin: 12px 0; padding-left: 20px;">
                            <li>${t('openGistPage') || '打开Gist页面'}: <a href="${gistUrl}" target="_blank" style="color: #667eea;">${gistUrl}</a></li>
                            <li>${t('copyGistContent') || '复制文件内容'}</li>
                            <li>${t('pasteContentBelow') || '将内容粘贴到下方文本框'}</li>
                        </ol>
                        <textarea id="manual-gist-content" placeholder="${t('pasteGistContent') || '粘贴Gist内容...'}" 
                                  style="width: 100%; height: 200px; background: #262626; border: 1px solid #3f3f46; color: #ffffff; padding: 8px; border-radius: 4px; font-family: inherit; font-size: 12px; resize: vertical;"></textarea>
                        <button class="action-btn" onclick="importManualGistContent()" style="margin-top: 12px;">
                            ${t('importContent') || '导入内容'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    updateMetaTagsForSession(sessionData) {
        // Update page title
        document.title = `${sessionData.title} - Claude Code Web GUI`;
        
        // Get current URL for sharing
        const currentUrl = window.location.href;
        
        // Extract first user message for description
        let description = t('smartDescription') || '🚀 Claude Code 智能编程会话分享';
        if (sessionData.msgs && sessionData.msgs.length > 0) {
            const firstUserMsg = sessionData.msgs.find(msg => msg.type === 'user');
            if (firstUserMsg && firstUserMsg.content) {
                const contentPreview = firstUserMsg.content.substring(0, 100);
                const sharingText = t('sessionSharing') || '💬 "{{content}}" - Claude Code 会话分享';
                description = sharingText.replace('{{content}}', contentPreview + (contentPreview.length >= 100 ? '...' : ''));
            }
        }
        
        // Update or create meta tags
        this.updateMetaTag('description', description);
        
        // Open Graph tags
        const titleText = t('sessionTitle') || '{{title}} - Claude Code 会话';
        this.updateMetaTag('og:title', titleText.replace('{{title}}', sessionData.title));
        this.updateMetaTag('og:description', description);
        this.updateMetaTag('og:url', currentUrl);
        this.updateMetaTag('og:type', 'article');
        
        // Twitter Card tags
        this.updateMetaTag('twitter:title', titleText.replace('{{title}}', sessionData.title));
        this.updateMetaTag('twitter:description', description);
        this.updateMetaTag('twitter:url', currentUrl);
        
        // Add session-specific info
        const infoText = t('projectInfo2') || '📊 项目: {{project}} | 时间: {{time}}';
        const sessionInfo = infoText
            .replace('{{project}}', sessionData.projectName || 'Unknown')
            .replace('{{time}}', new Date(sessionData.timestamp).toLocaleDateString());
        this.updateMetaTag('og:article:author', 'Claude Code Web GUI');
        this.updateMetaTag('og:article:section', sessionInfo);
    }
    
    updateMetaTag(property, content) {
        // Handle different meta tag types
        let selector;
        let attributeName;
        
        if (property.startsWith('og:') || property === 'article:author' || property === 'article:section') {
            selector = `meta[property="${property}"]`;
            attributeName = 'property';
        } else if (property.startsWith('twitter:')) {
            selector = `meta[name="${property}"]`;
            attributeName = 'name';
        } else {
            selector = `meta[name="${property}"]`;
            attributeName = 'name';
        }
        
        let metaTag = document.querySelector(selector);
        
        if (metaTag) {
            metaTag.setAttribute('content', content);
        } else {
            // Create new meta tag if it doesn't exist
            metaTag = document.createElement('meta');
            metaTag.setAttribute(attributeName, property);
            metaTag.setAttribute('content', content);
            document.head.appendChild(metaTag);
        }
    }
    
    displayImportedGist(gistData) {
        // Update page meta tags for Gist sharing
        this.updateMetaTagsForGist(gistData);
        
        // Hide header and show imported session
        document.getElementById('header').classList.add('collapsed');
        document.getElementById('main-layout').classList.remove('hidden');
        
        // Hide language toggle when viewing imported gist
        this.hideLangToggle();
        
        // Hide sidebar for imported content
        document.getElementById('sidebar').classList.add('collapsed');
        
        // Update title
        document.getElementById('main-title').textContent = `📥 ${gistData.title}`;
        
        // Show imported indicator
        const importedIndicator = document.createElement('div');
        importedIndicator.className = 'imported-indicator';
        importedIndicator.innerHTML = `
            <span>📥</span>
            <span>${t('importedFromGist') || '从Gist导入'}</span>
            <a href="${gistData.url}" target="_blank" class="gist-link">
                <span>🔗</span>
                <span>${t('viewOnGitHub') || '在GitHub查看'}</span>
            </a>
        `;
        
        // Clear existing indicators
        const existingIndicator = document.querySelector('.imported-indicator');
        if (existingIndicator) existingIndicator.remove();
        
        document.querySelector('.main-header').appendChild(importedIndicator);
        
        // Display content
        this.renderImportedContent(gistData);
        
        // Show action buttons
        const actionsDiv = document.getElementById('session-actions');
        actionsDiv.style.display = 'flex';
        
        // Add back to app button
        const backBtn = document.createElement('button');
        backBtn.className = 'action-btn';
        backBtn.innerHTML = `
            <span>⬅️</span>
            <span>${t('backToApp') || '返回应用'}</span>
        `;
        backBtn.onclick = () => this.returnToHomepage();
        
        // Add share to X button
        const shareBtn = document.createElement('button');
        shareBtn.className = 'action-btn twitter-share';
        shareBtn.innerHTML = `
            <span>𝕏</span>
            <span>${t('shareToX') || '分享到X'}</span>
        `;
        shareBtn.onclick = () => this.shareGistToX(gistData);

        actionsDiv.innerHTML = '';
        actionsDiv.appendChild(backBtn);
        actionsDiv.appendChild(shareBtn);
    }
    
    renderImportedContent(gistData) {
        const container = document.getElementById('chat-messages');
        container.innerHTML = '';
        
        // Add gist info header
        const infoDiv = document.createElement('div');
        infoDiv.className = 'imported-gist-info';
        infoDiv.innerHTML = `
            <h2>📥 ${gistData.title}</h2>
            <p><strong>${t('gistId') || 'Gist ID'}:</strong> ${gistData.id}</p>
            <p><strong>${t('created') || '创建时间'}:</strong> ${new Date(gistData.created).toLocaleString()}</p>
            <p><strong>${t('updated') || '更新时间'}:</strong> ${new Date(gistData.updated).toLocaleString()}</p>
            <p><strong>${t('format') || '格式'}:</strong> ${gistData.isJSONL ? 'JSONL (原始格式)' : 'Markdown'}</p>
            <p><a href="${gistData.url}" target="_blank" style="color: #667eea;">${t('viewOnGitHub') || '在GitHub查看'}</a></p>
            <hr style="margin: 20px 0; border: 1px solid #262626;">
        `;
        container.appendChild(infoDiv);
        
        // Render content based on format
        if (gistData.isJSONL) {
            this.renderJSONLContent(gistData.content, container);
        } else {
            // Render as markdown (legacy format)
            const contentDiv = document.createElement('div');
            contentDiv.className = 'imported-content';
            contentDiv.innerHTML = `<pre class="markdown-content">${gistData.content}</pre>`;
            container.appendChild(contentDiv);
        }
        
        // Add footer
        const footerDiv = document.createElement('div');
        footerDiv.className = 'imported-gist-footer';
        footerDiv.innerHTML = `
            <p><em>${t('importedNote') || '这是从GitHub Gist导入的会话内容'}</em></p>
            <p><a href="${window.location.origin}${window.location.pathname}" style="color: #667eea;">${t('backToApp') || '返回应用'}</a></p>
        `;
        container.appendChild(footerDiv);
    }
    
    renderJSONLContent(jsonlContent, container) {
        const lines = jsonlContent.trim().split('\n');
        let sessionInfo = null;
        const messages = [];
        
        // Parse JSONL content
        for (const line of lines) {
            try {
                const record = JSON.parse(line);
                if (record.type === 'session_info') {
                    sessionInfo = record;
                } else if (record.type === 'user' || record.type === 'assistant') {
                    messages.push(record);
                }
            } catch (e) {
                console.warn('Failed to parse JSONL line:', line);
            }
        }
        
        // Show session info if available
        if (sessionInfo) {
            const sessionInfoDiv = document.createElement('div');
            sessionInfoDiv.className = 'imported-session-info';
            sessionInfoDiv.innerHTML = `
                <h3>📄 ${t('sessionInfo') || '会话信息'}</h3>
                <p><strong>${t('sessionIdLabel') || '会话ID:'}:</strong> ${sessionInfo.id}</p>
                <p><strong>${t('summaryLabel') || '摘要:'}:</strong> ${sessionInfo.summary}</p>
                <p><strong>${t('projectLabel') || '项目:'}:</strong> ${sessionInfo.projectName?.replace(/-/g, '/') || 'Unknown'}</p>
                <p><strong>${t('timeLabel') || '时间:'}:</strong> ${new Date(sessionInfo.timestamp).toLocaleString()}</p>
                <p><strong>${t('sharedTimeLabel') || '分享时间:'}:</strong> ${new Date(sessionInfo.sharedAt).toLocaleString()}</p>
                <hr style="margin: 16px 0; border: 1px solid #262626;">
            `;
            container.appendChild(sessionInfoDiv);
        }
        
        // Render messages in chat format
        if (messages.length > 0) {
            const messagesDiv = document.createElement('div');
            messagesDiv.className = 'imported-messages';
            
            messages.forEach(record => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${record.type}`;
                
                const avatar = document.createElement('div');
                avatar.className = 'message-avatar';
                
                if (record.type === 'user') {
                    avatar.textContent = 'U';
                } else {
                    avatar.innerHTML = `<img src="assets/icons/claude-avatar.svg" class="claude-avatar-svg" alt="Claude">`;
                }
                
                const content = document.createElement('div');
                content.className = 'message-content';
                
                if (record.type === 'user') {
                    const textDiv = document.createElement('div');
                    textDiv.className = 'message-text';
                    
                    let messageContent = '';
                    if (typeof record.message.content === 'string') {
                        messageContent = record.message.content;
                    } else if (Array.isArray(record.message.content)) {
                        messageContent = record.message.content
                            .filter(item => item.type === 'text')
                            .map(item => item.text)
                            .join('\n');
                    } else if (record.message.content && record.message.content.text) {
                        messageContent = record.message.content.text;
                    } else {
                        messageContent = JSON.stringify(record.message.content);
                    }
                    
                    textDiv.textContent = messageContent;
                    content.appendChild(textDiv);
                } else if (record.type === 'assistant') {
                    const message = record.message;
                    if (message.content) {
                        message.content.forEach(item => {
                            if (item.type === 'text') {
                                const textDiv = document.createElement('div');
                                textDiv.className = 'message-text';
                                textDiv.textContent = item.text;
                                content.appendChild(textDiv);
                            } else if (item.type === 'tool_use') {
                                const toolDiv = document.createElement('div');
                                toolDiv.className = 'tool-call';
                                
                                const toolId = `tool-${Date.now()}-${Math.random()}`;
                                
                                toolDiv.innerHTML = `
                                    <div class="tool-call-header" onclick="toggleToolParams('${toolId}')">
                                        <div class="tool-call-icon">🔧</div>
                                        <span>${t('toolCall') || '工具调用'}: ${item.name}</span>
                                        <div class="tool-toggle">▼</div>
                                    </div>
                                    <div class="tool-call-content collapsed" id="${toolId}">
                                        <div>${t('parametersLabel') || '参数:'}:</div>
                                        <pre class="tool-call-input">${JSON.stringify(item.input, null, 2)}</pre>
                                    </div>
                                `;
                                content.appendChild(toolDiv);
                            }
                        });
                    }
                }
                
                // Add timestamp
                if (record.timestamp) {
                    const timestamp = document.createElement('div');
                    timestamp.className = 'timestamp';
                    timestamp.textContent = new Date(record.timestamp).toLocaleString();
                    content.appendChild(timestamp);
                }
                
                messageDiv.appendChild(avatar);
                messageDiv.appendChild(content);
                messagesDiv.appendChild(messageDiv);
            });
            
            container.appendChild(messagesDiv);
        }
    }
    
    updateMetaTagsForGist(gistData) {
        // Update page title
        document.title = `${gistData.title} - ${t('gistViewTitle') || 'Claude Code Gist 查看'}`;
        
        // Create description for Gist
        const descriptionTemplate = t('gistViewDescription') || '📋 从 GitHub Gist 导入的 Claude Code 会话："{{title}}" - 在线查看和学习 AI 编程对话';
        const description = descriptionTemplate.replace('{{title}}', gistData.title);
        
        // Get current URL
        const currentUrl = window.location.href;
        
        // Update meta tags
        this.updateMetaTag('description', description);
        
        // Open Graph tags
        this.updateMetaTag('og:title', `${gistData.title} - Claude Code Gist`);
        this.updateMetaTag('og:description', description);
        this.updateMetaTag('og:url', currentUrl);
        this.updateMetaTag('og:type', 'article');
        
        // Twitter Card tags  
        this.updateMetaTag('twitter:title', `${gistData.title} - Claude Code Gist`);
        this.updateMetaTag('twitter:description', description);
        this.updateMetaTag('twitter:url', currentUrl);
        
        // Add Gist-specific info
        const infoTemplate = t('gistCreationInfo') || '📅 创建: {{date}} | 格式: {{format}}';
        const gistInfo = infoTemplate
            .replace('{{date}}', new Date(gistData.created).toLocaleDateString())
            .replace('{{format}}', gistData.isJSONL ? 'JSONL' : 'Markdown');
        this.updateMetaTag('og:article:author', 'Claude Code Web GUI');
        this.updateMetaTag('og:article:section', gistInfo);
    }
    
    shareGistToX(gistData) {
        const text = `🚀 Check out this Claude Code session from GitHub Gist: "${gistData.title}"`;
        const hashtags = 'ClaudeCode,AI,Programming,Gist';
        
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(gistData.url)}&hashtags=${hashtags}`;
        window.open(twitterUrl, '_blank');
    }
    
    sessionToJSONL(sessionData) {
        let jsonlContent = '';
        
        // Add session metadata as the first line
        const metadata = {
            type: 'session_info',
            id: sessionData.id,
            summary: sessionData.summary,
            timestamp: sessionData.timestamp,
            projectName: sessionData.projectName,
            sharedAt: new Date().toISOString(),
            sharedBy: 'Claude Code Web GUI',
            version: '1.0.0'
        };
        jsonlContent += JSON.stringify(metadata) + '\n';
        
        // Gist has a size limit, so we need to be careful about content size
        const MAX_GIST_SIZE = 900000; // ~900KB limit for safety (GitHub limit is 1MB)
        let currentSize = jsonlContent.length;
        let includedMessages = 0;
        
        // Add messages in order, but stop if we approach size limit
        for (const msg of sessionData.messages) {
            const msgLine = JSON.stringify(msg) + '\n';
            
            // Check if adding this message would exceed the limit
            if (currentSize + msgLine.length > MAX_GIST_SIZE) {
                console.warn(`Gist size limit approaching. Included ${includedMessages} of ${sessionData.messages.length} messages.`);
                break;
            }
            
            jsonlContent += msgLine;
            currentSize += msgLine.length;
            includedMessages++;
        }
        
        // Add truncation notice if messages were excluded
        if (includedMessages < sessionData.messages.length) {
            const truncationNotice = {
                type: 'truncation_info',
                message: `Note: This Gist contains ${includedMessages} of ${sessionData.messages.length} messages due to size limitations.`,
                totalMessages: sessionData.messages.length,
                includedMessages: includedMessages,
                truncatedAt: new Date().toISOString()
            };
            jsonlContent += JSON.stringify(truncationNotice) + '\n';
        }
        
        console.log(`Gist content prepared: ${jsonlContent.length} bytes, ${includedMessages}/${sessionData.messages.length} messages`);
        return jsonlContent;
    }
    
    sessionToMarkdown(sessionData) {
        let markdown = `# ${sessionData.summary}\n\n`;
        markdown += `**项目**: ${sessionData.projectName.replace(/-/g, '/')}\n`;
        markdown += `**时间**: ${new Date(sessionData.timestamp).toLocaleString()}\n`;
        markdown += `**会话ID**: ${sessionData.id}\n\n`;
        markdown += `---\n\n`;
        
        sessionData.messages.forEach((msg, index) => {
            const sender = msg.type === 'user' ? '👤 **用户**' : '🤖 **Claude**';
            markdown += `## ${sender}\n\n`;
            
            if (msg.type === 'user') {
                let content = '';
                if (typeof msg.message.content === 'string') {
                    content = msg.message.content;
                } else if (Array.isArray(msg.message.content)) {
                    content = msg.message.content
                        .filter(item => item.type === 'text')
                        .map(item => item.text)
                        .join('\n');
                }
                markdown += `${content}\n\n`;
            } else if (msg.type === 'assistant') {
                if (msg.message.content) {
                    msg.message.content.forEach(item => {
                        if (item.type === 'text') {
                            markdown += `${item.text}\n\n`;
                        } else if (item.type === 'tool_use') {
                            markdown += `### 🔧 工具调用: ${item.name}\n\n`;
                            markdown += '```json\n';
                            markdown += JSON.stringify(item.input, null, 2);
                            markdown += '\n```\n\n';
                        }
                    });
                }
            }
            
            markdown += `---\n\n`;
        });
        
        markdown += `\n*分享时间: ${new Date().toLocaleString()}*\n`;
        markdown += `*由 Claude Code Web GUI 生成*`;
        
        return markdown;
    }
    
    // Unicode-safe base64 decoding (keep for backwards compatibility and Gist import)
    base64ToUnicode(str) {
        try {
            console.log('Decoding input length:', str.length);
            console.log('Input sample:', str.substring(0, 50));
            
            // Clean the string
            let cleanStr = str.replace(/\s/g, ''); // Remove whitespace
            
            // Check if this looks like base64
            const isBase64 = /^[A-Za-z0-9+/]*={0,2}$/.test(cleanStr);
            
            if (!isBase64) {
                console.log('Not base64 format, treating as URL encoded');
                return decodeURIComponent(cleanStr);
            }
            
            // Add padding if needed
            const paddingNeeded = (4 - (cleanStr.length % 4)) % 4;
            if (paddingNeeded > 0) {
                cleanStr += '='.repeat(paddingNeeded);
                console.log('Added padding:', paddingNeeded);
            }
            
            // Try to decode base64
            const decoded = atob(cleanStr);
            console.log('Base64 decode successful, length:', decoded.length);
            
            // Check if the decoded content starts with % (indicating URL encoding)
            if (decoded.startsWith('%')) {
                console.log('Detected URL-encoded content, decoding directly');
                try {
                    const directResult = decodeURIComponent(decoded);
                    JSON.parse(directResult);
                    return directResult;
                } catch (e) {
                    console.log('Direct URL decode failed:', e.message);
                }
            }
            
            // Try UTF-8 decoding for Unicode content
            try {
                const utf8Result = decodeURIComponent(Array.prototype.map.call(decoded, (c) => {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                
                console.log('UTF-8 decode successful');
                
                // Validate that it's valid JSON
                JSON.parse(utf8Result);
                return utf8Result;
            } catch (utf8Error) {
                console.log('UTF-8 decode failed, trying plain decode:', utf8Error.message);
                
                // Fallback: check if it's plain ASCII JSON
                try {
                    JSON.parse(decoded);
                    console.log('Using plain JSON');
                    return decoded;
                } catch (jsonError) {
                    console.log('Plain JSON parse failed:', jsonError.message);
                    throw utf8Error;
                }
            }
            
        } catch (error) {
            console.error('Base64 decode failed:', error);
            throw new Error(`Failed to decode: ${error.message}`);
        }
    }
    
    // Return to homepage functionality
    returnToHomepage() {
        // Clear URL hash to prevent returning to shared session
        if (window.location.hash) {
            window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
        }
        
        // Reset meta tags to default
        this.resetMetaTags();
        
        // Hide main layout
        document.getElementById("main-layout").classList.add("hidden");
        
        // Show header
        document.getElementById("header").classList.remove("collapsed");
        
        // Show language toggle when returning to homepage
        this.showLangToggle();
        
        // Clear current session
        this.currentSession = null;
        
        // Reset app state
        this.directoryHandle = null;
        this.projects = [];
        this.allSessions = [];
        this.filteredSessions = [];
        
        // Hide loading and errors
        this.hideError();
        this.showLoading(false);
        
        // Hide FAB button
        const fabContainer = document.getElementById("fab-container");
        if (fabContainer) {
            fabContainer.classList.remove("visible");
        }
    }
    
    resetMetaTags() {
        // Reset page title
        document.title = 'Claude Code Web GUI';
        
        // Reset description
        this.updateMetaTag('description', t('defaultMetaDescription') || '一个简洁实用的 Claude Code 会话浏览器，完全在浏览器中运行，支持本地浏览、便捷分享、导入查看等功能。');
        
        // Reset Open Graph tags
        this.updateMetaTag('og:title', t('defaultOgTitle') || 'Claude Code Web GUI - 智能代码会话浏览器');
        this.updateMetaTag('og:description', t('defaultOgDescription') || '🚀 完全在浏览器中运行的 Claude Code 会话浏览器，支持本地浏览、便捷分享、隐私保护。无需服务器，开箱即用！');
        this.updateMetaTag('og:url', 'https://binggg.github.io/Claude-Code-Web-GUI/');
        this.updateMetaTag('og:type', 'website');
        
        // Reset Twitter Card tags
        this.updateMetaTag('twitter:title', t('defaultOgTitle') || 'Claude Code Web GUI - 智能代码会话浏览器');
        this.updateMetaTag('twitter:description', t('defaultOgDescription') || '🚀 完全在浏览器中运行的 Claude Code 会话浏览器，支持本地浏览、便捷分享、隐私保护。无需服务器，开箱即用！');
        this.updateMetaTag('twitter:url', 'https://binggg.github.io/Claude-Code-Web-GUI/');
        
        // Remove article-specific meta tags
        const articleAuthor = document.querySelector('meta[property="og:article:author"]');
        const articleSection = document.querySelector('meta[property="og:article:section"]');
        if (articleAuthor) articleAuthor.remove();
        if (articleSection) articleSection.remove();
    }
    
    // FAB button controls
    showFabButton() {
        const fabContainer = document.getElementById("fab-container");
        if (fabContainer) {
            fabContainer.classList.add("visible");
        }
    }
    
    hideFabButton() {
        const fabContainer = document.getElementById("fab-container");
        if (fabContainer) {
            fabContainer.classList.remove("visible");
        }
    }
    
    // Language toggle controls
    showLangToggle() {
        const langToggle = document.querySelector(".language-toggle");
        if (langToggle) {
            langToggle.style.display = "flex";
        }
    }
    
    hideLangToggle() {
        const langToggle = document.querySelector(".language-toggle");
        if (langToggle) {
            langToggle.style.display = "none";
        }
    }
}

// Initialize app
window.claudeGUI = new ClaudeCodeGUI();

// Global functions for HTML onclick handlers
window.returnToHomepage = () => window.claudeGUI.returnToHomepage();
window.toggleSidebar = () => window.claudeGUI.toggleSidebar();
window.requestDirectoryAccess = () => window.claudeGUI.requestDirectoryAccess();
window.filterSessions = () => window.claudeGUI.filterSessions();
window.shareSession = () => window.claudeGUI.shareSession();
window.exportSession = () => window.claudeGUI.exportSession();
window.openInVSCode = (projectName) => window.claudeGUI.openInVSCode(projectName);
window.closeShareModal = () => {
    const modal = document.querySelector('.share-modal');
    if (modal) modal.remove();
};
window.openGistCreation = () => {
    if (window.currentShareData) {
        window.claudeGUI.shareToGist(window.currentShareData.sessionData);
        // Don't close modal - let user handle Gist creation and return
    }
};
window.downloadMarkdown = () => {
    if (window.currentShareData) {
        window.claudeGUI.exportSession();
        window.closeShareModal();
    }
};
window.copyMarkdownToClipboard = async () => {
    if (window.currentShareData) {
        try {
            await navigator.clipboard.writeText(window.currentShareData.markdown);
            alert(t('markdownCopied') || 'Markdown内容已复制到剪贴板');
        } catch (err) {
            prompt(t('manualCopy') || '请手动复制:', window.currentShareData.markdown);
        }
        window.closeShareModal();
    }
};
window.importManualGistContent = () => {
    const content = document.getElementById('manual-gist-content').value.trim();
    if (!content) {
        alert(t('pleaseEnterContent') || '请输入内容');
        return;
    }
    
    // Try to detect if content is JSONL format
    const isJSONL = content.split('\n').some(line => {
        try {
            const parsed = JSON.parse(line.trim());
            return parsed.type === 'session_info' || parsed.type === 'user' || parsed.type === 'assistant';
        } catch (e) {
            return false;
        }
    });
    
    const gistData = {
        id: 'manual-import',
        title: isJSONL ? '手动导入的JSONL会话' : '手动导入的内容', 
        content: content,
        url: '#manual-import',
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        isJSONL: isJSONL
    };
    
    // Close the modal
    document.querySelector('.share-modal').remove();
    
    // Display the content
    window.claudeGUI.displayImportedGist(gistData);
};
window.importFromGist = async () => {
    const gistUrl = document.getElementById('gist-url-input').value.trim();
    if (!gistUrl) {
        alert(t('pleaseEnterGistUrl') || '请输入Gist URL');
        return;
    }
    
    window.closeShareModal();
    
    // Show loading
    document.getElementById('loading').classList.remove('hidden');
    
    try {
        await window.claudeGUI.importFromGist(gistUrl);
    } catch (error) {
        console.error('Import failed:', error);
    } finally {
        document.getElementById('loading').classList.add('hidden');
    }
};
window.toggleChatInput = () => {
    const inputContainer = document.querySelector('.chat-input-container');
    if (inputContainer) {
        // Toggle the visibility of the input container
        inputContainer.classList.toggle('visible');
        
        // Show notification about feature availability only on first show
        if (inputContainer.classList.contains('visible')) {
            // Show a subtle notification that this feature is not yet available
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #18181b;
                border: 1px solid #27272a;
                color: #a1a1aa;
                padding: 12px 16px;
                border-radius: 6px;
                font-size: 12px;
                z-index: 1001;
                transition: opacity 0.3s ease;
            `;
            notification.textContent = t('chatInputDisabledTooltip') || '当前版本不支持直接在页面中与Claude对话';
            document.body.appendChild(notification);
            
            // Auto-remove notification after 3 seconds
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    }
};
window.toggleToolParams = (toolId) => {
    const content = document.getElementById(toolId);
    const header = content.previousElementSibling;
    const toggle = header.querySelector('.tool-toggle');
    
    content.classList.toggle('collapsed');
    toggle.textContent = content.classList.contains('collapsed') ? '▼' : '▲';
};

window.shareGistToTwitter = () => {
    const gistUrl = document.getElementById('created-gist-url').value.trim();
    if (!gistUrl) {
        alert(t('pleaseEnterGistUrl') || '请输入Gist URL');
        return;
    }
    
    // Generate import link for this app
    const appUrl = window.location.origin + window.location.pathname;
    const importUrl = `${appUrl}#import=${encodeURIComponent(gistUrl)}`;
    
    const text = `🚀 Check out this Claude Code session! Click to import and view in your browser:`;
    const hashtags = 'ClaudeCode,AI,Programming,OpenSource';
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(importUrl)}&hashtags=${hashtags}`;
    window.open(twitterUrl, '_blank');
    
    // Close the modal
    document.querySelector('.gist-creation-modal').remove();
};

window.copyGistImportLink = () => {
    const gistUrl = document.getElementById('created-gist-url').value.trim();
    if (!gistUrl) {
        alert(t('pleaseEnterGistUrl') || '请输入Gist URL');
        return;
    }
    
    // Generate import link for this app
    const appUrl = window.location.origin + window.location.pathname;
    const importUrl = `${appUrl}#import=${encodeURIComponent(gistUrl)}`;
    
    navigator.clipboard.writeText(importUrl).then(() => {
        alert(t('importLinkCopied') || '导入链接已复制到剪贴板！用户点击该链接即可直接导入Gist会话');
    }).catch(() => {
        prompt(t('manualCopy') || '请手动复制链接:', importUrl);
    });
    
    // Close the modal
    document.querySelector('.gist-creation-modal').remove();
};



window.shareSessionToX = () => {
    // Get current shared session data from URL
    const hash = window.location.hash;
    const currentUrl = window.location.href;
    
    let sessionTitle = t('claudeCodeSession') || 'Claude Code会话';
    
    // Try to extract session title from the page
    const titleElement = document.getElementById('main-title');
    if (titleElement && titleElement.textContent.includes('📤')) {
        sessionTitle = titleElement.textContent.replace('📤 ', '');
    }
    
    const tweetTemplate = t('viewThisSession') || '🚀 查看这个Claude Code会话："{{title}}"';
    const text = tweetTemplate.replace('{{title}}', sessionTitle);
    const hashtags = 'ClaudeCode,AI,Programming,CodeSession';
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}&hashtags=${hashtags}`;
    window.open(twitterUrl, '_blank');
};


// Add global function for homepage Gist import
window.openGistImportDialog = () => {
    // Create modal for Gist import from homepage
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
        <div class="share-modal-content">
            <div class="share-modal-header">
                <h3>🌐 ${t('viewSharedSessions') || '查看他人分享的会话'}</h3>
                <button class="close-btn" onclick="closeShareModal()">✕</button>
            </div>
            <div class="share-modal-body">
                <div class="share-option">
                    <h4>📖 ${t('gistAddressInput') || '输入Gist地址'}</h4>
                    <p style="color: #a1a1aa; font-size: 12px; margin-bottom: 12px;">
                        ${t('gistImportDescription2') || '输入他人分享的GitHub Gist地址，即可查看其会话内容。支持完整URL或Gist ID。'}
                    </p>
                    <div class="gist-import-examples" style="background: #13141a; border: 1px solid #3f3f46; border-radius: 4px; padding: 10px; margin: 12px 0;">
                        <small style="color: #60a5fa;">${t('supportedFormats') || '💡 支持的格式：'}</small>
                        <ul style="color: #71717a; font-size: 11px; margin: 6px 0 0 16px; line-height: 1.4;">
                            <li>${t('fullUrlFormat') || '完整URL：https://gist.github.com/username/abc123...'}</li>
                            <li>${t('gistIdFormat') || 'Gist ID：abc123def456...'}</li>
                        </ul>
                    </div>
                    <div class="gist-import-section">
                        <input type="text" class="gist-url-input" placeholder="${t('gistUrlOrIdPlaceholder') || '输入Gist URL或ID...'}" id="homepage-gist-input" style="width: 100%; margin-bottom: 12px;">
                        <button class="action-btn gist-btn" onclick="importFromHomepage()" style="width: 100%;">
                            🚀 ${t('viewSession') || '查看会话'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
};

window.importFromHomepage = async () => {
    const gistUrl = document.getElementById('homepage-gist-input').value.trim();
    if (!gistUrl) {
        alert(t('pleaseEnterGistUrlOrId') || '请输入Gist URL或ID');
        return;
    }
    
    window.closeShareModal();
    
    // Show loading
    document.getElementById('loading').classList.remove('hidden');
    
    try {
        await window.claudeGUI.importFromGist(gistUrl);
    } catch (error) {
        console.error('Import failed:', error);
    } finally {
        document.getElementById('loading').classList.add('hidden');
    }
};

