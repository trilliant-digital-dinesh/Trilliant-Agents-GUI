// Main Dashboard Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Navigation Tab Switching
    const navLinks = document.querySelectorAll('.main-nav a');
    const sections = document.querySelectorAll('.agent-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            
            // Update active nav link
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            link.parentElement.classList.add('active');
            
            // Show target section
            sections.forEach(section => section.classList.remove('active'));
            document.querySelector(targetId).classList.add('active');
        });
    });
    
    // Agent Chat Functionality
    const agentListItems = document.querySelectorAll('.agent-list-item');
    const chatWindows = document.querySelectorAll('.agent-chat');
    const chatInputs = document.querySelectorAll('.chat-input');
    const chatSendBtns = document.querySelectorAll('.chat-send-btn');
    const closeChatBtns = document.querySelectorAll('.close-chat-btn');
    const minimizeChatBtns = document.querySelectorAll('.minimize-chat-btn');
    
    // Track active chat
    let activeChat = null;
    
    // Open chat when clicking on an agent (not disabled ones)
    agentListItems.forEach(item => {
        if (!item.classList.contains('disabled')) {
            item.addEventListener('click', () => {
                const agentType = item.getAttribute('data-agent');
                const chatWindow = document.querySelector(`.agent-chat[data-agent="${agentType}"]`);
                
                if (activeChat) {
                    activeChat.classList.remove('active');
                }
                
                chatWindow.classList.add('active');
                activeChat = chatWindow;
                
                // Focus the input field automatically
                setTimeout(() => {
                    const input = chatWindow.querySelector('.chat-input');
                    if (input) input.focus();
                }, 300);
                
                // Apply a subtle animation to the body
                document.body.style.overflow = 'hidden';
            });
        }
    });
    
    // Close button functionality
    closeChatBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            closeActiveChat();
        });
    });
    
    // Minimize button functionality - now it closes the chat
    minimizeChatBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            closeActiveChat();
        });
    });
    
    // Close chat with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && activeChat) {
            closeActiveChat();
        }
    });
    
    // Close active chat function
    function closeActiveChat() {
        if (activeChat) {
            activeChat.classList.remove('active');
            activeChat = null;
            document.body.style.overflow = '';
        }
    }
    
    // Send message functionality
    chatSendBtns.forEach(btn => {
        btn.addEventListener('click', sendMessage);
    });
    
    chatInputs.forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const sendBtn = input.closest('.chat-input-container').querySelector('.chat-send-btn');
                if (sendBtn) {
                    sendMessage({target: sendBtn});
                }
            }
        });
    });
    
    function sendMessage(e) {
        const chatInputContainer = e.target.closest('.chat-input-container');
        const chatInput = chatInputContainer.querySelector('.chat-input');
        const chatWindow = chatInput.closest('.agent-chat');
        const chatContent = chatWindow.querySelector('.chat-content');
        const messageText = chatInput.value.trim();
        
        if (messageText) {
            // Create user message
            const userMessage = document.createElement('div');
            userMessage.className = 'user-message';
            userMessage.innerHTML = `
                <div class="user-avatar">👤</div>
                <div class="message-content">${messageText}</div>
            `;
            
            chatContent.appendChild(userMessage);
            chatInput.value = '';
            
            // Auto-scroll to bottom
            chatContent.scrollTop = chatContent.scrollHeight;
            
            // Add typing indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'agent-message typing-indicator';
            
            const agentType = chatWindow.getAttribute('data-agent');
            let agentEmoji = '🤖';
            
            switch (agentType) {
                case 'competitor':
                    agentEmoji = '🔍';
                    break;
                case 'calendar':
                    agentEmoji = '📅';
                    break;
                case 'icp':
                    agentEmoji = '👥';
                    break;
                case 'keyword':
                    agentEmoji = '🔑';
                    break;
                case 'seocompetitor':
                    agentEmoji = '📊';
                    break;
            }
            
            typingIndicator.innerHTML = `
                <div class="agent-avatar">${agentEmoji}</div>
                <div class="message-content">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            `;
            
            chatContent.appendChild(typingIndicator);
            chatContent.scrollTop = chatContent.scrollHeight;
            
            // Connect to n8n webhook for ICP agent
            if (agentType === 'icp') {
                analyzeWebsite(messageText, chatWindow, chatContent);
            } 
            else if (agentType === 'keyword' || agentType === 'seocompetitor') {
                // For future integration, you can add the keyword and SEO competitor API calls here
                // For now, use simulation
                simulateAgentResponse(agentType, messageText, typingIndicator, chatContent, agentEmoji);
            }
            else {
                // For other agent types, use simulation
                simulateAgentResponse(agentType, messageText, typingIndicator, chatContent, agentEmoji);
            }
        }
    }
    
    // Separate function for simulated responses
    function simulateAgentResponse(agentType, messageText, typingIndicator, chatContent, agentEmoji) {
        setTimeout(() => {
            // Remove typing indicator
            chatContent.removeChild(typingIndicator);
            
            // Add agent response
            const agentMessage = document.createElement('div');
            agentMessage.className = 'agent-message';
            
            let responseText = `I'm processing your request. I'll analyze "${messageText}" and provide insights shortly.`;
            
            // Different responses based on agent type
            if (agentType === 'competitor') {
                if (messageText.toLowerCase().includes('competitor') || messageText.toLowerCase().includes('competition')) {
                    responseText = `I've analyzed your competitor's social media activity. They post approximately 3 times per week with an average engagement rate of 4.2%. Their most successful content types are video tutorials and industry news updates.`;
                } else if (messageText.toLowerCase().includes('suggest') || messageText.toLowerCase().includes('recommend')) {
                    responseText = `Based on your industry and competitor analysis, I recommend focusing on creating more video content, posting consistently 4-5 times per week, and engaging with industry hashtags like #digitalmarketing and #growthhacking.`;
                }
            } else if (agentType === 'calendar') {
                if (messageText.toLowerCase().includes('schedule') || messageText.toLowerCase().includes('calendar')) {
                    responseText = `I've created an optimized posting schedule for your social media accounts. For best engagement, post on Instagram on Tuesdays and Thursdays at 12-2pm, LinkedIn on Wednesdays at 9am, and Twitter daily at 8am and 5pm.`;
                }
            } else if (agentType === 'keyword') {
                responseText = `Based on your website, I recommend focusing on these keywords: "digital marketing automation" (difficulty: medium, volume: high), "marketing workflow automation" (difficulty: low, volume: medium), and "social media management tools" (difficulty: medium, volume: very high).`;
            } else if (agentType === 'seocompetitor') {
                responseText = `I've analyzed your competitors and found they're ranking for keywords you're missing. Top opportunities: "automated social posting" (low competition), "marketing dashboard tools" (medium traffic), and "social analytics platform" (high conversion potential).`;
            }
            
            agentMessage.innerHTML = `
                <div class="agent-avatar">${agentEmoji}</div>
                <div class="message-content">${responseText}</div>
            `;
            
            chatContent.appendChild(agentMessage);
            chatContent.scrollTop = chatContent.scrollHeight;
        }, 1500);
    }
    
    // Add typing dots animation styles
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .typing-indicator .message-content {
                padding: 1rem;
            }
            
            .typing-dots {
                display: flex;
                align-items: center;
                gap: 4px;
                height: 10px;
            }
            
            .typing-dots span {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: var(--accent-blue);
                animation: typingDot 1.4s infinite ease-in-out;
            }
            
            .typing-dots span:nth-child(1) {
                animation-delay: 0s;
            }
            
            .typing-dots span:nth-child(2) {
                animation-delay: 0.2s;
            }
            
            .typing-dots span:nth-child(3) {
                animation-delay: 0.4s;
            }
            
            @keyframes typingDot {
                0%, 60%, 100% {
                    transform: translateY(0);
                    opacity: 0.6;
                }
                30% {
                    transform: translateY(-5px);
                    opacity: 1;
                }
            }
        </style>
    `);
    
    // Tag Input Functionality
    const tagInputs = document.querySelectorAll('.tag-input');
    
    tagInputs.forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const value = input.value.trim();
                if (value) {
                    const tagChips = input.parentElement.querySelector('.tag-chips');
                    const tag = document.createElement('div');
                    tag.className = 'tag-chip';
                    tag.innerHTML = `
                        <span>${value}</span>
                        <button class="remove-tag">×</button>
                    `;
                    
                    tag.querySelector('.remove-tag').addEventListener('click', () => {
                        tag.remove();
                    });
                    
                    tagChips.appendChild(tag);
                    input.value = '';
                }
            }
        });
    });
    
    // Sliders with Value Display
    const frequencySlider = document.getElementById('frequency-slider');
    const frequencyValue = document.getElementById('frequency-value');
    
    if (frequencySlider && frequencyValue) {
        frequencySlider.addEventListener('input', () => {
            frequencyValue.textContent = `${frequencySlider.value} posts/week`;
        });
    }
    
    const durationSlider = document.getElementById('duration-slider');
    const durationValue = document.getElementById('duration-value');
    
    if (durationSlider && durationValue) {
        durationSlider.addEventListener('input', () => {
            durationValue.textContent = `${durationSlider.value} weeks`;
        });
    }
    
    // Toggle Buttons
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
        });
    });
    
    // Persona/Tone/Platform Selection
    const selectionOptions = document.querySelectorAll('.persona-option, .tone-option, .platform-option');
    
    selectionOptions.forEach(option => {
        option.addEventListener('click', () => {
            const container = option.parentElement;
            const allowMultiple = container.classList.contains('platform-selector');
            
            if (!allowMultiple) {
                container.querySelectorAll('.active').forEach(item => item.classList.remove('active'));
            }
            
            option.classList.toggle('active');
        });
    });
    
    // File Upload & Dropzone
    const dropzones = document.querySelectorAll('.dropzone');
    
    dropzones.forEach(dropzone => {
        const input = dropzone.querySelector('.file-input');
        const previewContainer = dropzone.parentElement.querySelector('.file-preview-container');
        
        // Handle drag events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, () => {
                dropzone.classList.add('drag-over');
            });
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, () => {
                dropzone.classList.remove('drag-over');
            });
        });
        
        // Handle file drop
        dropzone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            handleFiles(files);
        });
        
        // Handle file selection
        input.addEventListener('change', () => {
            const files = input.files;
            handleFiles(files);
        });
        
        function handleFiles(files) {
            Array.from(files).forEach(file => {
                if (!file.type.match('image/*') && !file.type.match('video/*')) return;
                
                const preview = document.createElement('div');
                preview.className = 'file-preview';
                
                if (file.type.match('image/*')) {
                    const img = document.createElement('img');
                    const reader = new FileReader();
                    
                    reader.onload = (e) => {
                        img.src = e.target.result;
                    };
                    
                    reader.readAsDataURL(file);
                    preview.appendChild(img);
                } else if (file.type.match('video/*')) {
                    const video = document.createElement('video');
                    const reader = new FileReader();
                    
                    reader.onload = (e) => {
                        video.src = e.target.result;
                    };
                    
                    reader.readAsDataURL(file);
                    preview.appendChild(video);
                }
                
                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-file';
                removeBtn.textContent = '×';
                removeBtn.addEventListener('click', () => {
                    preview.remove();
                });
                
                preview.appendChild(removeBtn);
                previewContainer.appendChild(preview);
            });
        }
    });
    
    // Calendar Preview
    const calendarGrid = document.querySelector('.calendar-grid');
    const calendarMonth = document.getElementById('calendar-month');
    
    if (calendarGrid && calendarMonth) {
        renderCalendar();
        
        // Calendar navigation
        const prevBtn = document.querySelector('.calendar-nav.prev');
        const nextBtn = document.querySelector('.calendar-nav.next');
        
        let currentDate = new Date();
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() - 1);
                renderCalendar();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() + 1);
                renderCalendar();
            });
        }
        
        function renderCalendar() {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                               'July', 'August', 'September', 'October', 'November', 'December'];
            
            calendarMonth.textContent = `${monthNames[month]} ${year}`;
            
            // Clear the grid
            calendarGrid.innerHTML = '';
            
            // Add day headers
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            dayNames.forEach(day => {
                const dayHeader = document.createElement('div');
                dayHeader.className = 'calendar-day day-header';
                dayHeader.innerHTML = `<span>${day}</span>`;
                calendarGrid.appendChild(dayHeader);
            });
            
            // Get the first day of the month
            const firstDay = new Date(year, month, 1).getDay();
            
            // Get the number of days in the month
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            // Add empty cells for days before the first day of the month
            for (let i = 0; i < firstDay; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.className = 'calendar-day empty';
                calendarGrid.appendChild(emptyDay);
            }
            
            // Generate dummy event data
            const eventDays = [];
            for (let i = 0; i < 10; i++) {
                eventDays.push(Math.floor(Math.random() * daysInMonth) + 1);
            }
            
            // Add days of the month
            for (let day = 1; day <= daysInMonth; day++) {
                const dayCell = document.createElement('div');
                const hasEvent = eventDays.includes(day);
                
                dayCell.className = `calendar-day${hasEvent ? ' has-event' : ''}`;
                dayCell.innerHTML = `
                    <span class="day-number">${day}</span>
                    ${hasEvent ? '<span class="event-dot"></span>' : ''}
                `;
                
                calendarGrid.appendChild(dayCell);
            }
        }
    }
    
    // Initialize Charts if available
    if (typeof Chart !== 'undefined') {
        // Follower Trends Chart
        const followerChartElement = document.getElementById('follower-chart');
        if (followerChartElement) {
            const followerChart = new Chart(followerChartElement, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Follower Growth',
                        data: [1200, 1900, 3000, 5000, 8200, 12800],
                        borderColor: '#0ea5e9',
                        backgroundColor: 'rgba(14, 165, 233, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.05)'
                            },
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.7)'
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.05)'
                            },
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.7)'
                            }
                        }
                    }
                }
            });
        }
        
        // Comparison Chart
        const comparisonChartElement = document.getElementById('comparison-chart');
        if (comparisonChartElement) {
            const comparisonChart = new Chart(comparisonChartElement, {
                type: 'bar',
                data: {
                    labels: ['Your Site', 'Competitor 1', 'Competitor 2', 'Competitor 3'],
                    datasets: [{
                        label: 'Domain Authority',
                        data: [35, 42, 38, 29],
                        backgroundColor: [
                            'rgba(14, 165, 233, 0.7)',
                            'rgba(168, 85, 247, 0.7)',
                            'rgba(236, 72, 153, 0.7)',
                            'rgba(34, 211, 238, 0.7)'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.05)'
                            },
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.7)'
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.05)'
                            },
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.7)'
                            }
                        }
                    }
                }
            });
        }
    }
    
    // URL Validation
    const urlInputs = document.querySelectorAll('.validate-url');
    
    urlInputs.forEach(input => {
        input.addEventListener('blur', () => {
            const value = input.value.trim();
            if (value && !value.match(/^https?:\/\/.+\..+/)) {
                input.classList.add('error');
                
                // Add a shake animation
                input.classList.add('shake-animation');
                setTimeout(() => {
                    input.classList.remove('shake-animation');
                }, 500);
            } else {
                input.classList.remove('error');
            }
        });
    });
    
    // Floating Action Button
    const fabMenu = document.querySelector('.fab-menu');
    const fabButton = document.querySelector('.fab-btn');
    
    if (fabButton && fabMenu) {
        // Already handled by CSS hover, but could add click for mobile
        fabButton.addEventListener('click', () => {
            fabMenu.classList.toggle('show');
        });
        
        // Handle fab menu item clicks
        const fabMenuItems = document.querySelectorAll('.fab-menu-item');
        
        fabMenuItems.forEach(item => {
            item.addEventListener('click', () => {
                const action = item.getAttribute('data-action');
                
                switch (action) {
                    case 'new-project':
                        // Handle new project
                        console.log('New project clicked');
                        break;
                    case 'export':
                        // Handle export
                        console.log('Export clicked');
                        break;
                    case 'settings':
                        // Handle settings
                        console.log('Settings clicked');
                        break;
                }
                
                fabMenu.classList.remove('show');
            });
        });
    }
    
    // Auto-suggest fields
    const autoSuggestInputs = document.querySelectorAll('.auto-suggest');
    
    // Sample data
    const competitorSuggestions = [
        'Amazon', 'Google', 'Microsoft', 'Apple', 'Facebook', 
        'Netflix', 'Tesla', 'Twitter', 'Adobe', 'Salesforce', 
        'Oracle', 'IBM', 'Intel', 'Samsung', 'Sony'
    ];
    
    autoSuggestInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const value = e.target.value.toLowerCase();
            
            // Remove any existing suggestion list
            const existingSuggestions = document.querySelector('.suggestion-list');
            if (existingSuggestions) {
                existingSuggestions.remove();
            }
            
            // If input has a value, show suggestions
            if (value) {
                const filteredSuggestions = competitorSuggestions.filter(sugg => 
                    sugg.toLowerCase().includes(value)
                );
                
                if (filteredSuggestions.length > 0) {
                    const suggestionList = document.createElement('div');
                    suggestionList.className = 'suggestion-list';
                    
                    filteredSuggestions.slice(0, 5).forEach(sugg => {
                        const suggItem = document.createElement('div');
                        suggItem.className = 'suggestion-item';
                        suggItem.textContent = sugg;
                        
                        suggItem.addEventListener('click', () => {
                            input.value = sugg;
                            suggestionList.remove();
                        });
                        
                        suggestionList.appendChild(suggItem);
                    });
                    
                    // Position the suggestion list
                    const inputRect = input.getBoundingClientRect();
                    suggestionList.style.position = 'absolute';
                    suggestionList.style.width = `${inputRect.width}px`;
                    suggestionList.style.top = `${inputRect.bottom}px`;
                    suggestionList.style.left = `${inputRect.left}px`;
                    suggestionList.style.zIndex = '1000';
                    
                    document.body.appendChild(suggestionList);
                    
                    // Close suggestions on click outside
                    document.addEventListener('click', (e) => {
                        if (!input.contains(e.target) && !suggestionList.contains(e.target)) {
                            suggestionList.remove();
                        }
                    });
                }
            }
        });
    });
    
    // Form submission handlers (prevent actual submission)
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Form submitted - would connect to n8n webhook here');
            
            // Show success message
            showNotification('Request sent to n8n successfully!', 'success');
        });
    });
    
    // Notification function
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="close-notification">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto-close after 5 seconds
        const timeout = setTimeout(() => {
            closeNotification();
        }, 5000);
        
        // Close button
        const closeBtn = notification.querySelector('.close-notification');
        closeBtn.addEventListener('click', () => {
            clearTimeout(timeout);
            closeNotification();
        });
        
        function closeNotification() {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }
    
    // Notify buttons
    const notifyBtns = document.querySelectorAll('.notify-btn');
    
    notifyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showNotification('You\'ll be notified when this feature is available!', 'info');
        });
    });
    
    // Connect button
    const connectBtn = document.querySelector('.connect-btn');
    if (connectBtn) {
        connectBtn.addEventListener('click', () => {
            alert('This would connect to your n8n backend via webhook.');
        });
    }
    
    // Handle analyze button for ICP agent
    const analyzeBtn = document.querySelector('.analyze-btn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', () => {
            processICPAnalysis();
        });
    }

    // Add event listener for Enter key on ICP website URL input
    const icpWebsiteUrlInput = document.getElementById('icp-website-url');
    if (icpWebsiteUrlInput) {
        icpWebsiteUrlInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                processICPAnalysis();
            }
        });
    }

    // Process ICP analysis
    function processICPAnalysis() {
        const websiteInput = document.getElementById('icp-website-url');
        if (!websiteInput) return;
        
        const websiteUrl = websiteInput.value.trim();
        const chatWindow = document.querySelector('#icp-agent-chat');
        const chatContent = chatWindow.querySelector('.chat-content');
        
        if (!websiteUrl) {
            // Shake the input to indicate it's required
            websiteInput.classList.add('shake-animation');
            setTimeout(() => {
                websiteInput.classList.remove('shake-animation');
            }, 500);
            return;
        }
        
        // Validate URL format
        if (!isValidUrl(websiteUrl)) {
            websiteInput.classList.add('error');
            websiteInput.classList.add('shake-animation');
            setTimeout(() => {
                websiteInput.classList.remove('shake-animation');
            }, 500);
            return;
        }
        
        websiteInput.classList.remove('error');
        
        // Create a user message showing the website
        const userMessage = document.createElement('div');
        userMessage.className = 'user-message';
        userMessage.innerHTML = `
            <div class="user-avatar">👤</div>
            <div class="message-content">Analyze website: ${websiteUrl}</div>
        `;
        
        chatContent.appendChild(userMessage);
        chatContent.scrollTop = chatContent.scrollHeight;
        
        // Send to n8n
        analyzeWebsite(websiteUrl, chatWindow, chatContent);
    }

    // Function to analyze website with n8n
    function analyzeWebsite(websiteUrl, chatWindow, chatContent) {
        // Add typing indicator if it doesn't exist
        let typingIndicator = chatContent.querySelector('.typing-indicator');
        if (!typingIndicator) {
            typingIndicator = document.createElement('div');
            typingIndicator.className = 'agent-message typing-indicator';
            
            typingIndicator.innerHTML = `
                <div class="agent-avatar">👥</div>
                <div class="message-content">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            `;
            
            chatContent.appendChild(typingIndicator);
            chatContent.scrollTop = chatContent.scrollHeight;
        }
        
        // Call n8n webhook - using the production URL
        const n8nWebhookUrl = 'https://primary-clgf-test.up.railway.app/webhook/ICP-SEO';
        
        // Prepare the data to send to n8n
        const requestData = {
            chatInput: websiteUrl
        };
        
        console.log('Sending data to n8n:', requestData);
        
        // Send request to n8n
        fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('ICP Data:', data.output); // Log the output as per the example
            
            // Remove typing indicator
            if (typingIndicator && typingIndicator.parentNode) {
                chatContent.removeChild(typingIndicator);
            }
            
            // Add agent response from n8n
            const agentMessage = document.createElement('div');
            agentMessage.className = 'agent-message';
            
            // Extract the text from the response - check for data.output first
            const responseText = data.output || data.json?.text || data.text || 'Analysis complete! I\'ve identified the ideal customer profile for your business.';
            
            agentMessage.innerHTML = `
                <div class="agent-avatar">👥</div>
                <div class="message-content">${responseText}</div>
            `;
            
            chatContent.appendChild(agentMessage);
            chatContent.scrollTop = chatContent.scrollHeight;
        })
        .catch(error => {
            console.error('Error connecting to n8n:', error);
            
            // Remove typing indicator
            if (typingIndicator && typingIndicator.parentNode) {
                chatContent.removeChild(typingIndicator);
            }
            
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'agent-message';
            errorMessage.innerHTML = `
                <div class="agent-avatar">👥</div>
                <div class="message-content">Sorry, I encountered an error connecting to the n8n service. Please try again later.</div>
            `;
            
            chatContent.appendChild(errorMessage);
            chatContent.scrollTop = chatContent.scrollHeight;
        });
    }
    
    // URL validation function
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
}); 