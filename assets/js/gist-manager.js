// Gist management functionality
class GistManager {
    constructor() {
        this.MAX_GIST_SIZE = 900000; // ~900KB limit for safety
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
            console.log('Content copied to clipboard successfully');
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
            // Show error modal instead of proceeding
            this.showError(t('errors.clipboardFailed'));
            return;
        }
        
        // Show instructions modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h3>📋 ${t('shareToGist') || '分享到 GitHub Gist'}</h3>
                <div class="modal-body">
                    <div class="share-info">
                        <p><strong>${t('contentSize') || '内容大小'}:</strong> ${sizeInKB} KB</p>
                        <p><strong>${t('messageCount') || '消息数量'}:</strong> ${messageCount}</p>
                        <p style="color: #28a745;">✅ ${t('copiedToClipboard') || '已复制到剪贴板'}</p>
                    </div>
                    
                    <div class="instructions">
                        <h4>${t('nextSteps') || '接下来的步骤'}:</h4>
                        <ol>
                            <li>${t('step1') || '点击下方按钮打开 GitHub Gist'}</li>
                            <li>${t('step2') || '在 Gist 页面粘贴内容 (Ctrl+V 或 Cmd+V)'}</li>
                            <li>${t('step3') || '将文件名改为'} <code>claude-session.jsonl</code></li>
                            <li>${t('step4') || '点击 "Create public gist" 按钮'}</li>
                            <li>${t('step5') || '复制生成的 Gist 链接并分享给他人'}</li>
                        </ol>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn primary" onclick="window.open('https://gist.github.com/', '_blank'); this.parentElement.parentElement.parentElement.remove();">
                            🚀 ${t('openGist') || '打开 GitHub Gist'}
                        </button>
                        <button class="btn secondary" onclick="this.parentElement.parentElement.parentElement.remove();">
                            ${t('cancel') || '取消'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add click outside to close
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        };
    }

    sessionToJSONL(sessionData) {
        let jsonlContent = '';
        
        // Add session metadata as the first line (optimized)
        const metadata = {
            type: 'session_info',
            id: sessionData.id,
            summary: sessionData.summary,
            timestamp: sessionData.timestamp,
            projectName: sessionData.projectName,
            sharedAt: new Date().toISOString(),
            v: '1.1' // Shorter version field
        };
        jsonlContent += JSON.stringify(metadata) + '\n';
        
        // Optimize messages to save space
        const optimizedMessages = this.optimizeMessagesForSharing(sessionData.messages);
        
        let currentSize = jsonlContent.length;
        let includedMessages = 0;
        
        // Add messages in order, but stop if we approach size limit
        for (const msg of optimizedMessages) {
            const msgLine = JSON.stringify(msg) + '\n';
            
            // Check if adding this message would exceed the limit
            if (currentSize + msgLine.length > this.MAX_GIST_SIZE) {
                console.warn(`Gist size limit approaching. Included ${includedMessages} of ${optimizedMessages.length} messages.`);
                break;
            }
            
            jsonlContent += msgLine;
            currentSize += msgLine.length;
            includedMessages++;
        }
        
        // Add truncation notice if messages were excluded
        if (includedMessages < optimizedMessages.length) {
            const truncationNotice = {
                type: 'truncation_info',
                msg: `Contains ${includedMessages} of ${sessionData.messages.length} messages due to size limits.`,
                total: sessionData.messages.length,
                included: includedMessages
            };
            jsonlContent += JSON.stringify(truncationNotice) + '\n';
        }
        
        console.log(`Optimized Gist content: ${jsonlContent.length} bytes, ${includedMessages}/${sessionData.messages.length} messages (saved ~${this.calculateSpaceSaved(sessionData.messages, optimizedMessages)}%)`);
        return jsonlContent;
    }
    
    optimizeMessagesForSharing(messages) {
        const optimized = [];
        const seenContent = new Set();
        
        for (const msg of messages) {
            // Skip duplicate messages
            const contentKey = this.getMessageContentKey(msg);
            if (seenContent.has(contentKey)) {
                continue;
            }
            seenContent.add(contentKey);
            
            // Create optimized message
            const optimizedMsg = this.optimizeMessage(msg);
            
            // Skip if message has no meaningful content
            if (this.isMessageMeaningful(optimizedMsg)) {
                optimized.push(optimizedMsg);
            }
        }
        
        return optimized;
    }
    
    getMessageContentKey(msg) {
        if (msg.type === 'user') {
            if (typeof msg.message?.content === 'string') {
                return `user:${msg.message.content.slice(0, 100)}`;
            } else if (Array.isArray(msg.message?.content)) {
                const textContent = msg.message.content
                    .filter(item => item.type === 'text')
                    .map(item => item.text)
                    .join(' ');
                return `user:${textContent.slice(0, 100)}`;
            }
        } else if (msg.type === 'assistant' && msg.message?.content) {
            const textContent = msg.message.content
                .filter(item => item.type === 'text')
                .map(item => item.text)
                .join(' ');
            return `assistant:${textContent.slice(0, 100)}`;
        }
        return `${msg.type}:${Math.random()}`;
    }
    
    optimizeMessage(msg) {
        const optimized = {
            type: msg.type,
            ts: msg.timestamp // Shorter field name
        };
        
        if (msg.type === 'user') {
            optimized.msg = this.optimizeUserContent(msg.message);
        } else if (msg.type === 'assistant') {
            optimized.msg = this.optimizeAssistantContent(msg.message);
        }
        
        return optimized;
    }
    
    optimizeUserContent(message) {
        if (typeof message?.content === 'string') {
            return { content: message.content };
        } else if (Array.isArray(message?.content)) {
            const optimizedContent = message.content
                .map(item => {
                    if (item.type === 'text') {
                        return { type: 'text', text: item.text };
                    } else if (item.type === 'image') {
                        // Keep image info but remove large data
                        return { type: 'image', summary: '[Image attached]' };
                    }
                    return null;
                })
                .filter(Boolean);
            return { content: optimizedContent };
        }
        return { content: '[No content]' };
    }
    
    optimizeAssistantContent(message) {
        if (!message?.content) return { content: '[No content]' };
        
        const optimizedContent = message.content
            .map(item => {
                if (item.type === 'text') {
                    return { type: 'text', text: item.text };
                } else if (item.type === 'tool_use') {
                    // Keep tool calls but minimize input data
                    return {
                        type: 'tool_use',
                        name: item.name,
                        input: this.minimizeToolInput(item.input)
                    };
                }
                return null;
            })
            .filter(Boolean);
            
        return { content: optimizedContent };
    }
    
    minimizeToolInput(input) {
        if (!input) return input;
        
        const minimized = {};
        for (const [key, value] of Object.entries(input)) {
            if (typeof value === 'string' && value.length > 500) {
                // Truncate long strings but keep important parts
                minimized[key] = value.slice(0, 250) + '...[truncated]...' + value.slice(-100);
            } else if (Array.isArray(value) && value.length > 10) {
                // Limit array size
                minimized[key] = [...value.slice(0, 5), '...[truncated]...', ...value.slice(-2)];
            } else {
                minimized[key] = value;
            }
        }
        return minimized;
    }
    
    isMessageMeaningful(msg) {
        if (!msg.msg) return false;
        
        if (msg.type === 'user') {
            const content = typeof msg.msg.content === 'string' 
                ? msg.msg.content 
                : JSON.stringify(msg.msg.content);
            return content && content.trim().length > 3;
        } else if (msg.type === 'assistant') {
            return msg.msg.content && msg.msg.content.length > 0;
        }
        
        return false;
    }
    
    calculateSpaceSaved(original, optimized) {
        const originalSize = JSON.stringify(original).length;
        const optimizedSize = JSON.stringify(optimized).length;
        return Math.round(((originalSize - optimizedSize) / originalSize) * 100);
    }

    async importFromGist(gistUrl) {
        if (!gistUrl) {
            throw new Error('Invalid Gist URL');
        }
        
        console.log('Importing from Gist:', gistUrl);
        
        const gistId = this.extractGistId(gistUrl);
        if (!gistId) {
            throw new Error('Invalid Gist URL format');
        }
        
        console.log('Extracted Gist ID:', gistId);
        
        const gistData = await this.fetchGistContent(gistId);
        return gistData;
    }

    extractGistId(url) {
        // Extract Gist ID from various URL formats
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
        // Strategy 1: Try Raw URLs first (no rate limits)
        try {
            console.log('Trying Raw URL strategy...');
            const rawData = await this.fetchGistRaw(gistId);
            // Add detectJSONLFormat for raw data
            rawData.isJSONL = this.detectJSONLFormat(rawData.content);
            return rawData;
        } catch (error) {
            console.log('Raw URL strategy failed:', error.message);
        }
        
        // Strategy 2: Try API with stored token
        const apiKey = localStorage.getItem('github-api-key') || localStorage.getItem('github_token');
        if (apiKey) {
            try {
                console.log('Trying API with stored token...');
                const apiData = await this.fetchGistViaAPI(gistId, apiKey);
                return apiData;
            } catch (error) {
                console.log('API with token failed:', error.message);
            }
        }
        
        // Strategy 3: Try unauthenticated API (limited rate)
        try {
            console.log('Trying unauthenticated API...');
            const unauthData = await this.fetchGistViaAPI(gistId);
            return unauthData;
        } catch (error) {
            console.log('Unauthenticated API failed:', error.message);
            throw error;
        }
    }

    detectJSONLFormat(content) {
        // Try to detect if content is in JSONL format
        const lines = content.trim().split('\n');
        if (lines.length === 0) return false;
        
        // Check if first few lines are valid JSON
        let jsonCount = 0;
        for (let i = 0; i < Math.min(3, lines.length); i++) {
            try {
                JSON.parse(lines[i]);
                jsonCount++;
            } catch (e) {
                // Not a JSON line
            }
        }
        
        // If more than half of the lines are JSON, consider it JSONL format
        return jsonCount > 0 && jsonCount / Math.min(3, lines.length) > 0.5;
    }

    async fetchGistRaw(gistId) {
        // Try multiple Raw URL patterns
        const rawUrls = [
            `https://gist.githubusercontent.com/raw/${gistId}/claude-session.jsonl`,
            `https://gist.githubusercontent.com/raw/${gistId}`,
            `https://gist.github.com/${gistId}/raw/claude-session.jsonl`,
            `https://gist.github.com/${gistId}/raw`
        ];
        
        for (const url of rawUrls) {
            try {
                console.log(`Trying Raw URL: ${url}`);
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'text/plain,application/json,*/*'
                    }
                });
                
                if (response.ok) {
                    const content = await response.text();
                    console.log(`✅ Successfully fetched from Raw URL: ${url}`);
                    console.log(`Content length: ${content.length} characters`);
                    
                    // Check if content is empty or error page
                    if (!content || content.trim().length === 0) {
                        continue;
                    }
                    
                    // Check if it's GitHub's 404 page
                    if (content.includes('<!DOCTYPE html>') && content.includes('GitHub')) {
                        continue;
                    }
                    
                    return {
                        id: gistId,
                        title: `Gist ${gistId}`, // Raw access can't get title
                        content: content,
                        url: `https://gist.github.com/${gistId}`,
                        created: new Date().toISOString(), // Raw access can't get creation time
                        updated: new Date().toISOString(),
                        source: 'raw' // Mark data source
                    };
                } else {
                    console.log(`❌ Raw URL failed with status: ${response.status}`);
                }
            } catch (error) {
                console.log(`❌ Raw URL error: ${error.message}`);
            }
        }
        
        throw new Error('All Raw URL attempts failed');
    }

    async fetchGistViaAPI(gistId, apiKey = null) {
        const apiUrl = `https://api.github.com/gists/${gistId}`;
        const headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Claude-Code-Web-GUI'
        };
        
        if (apiKey) {
            headers['Authorization'] = `token ${apiKey}`;
        }
        
        console.log(`Fetching from API: ${apiUrl}`);
        console.log('Using auth:', apiKey ? 'Yes' : 'No');
        
        const response = await fetch(apiUrl, { headers });
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Gist not found or private');
            } else if (response.status === 403) {
                const rateLimitReset = response.headers.get('X-RateLimit-Reset');
                const resetTime = rateLimitReset ? new Date(parseInt(rateLimitReset) * 1000).toLocaleTimeString() : 'unknown';
                throw new Error(`API rate limit exceeded. Resets at ${resetTime}`);
            } else {
                throw new Error(`API request failed: ${response.status}`);
            }
        }
        
        const gistData = await response.json();
        console.log('✅ Successfully fetched via API');
        console.log('Files in Gist:', Object.keys(gistData.files));
        
        // Find the session file (look for JSONL format first, then fall back to markdown)
        const files = Object.values(gistData.files);
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
            throw new Error('No valid session file found in Gist');
        }
        
        return {
            id: gistId,
            title: gistData.description || sessionFile.filename,
            content: sessionFile.content,
            url: gistData.html_url,
            created: gistData.created_at,
            updated: gistData.updated_at,
            isJSONL: sessionFile.filename.endsWith('.jsonl') || sessionFile.type === 'text/plain',
            source: apiKey ? 'Authenticated API' : 'Unauthenticated API'
        };
    }

    detectJSONLFormat(content) {
        // Check if content looks like JSONL format
        const lines = content.trim().split('\n');
        if (lines.length === 0) return false;
        
        // Check if most lines parse as JSON
        let validJsonLines = 0;
        const samplesToCheck = Math.min(5, lines.length);
        
        for (let i = 0; i < samplesToCheck; i++) {
            try {
                const parsed = JSON.parse(lines[i]);
                if (parsed && typeof parsed === 'object') {
                    validJsonLines++;
                }
            } catch (e) {
                // Not valid JSON
            }
        }
        
        return validJsonLines >= Math.ceil(samplesToCheck * 0.8);
    }

}

// Export for use in main app
window.GistManager = GistManager;