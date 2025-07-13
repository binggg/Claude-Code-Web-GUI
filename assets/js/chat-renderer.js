// Chat rendering functionality with enhanced markdown support
class ChatRenderer {
    constructor() {
        this.markdownRenderer = window.markdownRenderer || new MarkdownRenderer();
    }

    renderChat(messages, container = null) {
        const chatContainer = container || document.getElementById('chat-messages');
        if (!chatContainer) return;

        chatContainer.innerHTML = '';

        messages.forEach((message, index) => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${message.type}`;
            messageDiv.setAttribute('data-message-index', index);

            // Create avatar
            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            
            if (message.type === 'user') {
                avatar.textContent = 'U';
                avatar.title = 'User';
            } else {
                avatar.innerHTML = `<img src="assets/icons/claude-avatar.svg" class="claude-avatar-svg" alt="Claude">`;
                avatar.title = 'Claude';
            }

            // Create content container
            const content = document.createElement('div');
            content.className = 'message-content';

            // Render message based on type
            if (message.type === 'user') {
                this.renderUserMessage(message, content);
            } else if (message.type === 'assistant') {
                this.renderAssistantMessage(message, content);
            }

            // Add timestamp if available
            if (message.timestamp) {
                const timestamp = document.createElement('div');
                timestamp.className = 'message-timestamp';
                timestamp.textContent = new Date(message.timestamp).toLocaleString();
                content.appendChild(timestamp);
            }

            messageDiv.appendChild(avatar);
            messageDiv.appendChild(content);
            chatContainer.appendChild(messageDiv);
        });

        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    renderUserMessage(message, container) {
        const msgContent = message.message;
        
        if (typeof msgContent.content === 'string') {
            // Simple text message
            const textDiv = document.createElement('div');
            textDiv.className = 'user-text';
            textDiv.textContent = msgContent.content;
            container.appendChild(textDiv);
        } else if (Array.isArray(msgContent.content)) {
            // Multi-part message (text + images, etc.)
            msgContent.content.forEach(part => {
                if (part.type === 'text') {
                    const textDiv = document.createElement('div');
                    textDiv.className = 'user-text';
                    textDiv.textContent = part.text;
                    container.appendChild(textDiv);
                } else if (part.type === 'image') {
                    const imageDiv = document.createElement('div');
                    imageDiv.className = 'user-image';
                    if (part.summary) {
                        imageDiv.textContent = part.summary;
                    } else {
                        imageDiv.textContent = '[Image]';
                    }
                    container.appendChild(imageDiv);
                }
            });
        }
    }

    renderAssistantMessage(message, container) {
        const msgContent = message.message;
        
        if (!msgContent.content) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'assistant-text';
            emptyDiv.textContent = '[No content]';
            container.appendChild(emptyDiv);
            return;
        }

        msgContent.content.forEach(part => {
            if (part.type === 'text') {
                this.renderTextContent(part.text, container);
            } else if (part.type === 'tool_use') {
                this.renderToolUse(part, container);
            }
        });
    }

    renderTextContent(text, container) {
        const textDiv = document.createElement('div');
        textDiv.className = 'assistant-text claude-formatted';
        
        // Use the enhanced markdown renderer
        textDiv.innerHTML = this.markdownRenderer.render(text);
        
        container.appendChild(textDiv);
    }

    renderToolUse(toolUse, container) {
        const toolDiv = document.createElement('div');
        toolDiv.className = 'tool-call';
        
        const toolHeader = document.createElement('div');
        toolHeader.className = 'tool-call-header';
        
        // 创建工具图标
        const toolIcon = document.createElement('div');
        toolIcon.className = 'tool-call-icon';
        toolIcon.textContent = '🔧';
        
        // 创建工具名称
        const toolName = document.createElement('span');
        toolName.className = 'tool-name';
        toolName.textContent = toolUse.name;
        
        // 创建展开/折叠按钮
        const toggleBtn = document.createElement('div');
        toggleBtn.className = 'tool-toggle';
        toggleBtn.textContent = '▼';
        
        toolHeader.appendChild(toolIcon);
        toolHeader.appendChild(toolName);
        toolHeader.appendChild(toggleBtn);
        
        const toolContent = document.createElement('div');
        toolContent.className = 'tool-call-content collapsed';
        
        if (toolUse.input && Object.keys(toolUse.input).length > 0) {
            const inputContainer = document.createElement('div');
            inputContainer.className = 'tool-call-input';
            
            // 创建参数标题区域
            const inputHeader = document.createElement('div');
            inputHeader.className = 'tool-input-header';
            
            const headerTitle = document.createElement('strong');
            headerTitle.textContent = 'Parameters:';
            
            // 创建复制按钮
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.textContent = '📋';
            copyBtn.title = 'Copy parameters';
            
            // 使用现代事件绑定
            copyBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // 防止触发工具卡片的展开/折叠
                this.copyToolParameters(toolUse.input, copyBtn);
            });
            
            inputHeader.appendChild(headerTitle);
            inputHeader.appendChild(copyBtn);
            
            // 创建参数内容显示区域
            const paramsContent = document.createElement('pre');
            paramsContent.style.marginTop = '8px';
            paramsContent.style.margin = '8px 0 0 0';
            paramsContent.style.overflow = 'auto';
            
            const codeElement = document.createElement('code');
            codeElement.innerHTML = this.formatToolInput(toolUse.input);
            paramsContent.appendChild(codeElement);
            
            inputContainer.appendChild(inputHeader);
            inputContainer.appendChild(paramsContent);
            toolContent.appendChild(inputContainer);
        }
        
        // 使用现代事件绑定处理展开/折叠
        toolHeader.addEventListener('click', () => {
            const isCollapsed = toolContent.classList.contains('collapsed');
            
            if (isCollapsed) {
                toolContent.classList.remove('collapsed');
                toggleBtn.textContent = '▲';
                toolDiv.classList.add('expanded');
            } else {
                toolContent.classList.add('collapsed');
                toggleBtn.textContent = '▼';
                toolDiv.classList.remove('expanded');
            }
        });
        
        toolDiv.appendChild(toolHeader);
        toolDiv.appendChild(toolContent);
        container.appendChild(toolDiv);
    }

    // 新的复制参数方法，更安全和稳定
    async copyToolParameters(input, button) {
        const jsonString = JSON.stringify(input, null, 2);
        
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(jsonString);
                this.showCopyFeedback(button, '✅', 'Copied!');
            } else {
                // 降级方案
                this.fallbackCopyToClipboard(jsonString);
                this.showCopyFeedback(button, '✅', 'Copied!');
            }
        } catch (err) {
            console.error('Failed to copy:', err);
            this.showCopyFeedback(button, '❌', 'Copy failed');
        }
    }

    // 显示复制反馈
    showCopyFeedback(button, icon, message) {
        const originalText = button.textContent;
        const originalTitle = button.title;
        
        button.textContent = icon;
        button.title = message;
        button.style.background = icon === '✅' ? '#238636' : '#da3633';
        button.style.color = '#ffffff';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.title = originalTitle;
            button.style.background = '';
            button.style.color = '';
        }, 1500);
    }

    // 降级复制方案
    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        textArea.style.opacity = '0';
        textArea.style.pointerEvents = 'none';
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (!successful) {
                throw new Error('execCommand failed');
            }
        } finally {
            document.body.removeChild(textArea);
        }
    }

    formatToolInput(input) {
        // Format JSON with syntax highlighting
        const jsonStr = JSON.stringify(input, null, 2);
        return this.highlightJSON(jsonStr);
    }

    highlightJSON(jsonStr) {
        // 首先转义 HTML 字符，防止与高亮标签混杂
        const escaped = jsonStr
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
        
        // 然后进行语法高亮
        return escaped
            .replace(/(&quot;.*?&quot;)\s*:/g, '<span class="json-key">$1</span>:')
            .replace(/:\s*(&quot;.*?&quot;)/g, ': <span class="json-string">$1</span>')
            .replace(/:\s*(true|false)\b/g, ': <span class="json-boolean">$1</span>')
            .replace(/:\s*(null)\b/g, ': <span class="json-null">$1</span>')
            .replace(/:\s*(\d+\.?\d*)/g, ': <span class="json-number">$1</span>');
    }

    renderSharedChat(sessionData, container = null) {
        const chatContainer = container || document.getElementById('chat-messages');
        if (!chatContainer) return;

        chatContainer.innerHTML = '';

        // Add session info header
        this.renderSessionInfo(sessionData, chatContainer);

        // Render messages
        if (sessionData.msgs && sessionData.msgs.length > 0) {
            sessionData.msgs.forEach((message, index) => {
                this.renderSharedMessage(message, chatContainer, index);
            });
        } else if (sessionData.messages && sessionData.messages.length > 0) {
            // Fallback for different format
            sessionData.messages.forEach((message, index) => {
                this.renderSharedMessage(message, chatContainer, index);
            });
        }

        // Add footer
        this.renderSessionFooter(sessionData, chatContainer);
    }

    renderSessionInfo(sessionData, container) {
        const infoDiv = document.createElement('div');
        infoDiv.className = 'session-info-header';
        infoDiv.innerHTML = `
            <h3>📄 ${sessionData.title || sessionData.summary || 'Shared Session'}</h3>
            <div class="session-meta">
                <span class="session-project">📁 ${sessionData.project || sessionData.projectName || 'Unknown Project'}</span>
                <span class="session-time">🕒 ${sessionData.timestamp ? new Date(sessionData.timestamp).toLocaleString() : 'Unknown Time'}</span>
            </div>
            <hr class="session-divider">
        `;
        container.appendChild(infoDiv);
    }

    renderSessionFooter(sessionData, container) {
        const footerDiv = document.createElement('div');
        footerDiv.className = 'session-footer';
        footerDiv.innerHTML = `
            <hr class="session-divider">
            <div class="shared-session-footer">
                <p>💡 <strong>Tip:</strong> 你也可以使用 Claude Code Web GUI 浏览和分享自己的会话</p>
                <a href="/" class="footer-link">🚀 Try Claude Code Web GUI</a>
            </div>
        `;
        container.appendChild(footerDiv);
    }

    renderSharedMessage(message, container, index) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.type}`;
        messageDiv.setAttribute('data-message-index', index);

        // Create avatar
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        
        if (message.type === 'user') {
            avatar.textContent = 'U';
        } else {
            avatar.innerHTML = `<img src="assets/icons/claude-avatar.svg" class="claude-avatar-svg" alt="Claude">`;
        }

        // Create content
        const content = document.createElement('div');
        content.className = 'message-content';

        // Handle both old and new optimized format
        const msgData = message.message || message.msg;
        if (msgData) {
            if (message.type === 'user') {
                this.renderUserMessage({ message: msgData }, content);
            } else if (message.type === 'assistant') {
                this.renderAssistantMessage({ message: msgData }, content);
            }
        }

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        container.appendChild(messageDiv);
    }

    convertOptimizedMessage(optimizedMsg) {
        // Convert optimized message format back to standard format for rendering
        if (optimizedMsg.msg) {
            // New optimized format
            return {
                type: optimizedMsg.type,
                timestamp: optimizedMsg.ts || optimizedMsg.timestamp,
                message: optimizedMsg.msg
            };
        } else {
            // Old format, return as is
            return optimizedMsg;
        }
    }
}

// Export for use in main app
window.ChatRenderer = ChatRenderer;