class TrilliantChat {
    constructor() {
        this.currentUser = null;
        this.currentConversation = null;
        this.conversations = [];
        this.socket = null;
        this.isTyping = false;
        
        this.init();
    }

    async init() {
        // Initialize marked for markdown parsing
        if (typeof marked !== 'undefined') {
            marked.setOptions({
                highlight: function(code, lang) {
                    if (typeof hljs !== 'undefined' && lang && hljs.getLanguage(lang)) {
                        try {
                            return hljs.highlight(code, { language: lang }).value;
                        } catch (err) {}
                    }
                    return code;
                },
                breaks: true,
                gfm: true
            });
        }

        // Check authentication
        await this.checkAuth();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
        }, 1000);
    }

    async checkAuth() {
        const token = localStorage.getItem('trilliant_token');
        
        if (!token) {
            this.showAuthModal();
            return;
        }

        try {
            const response = await fetch('/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                this.currentUser = await response.json();
                this.showMainApp();
                await this.loadConversations();
                this.initializeSocket();
            } else {
                localStorage.removeItem('trilliant_token');
                this.showAuthModal();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            this.showAuthModal();
        }
    }

    showAuthModal() {
        document.getElementById('auth-modal').classList.remove('hidden');
        document.getElementById('main-app').classList.add('hidden');
    }

    showMainApp() {
        document.getElementById('auth-modal').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        
        // Update user info
        if (this.currentUser) {
            document.getElementById('user-name').textContent = this.currentUser.name;
            document.getElementById('user-avatar').textContent = this.currentUser.initials;
        }
    }

    setupEventListeners() {
        // Auth form toggles
        document.getElementById('toggle-auth-mode').addEventListener('click', () => {
            const loginForm = document.getElementById('login-form');
            const registerForm = document.getElementById('register-form');
            const toggleButton = document.getElementById('toggle-auth-mode');
            
            if (loginForm.classList.contains('hidden')) {
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
                toggleButton.textContent = 'Need an account? Sign up';
            } else {
                loginForm.classList.add('hidden');
                registerForm.classList.remove('hidden');
                toggleButton.textContent = 'Already have an account? Sign in';
            }
        });

        // Auth forms
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Main app events
        document.getElementById('logout-button').addEventListener('click', () => {
            this.handleLogout();
        });

        document.getElementById('new-chat-button').addEventListener('click', () => {
            this.createNewConversation();
        });

        document.getElementById('send-button').addEventListener('click', () => {
            this.sendMessage();
        });

        document.getElementById('message-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        document.getElementById('message-input').addEventListener('input', (e) => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
        });

        // Search and filter
        document.getElementById('search-conversations').addEventListener('input', (e) => {
            this.filterConversations(e.target.value);
        });

        document.getElementById('category-filter').addEventListener('change', (e) => {
            this.filterConversations(null, e.target.value);
        });

        // User menu toggle
        document.getElementById('user-menu-button').addEventListener('click', () => {
            const menu = document.getElementById('user-menu');
            menu.classList.toggle('hidden');
        });

        // Close user menu when clicking outside
        document.addEventListener('click', (e) => {
            const menu = document.getElementById('user-menu');
            const button = document.getElementById('user-menu-button');
            
            if (!menu.contains(e.target) && !button.contains(e.target)) {
                menu.classList.add('hidden');
            }
        });

        // Export conversation
        document.getElementById('export-button').addEventListener('click', () => {
            if (this.currentConversation) {
                this.exportConversation();
            }
        });

        // Favorite conversation
        document.getElementById('favorite-button').addEventListener('click', () => {
            if (this.currentConversation) {
                this.toggleFavorite();
            }
        });
    }

    async handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('trilliant_token', data.token);
                this.currentUser = data.user;
                this.showMainApp();
                await this.loadConversations();
                this.initializeSocket();
                this.showToast('Welcome back!', 'success');
            } else {
                this.showError(data.error);
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError('Login failed. Please try again.');
        }
    }

    async handleRegister() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.showSuccess(data.message);
                // Switch back to login form
                document.getElementById('toggle-auth-mode').click();
            } else {
                this.showError(data.error);
            }
        } catch (error) {
            console.error('Register error:', error);
            this.showError('Registration failed. Please try again.');
        }
    }

    async handleLogout() {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('trilliant_token')}`
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        }

        localStorage.removeItem('trilliant_token');
        this.currentUser = null;
        this.currentConversation = null;
        this.conversations = [];
        
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }

        this.showAuthModal();
        this.showToast('Logged out successfully', 'info');
    }

    initializeSocket() {
        if (typeof io !== 'undefined') {
            this.socket = io();
            
            this.socket.on('connect', () => {
                console.log('Connected to server');
                this.socket.emit('join-room', this.currentUser.id);
            });

            this.socket.on('user-typing', (data) => {
                // Handle typing indicators from other users if needed
            });
        }
    }

    async loadConversations() {
        try {
            const response = await fetch('/api/chat/conversations', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('trilliant_token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.conversations = data.conversations;
                this.renderConversations();
            }
        } catch (error) {
            console.error('Load conversations error:', error);
        }
    }

    renderConversations() {
        const container = document.getElementById('conversations-list');
        container.innerHTML = '';

        if (this.conversations.length === 0) {
            container.innerHTML = `
                <div class="text-center text-gray-400 py-8">
                    <p>No conversations yet.</p>
                    <p class="text-sm mt-2">Start a new chat to begin!</p>
                </div>
            `;
            return;
        }

        this.conversations.forEach(conversation => {
            const item = document.createElement('div');
            item.className = `conversation-item ${this.currentConversation?.id === conversation._id ? 'active' : ''}`;
            item.innerHTML = `
                <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                        <h4 class="font-medium text-white truncate">${conversation.title}</h4>
                        <p class="text-sm text-gray-400 mt-1">${this.formatDate(conversation.lastActivity)}</p>
                        ${conversation.category !== 'general' ? `<span class="inline-block bg-blue-600 text-xs px-2 py-1 rounded mt-2">${conversation.category}</span>` : ''}
                    </div>
                    ${conversation.isFavorite ? '<div class="text-yellow-400 ml-2">★</div>' : ''}
                </div>
            `;

            item.addEventListener('click', () => {
                this.loadConversation(conversation._id);
            });

            container.appendChild(item);
        });
    }

    async createNewConversation() {
        try {
            const response = await fetch('/api/chat/conversations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('trilliant_token')}`
                },
                body: JSON.stringify({
                    title: 'New Conversation',
                    category: 'general'
                })
            });

            if (response.ok) {
                const conversation = await response.json();
                this.conversations.unshift(conversation);
                this.renderConversations();
                this.loadConversation(conversation._id);
                this.showToast('New conversation created', 'success');
            }
        } catch (error) {
            console.error('Create conversation error:', error);
            this.showToast('Failed to create conversation', 'error');
        }
    }

    async loadConversation(conversationId) {
        try {
            const response = await fetch(`/api/chat/conversations/${conversationId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('trilliant_token')}`
                }
            });

            if (response.ok) {
                this.currentConversation = await response.json();
                this.renderConversation();
                this.renderConversations(); // Update active state
            }
        } catch (error) {
            console.error('Load conversation error:', error);
        }
    }

    renderConversation() {
        // Show chat interface
        document.getElementById('welcome-screen').classList.add('hidden');
        document.getElementById('chat-interface').classList.remove('hidden');

        // Update title
        document.getElementById('chat-title').textContent = this.currentConversation.title;

        // Update favorite button
        const favoriteButton = document.getElementById('favorite-button');
        const favoriteIcon = favoriteButton.querySelector('svg');
        if (this.currentConversation.isFavorite) {
            favoriteIcon.setAttribute('fill', 'currentColor');
            favoriteButton.classList.add('text-yellow-400');
        } else {
            favoriteIcon.setAttribute('fill', 'none');
            favoriteButton.classList.remove('text-yellow-400');
        }

        // Render messages
        const container = document.getElementById('messages-container');
        container.innerHTML = '';

        this.currentConversation.messages.forEach(message => {
            this.addMessageToUI(message);
        });

        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
    }

    addMessageToUI(message) {
        const container = document.getElementById('messages-container');
        const messageDiv = document.createElement('div');
        
        if (message.role === 'user') {
            messageDiv.className = 'flex justify-end animate-fadeInRight';
            messageDiv.innerHTML = `
                <div class="message-user">
                    <div class="message-content">${this.escapeHtml(message.content)}</div>
                    <div class="text-xs opacity-70 mt-1">${this.formatTime(message.timestamp)}</div>
                </div>
            `;
        } else {
            messageDiv.className = 'flex justify-start animate-fadeInLeft';
            messageDiv.innerHTML = `
                <div class="flex items-start space-x-3">
                    <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <div class="message-assistant">
                        <div class="message-content">${this.parseMarkdown(message.content)}</div>
                        <div class="text-xs opacity-70 mt-1">${this.formatTime(message.timestamp)}</div>
                    </div>
                </div>
            `;
        }

        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }

    async sendMessage() {
        const input = document.getElementById('message-input');
        const content = input.value.trim();

        if (!content || !this.currentConversation) return;

        // Clear input
        input.value = '';
        input.style.height = 'auto';

        // Add user message to UI
        const userMessage = {
            role: 'user',
            content: content,
            timestamp: new Date().toISOString()
        };

        this.addMessageToUI(userMessage);

        // Show typing indicator
        this.showTypingIndicator();

        // Disable send button
        const sendButton = document.getElementById('send-button');
        sendButton.disabled = true;

        try {
            const response = await fetch(`/api/chat/conversations/${this.currentConversation._id}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('trilliant_token')}`
                },
                body: JSON.stringify({ content })
            });

            if (response.ok) {
                const data = await response.json();
                
                // Hide typing indicator
                this.hideTypingIndicator();
                
                // Add AI response to UI
                this.addMessageToUI(data.aiMessage);

                // Update conversation in list
                await this.loadConversations();
            } else {
                this.hideTypingIndicator();
                this.showToast('Failed to send message', 'error');
            }
        } catch (error) {
            console.error('Send message error:', error);
            this.hideTypingIndicator();
            this.showToast('Failed to send message', 'error');
        } finally {
            sendButton.disabled = false;
        }
    }

    showTypingIndicator() {
        document.getElementById('typing-indicator').classList.remove('hidden');
        const container = document.getElementById('messages-container');
        container.scrollTop = container.scrollHeight;
    }

    hideTypingIndicator() {
        document.getElementById('typing-indicator').classList.add('hidden');
    }

    async toggleFavorite() {
        try {
            const response = await fetch(`/api/chat/conversations/${this.currentConversation._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('trilliant_token')}`
                },
                body: JSON.stringify({
                    isFavorite: !this.currentConversation.isFavorite
                })
            });

            if (response.ok) {
                this.currentConversation.isFavorite = !this.currentConversation.isFavorite;
                this.renderConversation();
                await this.loadConversations();
                
                const message = this.currentConversation.isFavorite ? 
                    'Added to favorites' : 'Removed from favorites';
                this.showToast(message, 'success');
            }
        } catch (error) {
            console.error('Toggle favorite error:', error);
            this.showToast('Failed to update favorite', 'error');
        }
    }

    async exportConversation() {
        try {
            const response = await fetch(`/api/chat/conversations/${this.currentConversation._id}/export?format=markdown`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('trilliant_token')}`
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${this.currentConversation.title}.md`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                this.showToast('Conversation exported', 'success');
            }
        } catch (error) {
            console.error('Export error:', error);
            this.showToast('Failed to export conversation', 'error');
        }
    }

    filterConversations(search = null, category = null) {
        // This would filter the conversations list
        // For now, just re-render all conversations
        this.renderConversations();
    }

    parseMarkdown(content) {
        if (typeof marked !== 'undefined') {
            const html = marked.parse(content);
            return typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(html) : html;
        }
        return this.escapeHtml(content).replace(/\n/g, '<br>');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return 'Today';
        } else if (diffDays === 2) {
            return 'Yesterday';
        } else if (diffDays <= 7) {
            return `${diffDays - 1} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    formatTime(dateString) {
        return new Date(dateString).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
        
        toast.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <span class="font-bold">${icon}</span>
                    <span>${message}</span>
                </div>
                <button class="ml-4 text-gray-400 hover:text-white" onclick="this.parentElement.parentElement.remove()">
                    ×
                </button>
            </div>
        `;

        container.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }

    showError(message) {
        const errorDiv = document.getElementById('auth-error');
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        
        setTimeout(() => {
            errorDiv.classList.add('hidden');
        }, 5000);
    }

    showSuccess(message) {
        const successDiv = document.getElementById('auth-success');
        successDiv.textContent = message;
        successDiv.classList.remove('hidden');
        
        setTimeout(() => {
            successDiv.classList.add('hidden');
        }, 5000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new TrilliantChat();
});