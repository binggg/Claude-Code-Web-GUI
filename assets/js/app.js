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
        // Check for URL query parameter first (new method)
        const urlParams = new URLSearchParams(window.location.search);
        const sessionParam = urlParams.get('session');
        
        if (sessionParam) {
            try {
                const sessionData = JSON.parse(this.base64ToUnicode(sessionParam));
                this.displaySharedSession(sessionData);
                this.setupTwitterSharing(sessionData);
                return;
            } catch (error) {
                console.error('Failed to load shared session from query param:', error);
            }
        }
        
        // Fallback to old hash method for backwards compatibility
        const hash = window.location.hash;
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
    
    displaySharedSession(sessionData) {
        // Hide header and show shared session
        document.getElementById('header').classList.add('collapsed');
        document.getElementById('main-layout').classList.remove('hidden');
        
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
        
        // Display messages
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
            textDiv.textContent = msg.content;
            content.appendChild(textDiv);
            
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(content);
            container.appendChild(messageDiv);
        });
        
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
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        this.filteredSessions = this.allSessions.filter(session =>
            session.summary.toLowerCase().includes(searchTerm) ||
            this.getProjectDisplayName(session.projectName.replace(/-/g, '/')).toLowerCase().includes(searchTerm)
        );
        this.renderSidebar();
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
        const shareUrl = this.createShareableURL(sessionData);
        
        // Create modal for sharing options
        const modal = document.createElement('div');
        modal.className = 'share-modal';
        modal.innerHTML = `
            <div class="share-modal-content">
                <div class="share-modal-header">
                    <h3>${t('shareSession') || '分享会话'}</h3>
                    <button class="close-btn" onclick="closeShareModal()">✕</button>
                </div>
                <div class="share-modal-body">
                    <div class="share-option">
                        <h4>🔗 ${t('copyToClipboard') || '复制链接'}</h4>
                        <p>${t('copyLinkDescription') || '复制分享链接，直接发送给他人查看'}</p>
                        <div class="share-limitation-note">
                            <small>⚠️ ${t('shareLinkLimitation') || '注意：分享链接仅包含前10条消息，如需分享完整会话请使用Gist功能'}</small>
                        </div>
                        <button class="action-btn" onclick="copyShareLink()">
                            ${t('copy') || '复制链接'}
                        </button>
                    </div>
                    <div class="share-option">
                        <h4>📝 ${t('shareViaGist') || '通过GitHub Gist分享'}</h4>
                        <p>${t('gistDescription') || '创建一个GitHub Gist来分享这个会话（保持原始JSONL格式）'}</p>
                        <div class="share-recommendation-note">
                            <small>✅ ${t('gistRecommendation') || '推荐：包含完整会话内容，保持原始数据格式，便于重新导入和处理'}</small>
                        </div>
                        <button class="action-btn gist-btn" onclick="openGistCreation()">
                            ${t('createGist') || '创建Gist'}
                        </button>
                    </div>
                    <div class="share-option">
                        <h4>📥 ${t('importFromGist') || '从Gist导入会话'}</h4>
                        <p>${t('gistImportDescription') || '输入GitHub Gist URL来查看分享的会话'}</p>
                        <div class="gist-import-section">
                            <input type="text" class="gist-url-input" placeholder="${t('gistUrlPlaceholder') || '输入Gist URL...'}" id="gist-url-input">
                            <button class="action-btn gist-btn" onclick="importFromGist()">
                                ${t('importGist') || '导入'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Store session data for modal functions
        window.currentShareData = {
            sessionData,
            shareUrl
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
        // Open GitHub Gist creation page with pre-filled content
        const jsonlContent = this.sessionToJSONL(sessionData);
        const gistUrl = 'https://gist.github.com/new';
        
        // Copy content to clipboard first
        try {
            await navigator.clipboard.writeText(jsonlContent);
            alert(t('gistContentCopied') || 'Gist内容已复制到剪贴板，将打开GitHub Gist页面');
        } catch (err) {
            console.warn('Failed to copy to clipboard:', err);
        }
        
        window.open(gistUrl, '_blank');
        return gistUrl;
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
    
    displayImportedGist(gistData) {
        // Hide header and show imported session
        document.getElementById('header').classList.add('collapsed');
        document.getElementById('main-layout').classList.remove('hidden');
        
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
        backBtn.onclick = () => window.location.reload();
        
        actionsDiv.innerHTML = '';
        actionsDiv.appendChild(backBtn);
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
                <h3>📄 会话信息</h3>
                <p><strong>会话ID:</strong> ${sessionInfo.id}</p>
                <p><strong>摘要:</strong> ${sessionInfo.summary}</p>
                <p><strong>项目:</strong> ${sessionInfo.projectName?.replace(/-/g, '/') || 'Unknown'}</p>
                <p><strong>时间:</strong> ${new Date(sessionInfo.timestamp).toLocaleString()}</p>
                <p><strong>分享时间:</strong> ${new Date(sessionInfo.sharedAt).toLocaleString()}</p>
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
                                        <span>工具调用: ${item.name}</span>
                                        <div class="tool-toggle">▼</div>
                                    </div>
                                    <div class="tool-call-content collapsed" id="${toolId}">
                                        <div>参数:</div>
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
        
        // Add all messages in their original format
        sessionData.messages.forEach(msg => {
            jsonlContent += JSON.stringify(msg) + '\n';
        });
        
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
    
    createShareableURL(sessionData) {
        // Use URL fragment to store compressed session data
        const compressed = this.compressSessionData(sessionData);
        const baseUrl = window.location.origin + window.location.pathname;
        return `${baseUrl}?session=${compressed}`;
    }
    
    // Unicode-safe base64 encoding
    unicodeToBase64(str) {
        try {
            // Convert string to UTF-8 bytes, then to base64
            return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
                return String.fromCharCode(parseInt(p1, 16));
            }));
        } catch (error) {
            console.warn('Failed to encode to base64:', error);
            // Fallback: just use URL encoding without base64
            return encodeURIComponent(str);
        }
    }
    
    // Unicode-safe base64 decoding  
    base64ToUnicode(str) {
        try {
            // Check if it's base64 encoded
            if (str.match(/^[A-Za-z0-9+/]+=*$/)) {
                return decodeURIComponent(Array.prototype.map.call(atob(str), (c) => {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
            } else {
                // Already URL encoded
                return decodeURIComponent(str);
            }
        } catch (error) {
            console.warn('Failed to decode from base64:', error);
            return str;
        }
    }
    
    compressSessionData(sessionData) {
        // Simplified compression - in production, use LZString or similar
        const simplified = {
            id: sessionData.id,
            title: sessionData.summary,
            time: sessionData.timestamp,
            msgs: sessionData.messages.slice(0, 10).map(msg => ({
                type: msg.type,
                content: this.extractTextContent(msg)
            }))
        };
        
        return this.unicodeToBase64(JSON.stringify(simplified));
    }
    
    extractTextContent(msg) {
        if (msg.type === 'user') {
            if (typeof msg.message.content === 'string') {
                return msg.message.content.substring(0, 500);
            } else if (Array.isArray(msg.message.content)) {
                return msg.message.content
                    .filter(item => item.type === 'text')
                    .map(item => item.text)
                    .join('\n')
                    .substring(0, 500);
            }
        } else if (msg.type === 'assistant' && msg.message.content) {
            return msg.message.content
                .filter(item => item.type === 'text')
                .map(item => item.text)
                .join('\n')
                .substring(0, 500);
        }
        return '';
    }
    
    shareViaURL(sessionData) {
        const shareUrl = this.createShareableURL(sessionData);
        
        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
            this.showShareSuccess(shareUrl);
        }).catch(() => {
            this.showManualShare(shareUrl);
        });
    }
    
    showShareSuccess(url) {
        const message = t('shareSuccess') || '分享链接已复制到剪贴板！';
        alert(`${message}

${url}`);
    }
    
    showManualShare(url) {
        const message = t('shareManual') || '请手动复制分享链接：';
        prompt(message, url);
    }
    
    // Export functionality
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
    
    // Return to homepage functionality
    returnToHomepage() {
        // Hide main layout
        document.getElementById("main-layout").classList.add("hidden");
        
        // Show header
        document.getElementById("header").classList.remove("collapsed");
        
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
window.copyShareLink = async () => {
    if (window.currentShareData) {
        try {
            await navigator.clipboard.writeText(window.currentShareData.shareUrl);
            alert(t('shareSuccess') || '分享链接已复制到剪贴板！');
        } catch (err) {
            prompt(t('manualCopy') || '请手动复制链接:', window.currentShareData.shareUrl);
        }
        window.closeShareModal();
    }
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

