// Client-side integration for Claude Code GUI v2 Server
class ServerIntegration {
    constructor() {
        this.serverUrl = this.detectServerUrl();
        this.isServerAvailable = false;
        this.checkServerStatus();
    }

    detectServerUrl() {
        // Default to localhost:3000, but allow configuration
        const defaultUrl = 'http://localhost:3000';
        const configUrl = localStorage.getItem('claude-gui-server-url');
        return configUrl || defaultUrl;
    }

    async checkServerStatus() {
        try {
            const response = await fetch(`${this.serverUrl}/api/health`);
            if (response.ok) {
                this.isServerAvailable = true;
                console.log('✅ Claude Code GUI v2 Server is available');
                this.enableServerFeatures();
            }
        } catch (error) {
            this.isServerAvailable = false;
            console.log('📡 v2 Server not available - running in browser-only mode');
        }
    }

    enableServerFeatures() {
        // Enable continue conversation functionality
        this.enableContinueConversation();
        
        // Update UI to show server features are available
        this.updateUIForServerMode();
    }

    enableContinueConversation() {
        // Override the chat input functionality when server is available
        const originalToggleChatInput = window.toggleChatInput;
        
        window.toggleChatInput = () => {
            const inputContainer = document.querySelector('.chat-input-container');
            if (inputContainer) {
                inputContainer.classList.toggle('visible');
                
                if (inputContainer.classList.contains('visible') && this.isServerAvailable) {
                    // Enable the input and send button
                    const chatInput = inputContainer.querySelector('.chat-input');
                    const sendBtn = inputContainer.querySelector('.chat-send-btn');
                    
                    if (chatInput && sendBtn) {
                        chatInput.disabled = false;
                        chatInput.style.opacity = '1';
                        chatInput.style.cursor = 'text';
                        chatInput.placeholder = t('chatInputPlaceholder') || '输入消息继续对话...';
                        
                        sendBtn.disabled = false;
                        sendBtn.style.opacity = '1';
                        sendBtn.style.cursor = 'pointer';
                        sendBtn.style.background = '#16a34a';
                        sendBtn.style.borderColor = '#16a34a';
                        sendBtn.style.color = '#ffffff';
                        
                        // Add click handler for send button
                        sendBtn.onclick = () => this.sendMessage();
                        
                        // Add enter key handler
                        chatInput.onkeydown = (e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                this.sendMessage();
                            }
                        };
                        
                        // Show server availability notification
                        this.showNotification('🌟 v2服务器已连接 - 继续对话功能已启用', 'success');
                    }
                }
            }
        };
    }

    async sendMessage() {
        const chatInput = document.querySelector('.chat-input');
        const message = chatInput.value.trim();
        
        if (!message || !window.claudeGUI.currentSession) {
            return;
        }

        // Disable input while sending
        chatInput.disabled = true;
        const sendBtn = document.querySelector('.chat-send-btn');
        sendBtn.disabled = true;
        
        try {
            // Add user message to UI immediately
            this.addMessageToUI('user', message);
            
            // Send to server
            const response = await fetch(`${this.serverUrl}/api/sessions/${window.claudeGUI.currentSession.projectName}/${window.claudeGUI.currentSession.id}/continue`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });

            if (response.ok) {
                const data = await response.json();
                
                // Add assistant response to UI
                if (data.response && data.response.message && data.response.message.content) {
                    const assistantText = data.response.message.content
                        .filter(item => item.type === 'text')
                        .map(item => item.text)
                        .join('\n');
                    
                    this.addMessageToUI('assistant', assistantText);
                }
                
                // Clear input
                chatInput.value = '';
                
                this.showNotification('✅ 消息发送成功', 'success');
            } else {
                throw new Error('Server response error');
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            this.showNotification('❌ 发送失败，请重试', 'error');
        } finally {
            // Re-enable input
            chatInput.disabled = false;
            sendBtn.disabled = false;
        }
    }

    addMessageToUI(type, content) {
        const container = document.getElementById('chat-messages');
        
        // Remove the input container temporarily
        const inputContainer = container.querySelector('.chat-input-container');
        if (inputContainer) {
            inputContainer.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        
        if (type === 'user') {
            avatar.textContent = 'U';
        } else {
            avatar.innerHTML = `<img src="assets/icons/claude-avatar.svg" class="claude-avatar-svg" alt="Claude">`;
        }
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.textContent = content;
        messageContent.appendChild(textDiv);
        
        // Add timestamp
        const timestamp = document.createElement('div');
        timestamp.className = 'timestamp';
        timestamp.textContent = new Date().toLocaleString();
        messageContent.appendChild(timestamp);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        container.appendChild(messageDiv);
        
        // Re-add input container
        if (inputContainer) {
            container.appendChild(inputContainer);
        }
        
        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
    }

    updateUIForServerMode() {
        // Update FAB continue conversation button tooltip
        const continueBtn = document.getElementById('fab-continue');
        if (continueBtn) {
            continueBtn.title = '继续对话 (v2服务器已连接)';
        }
        
        // Add server status indicator
        const header = document.querySelector('.main-header');
        if (header && !header.querySelector('.server-status')) {
            const statusIndicator = document.createElement('div');
            statusIndicator.className = 'server-status';
            statusIndicator.style.cssText = `
                background: #16a34a;
                color: white;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 10px;
                margin-left: 8px;
            `;
            statusIndicator.textContent = 'v2';
            statusIndicator.title = 'v2服务器已连接';
            header.appendChild(statusIndicator);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#16a34a' : type === 'error' ? '#dc2626' : '#18181b'};
            border: 1px solid ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#27272a'};
            color: white;
            padding: 12px 16px;
            border-radius: 6px;
            font-size: 12px;
            z-index: 1001;
            transition: opacity 0.3s ease;
            max-width: 300px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    async getServerConfig() {
        if (!this.isServerAvailable) return null;
        
        try {
            const response = await fetch(`${this.serverUrl}/api/config`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Failed to get server config:', error);
        }
        return null;
    }

    async getClaudeCodeStatus() {
        if (!this.isServerAvailable) return null;
        
        try {
            const response = await fetch(`${this.serverUrl}/api/claude-code/status`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Failed to get Claude Code status:', error);
        }
        return null;
    }
}

// Initialize server integration when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for the main app to initialize
    setTimeout(() => {
        window.serverIntegration = new ServerIntegration();
    }, 1000);
});

// Export for use in main app
window.ServerIntegration = ServerIntegration;