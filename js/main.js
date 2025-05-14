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
    
    // Initialize Calendar Form elements
    const uploadDocumentBtn = document.getElementById('upload-document-btn');
    const documentUploadInput = document.getElementById('document-upload');
    const calendarInputsForm = document.getElementById('calendar-inputs-form');
    const submitCalendarInputsBtn = document.getElementById('submit-calendar-inputs-btn');
    
    // Initialize On-Page SEO elements
    const uploadOnpageBtn = document.getElementById('upload-onpage-btn');
    const onpageDocumentInput = document.getElementById('onpage-document-upload');
    
    // Add click event to the document upload labels
    document.querySelectorAll('.upload-label').forEach(label => {
        label.addEventListener('click', (e) => {
            // Find the associated file input and click it
            const fileInput = label.parentElement.querySelector('.file-input');
            if (fileInput) {
                e.preventDefault();
                fileInput.click();
            }
        });
    });
    
    // Add file input change event handlers to show selected file name and auto-upload
    document.querySelectorAll('.file-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const label = e.target.parentElement.querySelector('.upload-label');
            if (label && e.target.files.length > 0) {
                const fileNameSpan = label.querySelector('span');
                if (fileNameSpan) {
                    fileNameSpan.textContent = `Selected: ${e.target.files[0].name}`;
                }
                
                // Make the upload button more prominent
                const uploadBtn = e.target.parentElement.querySelector('.neon-button');
                if (uploadBtn) {
                    uploadBtn.style.background = 'rgba(14, 165, 233, 0.4)';
                    uploadBtn.style.color = 'white';
                    
                    // Auto-trigger the upload button click
                    setTimeout(() => {
                        uploadBtn.click();
                    }, 500);
                }
            }
        });
    });
    
    // Set up Calendar Form event listeners
    if (uploadDocumentBtn && documentUploadInput) {
        uploadDocumentBtn.addEventListener('click', handleDocumentUpload);
    }
    
    if (submitCalendarInputsBtn) {
        submitCalendarInputsBtn.addEventListener('click', submitCalendarInputs);
    }
    
    // Set up On-Page SEO event listeners
    if (uploadOnpageBtn && onpageDocumentInput) {
        uploadOnpageBtn.addEventListener('click', handleOnpageUpload);
    }
    
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
                case 'topicresearch':
                    agentEmoji = '📚';
                    break;
                case 'smmcompetitor':
                    agentEmoji = '👁️';
                    break;
                case 'onpage':
                    agentEmoji = '🔍';
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
            else if (agentType === 'topicresearch') {
                // Connect to topic research webhook
                sendTopicResearch(messageText, chatWindow, chatContent, typingIndicator);
            }
            else if (agentType === 'keyword') {
                // For keyword agent, use similar approach as topic research
                sendKeywordResearch(messageText, chatWindow, chatContent, typingIndicator);
            }
            else if (agentType === 'smmcompetitor') {
                // Connect to SMM competitor webhook
                sendSMMCompetitor(messageText, chatWindow, chatContent, typingIndicator);
            }
            else if (agentType === 'competitor') {
                // Redirect to SMM competitor webhook for consistency
                sendCompetitorAnalysis(messageText, chatWindow, chatContent, typingIndicator);
            }
            else if (agentType === 'seocompetitor') {
                // Connect to SEO competitor webhook
                sendSEOCompetitor(messageText, chatWindow, chatContent, typingIndicator);
            }
            else {
                // For other agent types, use simulation
                simulateAgentResponse(agentType, messageText, typingIndicator, chatContent, agentEmoji);
            }
        }
    }
    
    // Separate function for simulated responses
    function simulateAgentResponse(agentType, messageText, typingIndicator, chatContent, agentEmoji) {
        // Simulate typing delay
        setTimeout(() => {
            // Remove typing indicator
            chatContent.removeChild(typingIndicator);
            
            // Create agent response
            const agentResponse = document.createElement('div');
            agentResponse.className = 'agent-message';
            
            let responseText = '';
            
            // Different responses based on agent type
            if (agentType === 'calendar') {
                // For the calendar agent, ask to upload document first instead of previous responses
                responseText = 'Please upload a document to get started with your social media calendar planning.';
                
                agentResponse.innerHTML = `
                    <div class="agent-avatar">${agentEmoji}</div>
                    <div class="message-content">${responseText}</div>
                `;
                
                chatContent.appendChild(agentResponse);
                chatContent.scrollTop = chatContent.scrollHeight;
                return;
            } else if (agentType === 'onpage') {
                // For the on-page SEO agent, ask to upload excel file
                responseText = 'Please upload an Excel file with your website data to begin the on-page SEO analysis.';
                
                agentResponse.innerHTML = `
                    <div class="agent-avatar">${agentEmoji}</div>
                    <div class="message-content">${responseText}</div>
                `;
                
                chatContent.appendChild(agentResponse);
                chatContent.scrollTop = chatContent.scrollHeight;
                return;
            } else if (agentType === 'competitor') {
                if (messageText.toLowerCase().includes('competitor') || messageText.toLowerCase().includes('competition')) {
                    responseText = `I've analyzed your competitor's social media activity. They post approximately 3 times per week with an average engagement rate of 4.2%. Their most successful content types are video tutorials and industry news updates.`;
                } else if (messageText.toLowerCase().includes('suggest') || messageText.toLowerCase().includes('recommend')) {
                    responseText = `Based on your industry and competitor analysis, I recommend focusing on creating more video content, posting consistently 4-5 times per week, and engaging with industry hashtags like #digitalmarketing and #growthhacking.`;
                }
            } else if (agentType === 'keyword') {
                responseText = `Based on your website, I recommend focusing on these keywords: "digital marketing automation" (difficulty: medium, volume: high), "marketing workflow automation" (difficulty: low, volume: medium), and "social media management tools" (difficulty: medium, volume: very high).`;
            } else if (agentType === 'seocompetitor') {
                responseText = `I've analyzed your competitors and found they're ranking for keywords you're missing. Top opportunities: "automated social posting" (low competition), "marketing dashboard tools" (medium traffic), and "social analytics platform" (high conversion potential).`;
            } else if (agentType === 'topicresearch') {
                responseText = `Based on your industry, I recommend these trending topics: "How AI is transforming marketing", "Sustainable brand strategies", and "User-generated content campaigns". These topics are showing high engagement across social platforms.`;
            }
            
            agentResponse.innerHTML = `
                <div class="agent-avatar">${agentEmoji}</div>
                <div class="message-content">${responseText}</div>
            `;
            
            chatContent.appendChild(agentResponse);
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
            let responseContent = data.output || data.json?.text || data.text || 'Analysis complete! I\'ve identified the ideal customer profile for your business.';
            const responseText = formatResponse(responseContent);
            
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

    // Function to handle Topic Research Agent
    function sendTopicResearch(messageText, chatWindow, chatContent, typingIndicator) {
        // Call n8n webhook - using the provided webhook URL
        const n8nWebhookUrl = 'https://primary-clgf-test.up.railway.app/webhook/topic-research';
        
        // Prepare the data to send to n8n - simplified to just use the message
        const requestData = {
            message: messageText,
            userInput: {
                query: messageText,
                timestamp: new Date().toISOString()
            }
        };
        
        console.log('Sending data to Topic Research Agent:', requestData);
        
        // Send request to n8n
        fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            console.log('Webhook response status:', response.status);
            return response.json().catch(e => {
                console.error('Error parsing JSON:', e);
                return { error: 'Invalid JSON response' };
            });
        })
        .then(data => {
            console.log('Topic Research Data:', data);
            
            // Remove typing indicator
            if (typingIndicator && typingIndicator.parentNode) {
                chatContent.removeChild(typingIndicator);
            }
            
            // Add agent response from n8n
            const agentMessage = document.createElement('div');
            agentMessage.className = 'agent-message';
            
            // Extract the response text from the data
            let responseText;
            
            if (data.error || data.code) {
                // If there's an error or the webhook returned an error code
                console.error('Webhook error:', data);
                
                // Fallback to simulated response
                responseText = getSimulatedResponse(messageText);
            } else {
                // Use the response exactly as received from the webhook
                const responseContent = data.response || data.output || data.text || getSimulatedResponse(messageText);
                responseText = formatResponse(responseContent);
            }
            
            agentMessage.innerHTML = `
                <div class="agent-avatar">📚</div>
                <div class="message-content">${responseText}</div>
            `;
            
            chatContent.appendChild(agentMessage);
            chatContent.scrollTop = chatContent.scrollHeight;
        })
        .catch(error => {
            console.error('Error connecting to topic research webhook:', error);
            
            // Remove typing indicator
            if (typingIndicator && typingIndicator.parentNode) {
                chatContent.removeChild(typingIndicator);
            }
            
            // Show fallback response with simulated content
            const errorMessage = document.createElement('div');
            errorMessage.className = 'agent-message';
            
            const fallbackResponse = getSimulatedResponse(messageText);
            const formattedResponse = formatResponse(fallbackResponse);
            
            errorMessage.innerHTML = `
                <div class="agent-avatar">📚</div>
                <div class="message-content">${formattedResponse}</div>
            `;
            
            chatContent.appendChild(errorMessage);
            chatContent.scrollTop = chatContent.scrollHeight;
        });
    }

    // Helper function to generate simulated responses when the webhook is unavailable
    function getSimulatedResponse(messageText) {
        const topic = messageText.toLowerCase();
        
        if (topic.includes('tech') || topic.includes('technology') || topic.includes('software')) {
            return `Based on my research of tech trends, here are some hot topics:<br><br>
                1. Generative AI implementation in business workflows<br>
                2. Edge computing for faster IoT applications<br>
                3. Cybersecurity for remote work environments<br>
                4. Sustainable technology and green computing<br>
                5. Web3 applications in traditional industries`;
        } 
        else if (topic.includes('marketing') || topic.includes('digital marketing')) {
            return `Here are trending topics in digital marketing:<br><br>
                1. AI-powered personalization strategies<br>
                2. Zero-party data collection methods<br>
                3. Short-form video content optimization<br>
                4. Voice search optimization techniques<br>
                5. Sustainability messaging in brand communications`;
        }
        else if (topic.includes('health') || topic.includes('wellness') || topic.includes('fitness')) {
            return `Trending health and wellness topics include:<br><br>
                1. Metabolic health optimization<br>
                2. Mind-body wellness integration<br>
                3. Sleep optimization techniques<br>
                4. Personalized nutrition planning<br>
                5. Community-based fitness programs`;
        }
        else if (topic.includes('finance') || topic.includes('money') || topic.includes('investing')) {
            return `Current trending financial topics include:<br><br>
                1. Sustainable investing frameworks<br>
                2. Decentralized finance adoption<br>
                3. Inflation hedging strategies<br>
                4. Financial literacy education<br>
                5. AI-powered personal finance tools`;
        }
        else {
            return `Based on my research for "${messageText}", here are some trending topics:<br><br>
                1. Innovative approaches to sustainability in this field<br>
                2. AI and automation integration opportunities<br>
                3. Community building and audience engagement strategies<br>
                4. Data-driven decision making frameworks<br>
                5. Cross-platform content strategies for maximum impact`;
        }
    }

    // Platform selector functionality
    const platformOptions = document.querySelectorAll('.platform-option');
    
    platformOptions.forEach(option => {
        option.addEventListener('click', () => {
            option.classList.toggle('active');
        });
    });
    
    // Specificity toggle functionality
    const specificityButtons = document.querySelectorAll('.toggle-btn[data-specificity]');
    
    specificityButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons in the group
            btn.parentElement.querySelectorAll('.toggle-btn').forEach(b => {
                b.classList.remove('active');
            });
            
            // Add active class to clicked button
            btn.classList.add('active');
        });
    });

    // Function to handle Keyword Agent
    function sendKeywordResearch(messageText, chatWindow, chatContent, typingIndicator) {
        // Use the specified webhook URL
        const n8nWebhookUrl = 'https://primary-clgf-test.up.railway.app/webhook/Keyword-SEO';
        
        // Prepare the data to send to n8n - just pass the raw message
        const requestData = {
            chatInput: messageText  // Using the same format as the ICP agent
        };
        
        console.log('Sending data to Keyword Agent:', requestData);
        
        // Send request to the webhook
        fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            console.log('Keyword Agent webhook response status:', response.status);
            return response.json().catch(e => {
                console.error('Error parsing JSON:', e);
                return { error: 'Invalid JSON response' };
            });
        })
        .then(data => {
            console.log('Keyword Agent Data:', data);
            
            // Remove typing indicator
            if (typingIndicator && typingIndicator.parentNode) {
                chatContent.removeChild(typingIndicator);
            }
            
            // Add agent response from webhook
            const agentMessage = document.createElement('div');
            agentMessage.className = 'agent-message';
            
            // Use whatever response comes from the webhook
            let responseText;
            
            if (data.error || data.code) {
                // If there's an error or the webhook returned an error code
                console.error('Webhook error:', data);
                responseText = 'Sorry, I encountered an error processing your request. Please try again later.';
            } else {
                // Use the response exactly as received from the webhook
                const responseContent = data.output || data.response || data.text || JSON.stringify(data);
                responseText = formatResponse(responseContent);
            }
            
            agentMessage.innerHTML = `
                <div class="agent-avatar">🔑</div>
                <div class="message-content">${responseText}</div>
            `;
            
            chatContent.appendChild(agentMessage);
            chatContent.scrollTop = chatContent.scrollHeight;
        })
        .catch(error => {
            console.error('Error connecting to keyword webhook:', error);
            
            // Remove typing indicator
            if (typingIndicator && typingIndicator.parentNode) {
                chatContent.removeChild(typingIndicator);
            }
            
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'agent-message';
            errorMessage.innerHTML = `
                <div class="agent-avatar">🔑</div>
                <div class="message-content">Sorry, I encountered an error connecting to the keyword research service. Please try again later.</div>
            `;
            
            chatContent.appendChild(errorMessage);
            chatContent.scrollTop = chatContent.scrollHeight;
        });
    }

    // Function to handle SMM Competitor Agent
    function sendSMMCompetitor(messageText, chatWindow, chatContent, typingIndicator) {
        // Use the specified webhook URL
        const n8nWebhookUrl = 'https://primary-clgf-test.up.railway.app/webhook/SMM-Compitator';
        
        // Prepare the data to send to n8n - just pass the raw message
        const requestData = {
            chatInput: messageText  // Using the same format as other agents
        };
        
        console.log('Sending data to SMM Competitor Agent:', requestData);
        
        // Send request to the webhook
        fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            console.log('SMM Competitor webhook response status:', response.status);
            return response.json().catch(e => {
                console.error('Error parsing JSON:', e);
                return { error: 'Invalid JSON response' };
            });
        })
        .then(data => {
            console.log('SMM Competitor Data:', data);
            
            // Remove typing indicator
            if (typingIndicator && typingIndicator.parentNode) {
                chatContent.removeChild(typingIndicator);
            }
            
            // Add agent response from webhook
            const agentMessage = document.createElement('div');
            agentMessage.className = 'agent-message';
            
            // Use whatever response comes from the webhook
            let responseText;
            
            if (data.error || data.code) {
                // If there's an error or the webhook returned an error code
                console.error('Webhook error:', data);
                responseText = 'Sorry, I encountered an error processing your request. Please try again later.';
            } else {
                // Use the response exactly as received from the webhook
                const responseContent = data.output || data.response || data.text || JSON.stringify(data);
                responseText = formatResponse(responseContent);
            }
            
            agentMessage.innerHTML = `
                <div class="agent-avatar">👁️</div>
                <div class="message-content">${responseText}</div>
            `;
            
            chatContent.appendChild(agentMessage);
            chatContent.scrollTop = chatContent.scrollHeight;
        })
        .catch(error => {
            console.error('Error connecting to SMM Competitor webhook:', error);
            
            // Remove typing indicator
            if (typingIndicator && typingIndicator.parentNode) {
                chatContent.removeChild(typingIndicator);
            }
            
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'agent-message';
            errorMessage.innerHTML = `
                <div class="agent-avatar">👁️</div>
                <div class="message-content">Sorry, I encountered an error connecting to the SMM Competitor service. Please try again later.</div>
            `;
            
            chatContent.appendChild(errorMessage);
            chatContent.scrollTop = chatContent.scrollHeight;
        });
    }

    // Function to handle original Competitor Agent
    function sendCompetitorAnalysis(messageText, chatWindow, chatContent, typingIndicator) {
        // Redirect to the same webhook as SMM Competitor Agent for consistency
        const n8nWebhookUrl = 'https://primary-clgf-test.up.railway.app/webhook/SMM-Compitator';
        
        // Prepare the data to send to n8n - just pass the raw message
        const requestData = {
            chatInput: messageText  // Using the same format as other agents
        };
        
        console.log('Sending data to Competitor Agent (redirected to SMM Competitor):', requestData);
        
        // Send request to the webhook
        fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            console.log('Competitor Agent webhook response status:', response.status);
            return response.json().catch(e => {
                console.error('Error parsing JSON:', e);
                return { error: 'Invalid JSON response' };
            });
        })
        .then(data => {
            console.log('Competitor Agent Data:', data);
            
            // Remove typing indicator
            if (typingIndicator && typingIndicator.parentNode) {
                chatContent.removeChild(typingIndicator);
            }
            
            // Add agent response from webhook
            const agentMessage = document.createElement('div');
            agentMessage.className = 'agent-message';
            
            // Use whatever response comes from the webhook
            let responseText;
            
            if (data.error || data.code) {
                // If there's an error from the webhook, fall back to simulation
                console.error('Webhook error:', data);
                responseText = simulateCompetitorResponse(messageText);
            } else {
                // Use the response exactly as received from the webhook
                const responseContent = data.output || data.response || data.text || JSON.stringify(data);
                responseText = formatResponse(responseContent);
            }
            
            agentMessage.innerHTML = `
                <div class="agent-avatar">🔍</div>
                <div class="message-content">${responseText}</div>
            `;
            
            chatContent.appendChild(agentMessage);
            chatContent.scrollTop = chatContent.scrollHeight;
        })
        .catch(error => {
            console.error('Error connecting to Competitor Agent webhook:', error);
            
            // Remove typing indicator
            if (typingIndicator && typingIndicator.parentNode) {
                chatContent.removeChild(typingIndicator);
            }
            
            // Fall back to simulation
            const errorMessage = document.createElement('div');
            errorMessage.className = 'agent-message';
            
            const fallbackResponse = simulateCompetitorResponse(messageText);
            
            errorMessage.innerHTML = `
                <div class="agent-avatar">🔍</div>
                <div class="message-content">${fallbackResponse}</div>
            `;
            
            chatContent.appendChild(errorMessage);
            chatContent.scrollTop = chatContent.scrollHeight;
        });
    }
    
    // Helper function to generate simulated competitor responses
    function simulateCompetitorResponse(messageText) {
        if (messageText.toLowerCase().includes('competitor') || messageText.toLowerCase().includes('competition')) {
            return `I've analyzed your competitor's social media activity. They post approximately 3 times per week with an average engagement rate of 4.2%. Their most successful content types are video tutorials and industry news updates.`;
        } else if (messageText.toLowerCase().includes('suggest') || messageText.toLowerCase().includes('recommend')) {
            return `Based on your industry and competitor analysis, I recommend focusing on creating more video content, posting consistently 4-5 times per week, and engaging with industry hashtags like #digitalmarketing and #growthhacking.`;
        } else {
            return `I've analyzed the competitor "${messageText}". Their content strategy focuses on educational posts (40%), promotional content (30%), and user-generated content (30%). Their highest engagement comes from video content posted on weekdays between 10am-2pm.`;
        }
    }

    // Function to handle SEO Competitor Agent
    function sendSEOCompetitor(messageText, chatWindow, chatContent, typingIndicator) {
        // Use the specified webhook URL for SEO competitor analysis
        const n8nWebhookUrl = 'https://primary-clgf-test.up.railway.app/webhook/SEO-Compitator';
        
        // Prepare the data to send to n8n - just pass the raw message
        const requestData = {
            chatInput: messageText  // Using the same format as other agents
        };
        
        console.log('Sending data to SEO Competitor Agent:', requestData);
        
        // Send request to the webhook
        fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            console.log('SEO Competitor webhook response status:', response.status);
            return response.json().catch(e => {
                console.error('Error parsing JSON:', e);
                return { error: 'Invalid JSON response' };
            });
        })
        .then(data => {
            console.log('SEO Competitor Data:', data);
            
            // Remove typing indicator
            if (typingIndicator && typingIndicator.parentNode) {
                chatContent.removeChild(typingIndicator);
            }
            
            // Add agent response from webhook
            const agentMessage = document.createElement('div');
            agentMessage.className = 'agent-message';
            
            // Use whatever response comes from the webhook
            let responseText;
            
            if (data.error || data.code) {
                // If there's an error or the webhook returned an error code
                console.error('Webhook error:', data);
                responseText = simulateSEOCompetitorResponse(messageText);
            } else {
                // Use the response exactly as received from the webhook
                const responseContent = data.output || data.response || data.text || JSON.stringify(data);
                responseText = formatResponse(responseContent);
            }
            
            agentMessage.innerHTML = `
                <div class="agent-avatar">📊</div>
                <div class="message-content">${responseText}</div>
            `;
            
            chatContent.appendChild(agentMessage);
            chatContent.scrollTop = chatContent.scrollHeight;
        })
        .catch(error => {
            console.error('Error connecting to SEO Competitor webhook:', error);
            
            // Remove typing indicator
            if (typingIndicator && typingIndicator.parentNode) {
                chatContent.removeChild(typingIndicator);
            }
            
            // Fall back to simulation
            const errorMessage = document.createElement('div');
            errorMessage.className = 'agent-message';
            
            const fallbackResponse = simulateSEOCompetitorResponse(messageText);
            
            errorMessage.innerHTML = `
                <div class="agent-avatar">📊</div>
                <div class="message-content">${fallbackResponse}</div>
            `;
            
            chatContent.appendChild(errorMessage);
            chatContent.scrollTop = chatContent.scrollHeight;
        });
    }
    
    // Helper function to generate simulated SEO competitor responses
    function simulateSEOCompetitorResponse(messageText) {
        return `I've analyzed your competitors and found they're ranking for keywords you're missing. Top opportunities: "automated social posting" (low competition), "marketing dashboard tools" (medium traffic), and "social analytics platform" (high conversion potential).`;
    }

    // Helper functions for formatting responses
    function formatResponse(responseData) {
        if (!responseData) return 'No response received.';
        
        try {
            // If it's a string, check if it's JSON, Markdown or plain text
            if (typeof responseData === 'string') {
                // Check if it has table markers
                if (responseData.includes('|') && 
                    responseData.split('\n').filter(line => line.trim().startsWith('|')).length >= 2) {
                    return formatMarkdownResponse(responseData);
                }
                
                // Try to parse as JSON
                try {
                    const jsonData = JSON.parse(responseData);
                    return formatJsonResponse(jsonData);
                } catch (e) {
                    // Not JSON, check if it's markdown
                    if (responseData.includes('#') || responseData.includes('*') || 
                        responseData.includes('```')) {
                        return formatMarkdownResponse(responseData);
                    }
                    // Plain text, return as is with proper line breaks
                    return responseData.replace(/\n/g, '<br>');
                }
            }
            
            // If it's already an object
            return formatJsonResponse(responseData);
            
        } catch (e) {
            console.error('Error formatting response:', e);
            return String(responseData).replace(/\n/g, '<br>');
        }
    }

    // Format JSON responses
    function formatJsonResponse(data) {
        if (!data) return '';
        
        // Handle arrays
        if (Array.isArray(data)) {
            return formatArrayResponse(data);
        }
        
        // Handle objects with markdown content
        if (data.markdown || data.md) {
            return formatMarkdownResponse(data.markdown || data.md);
        }
        
        // Handle objects
        return formatObjectResponse(data);
    }

    // Format array data into HTML
    function formatArrayResponse(array) {
        if (!array.length) return '[]';
        
        // Check if array contains objects (for table display)
        if (typeof array[0] === 'object' && array[0] !== null) {
            const keys = Object.keys(array[0]);
            if (!keys.length) return JSON.stringify(array);
            
            // Create HTML table
            let table = '<table class="response-table"><thead><tr>';
            keys.forEach(key => {
                table += `<th>${escapeHtml(key)}</th>`;
            });
            table += '</tr></thead><tbody>';
            
            // Add rows
            array.forEach(item => {
                table += '<tr>';
                keys.forEach(key => {
                    const value = item[key] !== undefined && item[key] !== null 
                        ? String(item[key]) 
                        : '';
                    table += `<td>${escapeHtml(value)}</td>`;
                });
                table += '</tr>';
            });
            
            table += '</tbody></table>';
            
            // Add table styles
            addResponseTableStyles();
            
            return table;
        }
        
        // Simple array - create a list
        return '<ul class="response-list">' + 
            array.map(item => `<li>${typeof item === 'object' ? formatJsonResponse(item) : escapeHtml(String(item))}</li>`).join('') + 
            '</ul>';
    }

    // Format object data into HTML
    function formatObjectResponse(obj) {
        if (!obj || Object.keys(obj).length === 0) return '{}';
        
        // Handle special cases
        if (obj.html) return obj.html;
        if (obj.text) return escapeHtml(obj.text);
        
        // Create a definition list
        let html = '<dl class="response-object">';
        for (const [key, value] of Object.entries(obj)) {
            if (key.startsWith('_') || value === null || value === undefined) continue;
            
            html += `<dt>${escapeHtml(key)}</dt>`;
            
            if (typeof value === 'object') {
                html += `<dd>${formatJsonResponse(value)}</dd>`;
            } else {
                html += `<dd>${escapeHtml(String(value))}</dd>`;
            }
        }
        html += '</dl>';
        
        // Add object styles
        addObjectStyles();
        
        return html;
    }

    // Format markdown text into HTML
    function formatMarkdownResponse(markdown) {
        if (!markdown) return '';
        
        // Parse markdown
        let html = markdown;
        
        // Special handling for notes sections (starting with ### Notes or something similar)
        if (markdown.includes('### Notes') || markdown.includes('## Notes') || 
            markdown.includes('# Notes') || markdown.includes('```')) {
            // Process just the notes section better
            html = processNotesSection(markdown);
        }
        
        // Check if there's a table in the content
        const hasTable = markdown.includes('|') && markdown.split('\n').filter(line => line.trim().startsWith('|')).length >= 2;
        
        if (hasTable) {
            // Extract the first table only to prevent duplicates
            const tableLines = markdown.split('\n').filter(line => line.trim().startsWith('|'));
            
            // Find where the table ends - usually after a blank line or non-table line
            let tableEndIndex = 0;
            for (let i = 0; i < tableLines.length; i++) {
                if (i > 0 && (tableLines[i].trim() === '' || !tableLines[i].trim().startsWith('|'))) {
                    tableEndIndex = i;
                    break;
                }
            }
            
            // Get only the first table if we found the end
            const uniqueTableLines = tableEndIndex > 0 ? tableLines.slice(0, tableEndIndex) : tableLines;
            
            // Process table with our custom function
            const processedTable = processMarkdownTable(uniqueTableLines);
            
            // Replace all table content with our processed table
            // First create a regex that matches the entire table block
            const tableRegex = new RegExp(
                uniqueTableLines.map(line => escapeRegExp(line)).join('\\s*\\n\\s*'), 
                'g'
            );
            
            html = html.replace(tableRegex, processedTable);
            
            // Remove any potential duplicate tables
            const remainingTableLines = html.split('\n').filter(line => 
                line.trim().startsWith('|') && !uniqueTableLines.includes(line)
            );
            
            if (remainingTableLines.length > 0) {
                // Create a regex to match any remaining tables
                const remainingTableRegex = new RegExp(
                    '\\|.+\\|\\s*\\n\\s*\\|[-:\\s|]+\\|\\s*\\n(\\s*\\|.+\\|\\s*\\n)+', 
                    'g'
                );
                
                // Find the first match and keep it, remove other matches
                let foundFirstMatch = false;
                html = html.replace(remainingTableRegex, match => {
                    if (!foundFirstMatch) {
                        foundFirstMatch = true;
                        return match;
                    }
                    return '';
                });
            }
        }
        
        // Process non-table markdown elements
        html = processGeneralMarkdown(html);
        
        // Add markdown styles
        addMarkdownStyles();
        
        return html;
    }

    // Helper function to process general markdown
    function processGeneralMarkdown(text) {
        let processed = text
            // Headers
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            
            // Emphasis
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/__(.*?)__/g, '<strong>$1</strong>')
            .replace(/_(.*?)_/g, '<em>$1</em>')
            
            // Lists
            .replace(/^\s*[-*]\s+(.*?)$/gm, '<li>$1</li>')
            .replace(/^\s*\d+\.\s+(.*?)$/gm, '<li>$1</li>')
            
            // Code blocks
            .replace(/```(?:\w+)?\n([\s\S]*?)```/g, '<pre class="code-block"><code>$1</code></pre>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            
            // Links
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="response-link">$1</a>')
            
            // Paragraphs
            .replace(/\n\s*\n/g, '</p><p>');
        
        // Clean up list items
        if (processed.includes('<li>')) {
            processed = processed.replace(/<li>[\s\S]*?<\/li>/g, function(match) {
                return '<ul class="response-list">' + match + '</ul>';
            }).replace(/<\/ul><ul class="response-list">/g, '');
        }
        
        // Wrap in paragraphs if needed
        if (!processed.trim().startsWith('<')) {
            processed = '<p>' + processed + '</p>';
        }
        
        return processed;
    }

    // Special handling for notes sections
    function processNotesSection(text) {
        // First clean up hashtags that are used as notes markers
        let processed = text.replace(/^[\s#]+Notes:?[\s-]*/im, '<div class="notes-section"><h3>Notes:</h3>');
        
        // Look for other patterns that might indicate notes or comments
        if (!processed.includes('<div class="notes-section">')) {
            processed = processed.replace(/^[\s#]+.*(notes|comments|observations).*:?[\s-]*/im, 
                '<div class="notes-section"><h3>Notes:</h3>');
        }
        
        // Handle important points marked with hashtags/pound signs
        processed = processed.replace(/(?:^|\n)[\s]*#+[\s]*(.*?)(?:\n|$)/g, function(match, content) {
            if (content.toLowerCase().includes('note') || 
                content.toLowerCase().includes('important') || 
                content.toLowerCase().includes('key point')) {
                return `\n<h3>${content}</h3>\n`;
            }
            return match;
        });
        
        // Special handling for notes with dashes or asterisks as bullet points
        processed = processed.replace(/(?:^|\n)[\s]*-[\s]*(.*?)(?:\n|$)/g, '<div class="note-point">• $1</div>');
        processed = processed.replace(/(?:^|\n)[\s]*\*[\s]*(.*?)(?:\n|$)/g, '<div class="note-point">• $1</div>');
        
        // Special handling for patterns like "- **Keyword Intent**:"
        processed = processed.replace(/(?:^|\n)[\s]*-[\s]*\*\*(.*?)\*\*:[\s]*(.*?)(?:\n|$)/g, 
            '<div class="note-item"><span class="note-label">$1:</span> $2</div>');
        
        // Add closing div if we opened a notes section
        if (processed.includes('<div class="notes-section">') && !processed.includes('</div>')) {
            processed += '</div>';
        }
        
        // Add appropriate styles
        addNotesStyles();
        
        return processed;
    }

    // Function to process markdown tables
    function processMarkdownTable(tableLines) {
        if (!tableLines || tableLines.length < 2) return '';
        
        // Create HTML table
        let table = '<table class="md-table">';
        
        // Process header
        const headerRow = tableLines[0];
        const headerCells = headerRow.split('|').slice(1, -1);
        table += '<thead><tr>';
        headerCells.forEach(cell => {
            table += `<th>${escapeHtml(cell.trim())}</th>`;
        });
        table += '</tr></thead>';
        
        // Skip separator row (row 1)
        const dataRows = tableLines.slice(2);
        
        // Process data rows
        table += '<tbody>';
        dataRows.forEach(row => {
            // Skip empty rows or non-table rows
            if (!row.trim() || !row.trim().startsWith('|')) return;
            
            const cells = row.split('|').slice(1, -1);
            table += '<tr>';
            cells.forEach(cell => {
                table += `<td>${escapeHtml(cell.trim())}</td>`;
            });
            table += '</tr>';
        });
        table += '</tbody></table>';
        
        // Add table styles
        addResponseTableStyles();
        
        return table;
    }

    // Add styles for notes sections
    function addNotesStyles() {
        if (!document.getElementById('notes-style')) {
            const style = document.createElement('style');
            style.id = 'notes-style';
            style.textContent = `
                .notes-section {
                    margin: 15px 0;
                    padding: 15px;
                    background: rgba(14, 165, 233, 0.1);
                    border-left: 4px solid var(--accent-blue, #0ea5e9);
                    border-radius: 8px;
                }
                .notes-section h3 {
                    color: var(--accent-blue, #0ea5e9);
                    margin-top: 0;
                    font-size: 1.1em;
                }
                .note-point {
                    margin: 8px 0;
                    line-height: 1.5;
                    display: flex;
                    align-items: flex-start;
                }
                .note-point:before {
                    content: "•";
                    color: var(--accent-blue, #0ea5e9);
                    font-weight: bold;
                    display: inline-block;
                    width: 1em;
                    margin-left: -1em;
                }
                .note-item {
                    margin: 10px 0;
                    line-height: 1.5;
                }
                .note-label {
                    font-weight: bold;
                    color: var(--accent-blue, #0ea5e9);
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Add styles for tables
    function addResponseTableStyles() {
        if (!document.getElementById('response-table-style')) {
            const style = document.createElement('style');
            style.id = 'response-table-style';
            style.textContent = `
                .response-table, .md-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 12px 0;
                    font-size: 0.9em;
                    background: rgba(7, 89, 133, 0.15);
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                }
                .response-table th, .response-table td,
                .md-table th, .md-table td {
                    padding: 10px 15px;
                    text-align: left;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                .response-table th, .md-table th {
                    background-color: rgba(14, 165, 233, 0.25);
                    color: #fff;
                    font-weight: 500;
                    text-transform: uppercase;
                    font-size: 0.8em;
                    letter-spacing: 1px;
                }
                .response-table tr:hover, .md-table tr:hover {
                    background-color: rgba(255, 255, 255, 0.05);
                }
                .response-table tr:last-child td, .md-table tr:last-child td {
                    border-bottom: none;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Add styles for objects
    function addObjectStyles() {
        if (!document.getElementById('response-object-style')) {
            const style = document.createElement('style');
            style.id = 'response-object-style';
            style.textContent = `
                .response-object {
                    margin: 12px 0;
                    padding: 0;
                    background: rgba(7, 89, 133, 0.15);
                    border-radius: 8px;
                    padding: 12px;
                }
                .response-object dt {
                    font-weight: bold;
                    color: var(--accent-blue, #0ea5e9);
                    margin-top: 10px;
                    font-size: 0.9em;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding-bottom: 4px;
                }
                .response-object dd {
                    margin-left: 0;
                    margin-top: 6px;
                    margin-bottom: 12px;
                    line-height: 1.5;
                }
                .response-list {
                    margin: 10px 0;
                    padding-left: 20px;
                }
                .response-list li {
                    margin-bottom: 6px;
                }
                .response-link {
                    color: var(--accent-blue, #0ea5e9);
                    text-decoration: none;
                    border-bottom: 1px dotted var(--accent-blue, #0ea5e9);
                }
                .response-link:hover {
                    opacity: 0.8;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Add styles for markdown
    function addMarkdownStyles() {
        if (!document.getElementById('markdown-style')) {
            const style = document.createElement('style');
            style.id = 'markdown-style';
            style.textContent = `
                .code-block {
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 5px;
                    padding: 12px;
                    margin: 12px 0;
                    overflow-x: auto;
                    font-family: 'Fira Code', monospace, Consolas, 'Courier New';
                    font-size: 0.9em;
                    border-left: 3px solid var(--accent-blue, #0ea5e9);
                }
                code {
                    font-family: 'Fira Code', monospace, Consolas, 'Courier New';
                    background: rgba(0, 0, 0, 0.2);
                    padding: 2px 5px;
                    border-radius: 3px;
                    font-size: 0.9em;
                }
                h1, h2, h3 {
                    color: var(--accent-blue, #0ea5e9);
                    margin: 15px 0 10px 0;
                }
                h1 { font-size: 1.6em; }
                h2 { font-size: 1.3em; }
                h3 { font-size: 1.1em; }
            `;
            document.head.appendChild(style);
        }
    }

    // Helper function to escape HTML
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Helper function to escape regex special characters
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Function to handle document upload for the Calendar Agent
    function handleDocumentUpload() {
        const chatWindow = document.getElementById('calendar-agent-chat');
        const chatContent = chatWindow.querySelector('.chat-content');
        
        if (!documentUploadInput.files || documentUploadInput.files.length === 0) {
            // Create error message if no file is selected
            const errorMessage = document.createElement('div');
            errorMessage.className = 'agent-message';
            errorMessage.innerHTML = `
                <div class="agent-avatar">📅</div>
                <div class="message-content">Please select a document to upload.</div>
            `;
            chatContent.appendChild(errorMessage);
            chatContent.scrollTop = chatContent.scrollHeight;
            return;
        }
        
        const file = documentUploadInput.files[0];
        console.log('Calendar Agent: Selected file:', file.name, 'Type:', file.type, 'Size:', file.size);
        
        // Add user message showing the file being uploaded
        const userMessage = document.createElement('div');
        userMessage.className = 'user-message';
        userMessage.innerHTML = `
            <div class="user-avatar">👤</div>
            <div class="message-content">Uploading file: ${file.name}</div>
        `;
        chatContent.appendChild(userMessage);
        
        const formData = new FormData();
        
        // Add the file with the key 'file' which is commonly expected by APIs
        formData.append('file', file);
        // Also add with 'document' to maintain compatibility with existing code
        formData.append('document', file);
        
        // Add typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'agent-message typing-indicator';
        typingIndicator.innerHTML = `
            <div class="agent-avatar">📅</div>
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
        
        // Send document to webhook
        const uploadWebhookUrl = 'https://primary-clgf-test.up.railway.app/webhook/upload';
        console.log('Calendar Agent: Sending file to webhook:', uploadWebhookUrl);
        
        fetch(uploadWebhookUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            console.log('Calendar Agent: Document upload response status:', response.status);
            return response.json().catch(e => {
                console.error('Calendar Agent: Error parsing JSON:', e);
                return { error: 'Invalid JSON response' };
            });
        })
        .then(data => {
            console.log('Calendar Agent: Document upload response data:', data);
            
            // Remove typing indicator
            if (typingIndicator && typingIndicator.parentNode) {
                chatContent.removeChild(typingIndicator);
            }
            
            // Add success message
            const successMessage = document.createElement('div');
            successMessage.className = 'agent-message';
            successMessage.innerHTML = `
                <div class="agent-avatar">📅</div>
                <div class="message-content">
                    Document "${file.name}" has been uploaded successfully! Please fill out the form below to continue.
                </div>
            `;
            chatContent.appendChild(successMessage);
            
            // Show the inputs form
            if (calendarInputsForm) {
                calendarInputsForm.style.display = 'block';
            }
            
            chatContent.scrollTop = chatContent.scrollHeight;
        })
        .catch(error => {
            console.error('Calendar Agent: Error uploading document:', error);
            
            // Remove typing indicator
            if (typingIndicator && typingIndicator.parentNode) {
                chatContent.removeChild(typingIndicator);
            }
            
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'agent-message';
            errorMessage.innerHTML = `
                <div class="agent-avatar">📅</div>
                <div class="message-content">
                    There was an error uploading your document. Please try again.
                </div>
            `;
            chatContent.appendChild(errorMessage);
            chatContent.scrollTop = chatContent.scrollHeight;
        });
    }
    
    // Function to submit calendar form inputs
    function submitCalendarInputs() {
        const chatWindow = document.getElementById('calendar-agent-chat');
        const chatContent = chatWindow.querySelector('.chat-content');
        
        // Get form values
        const niche = document.getElementById('niche-input').value;
        const audience = document.getElementById('audience-input').value;
        const tone = document.getElementById('tone-input').value;
        const platforms = document.getElementById('platforms-input').value;
        const duration = document.getElementById('duration-input').value;
        const company = document.getElementById('company-input').value;
        
        // Prepare form data
        const formData = {
            niche: niche,
            audience: audience,
            tone: tone,
            platforms: platforms,
            duration: duration,
            company: company
        };
        
        // Add typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'agent-message typing-indicator';
        typingIndicator.innerHTML = `
            <div class="agent-avatar">📅</div>
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
        
        // Submit form data to webhook
        const calendarInputWebhookUrl = 'https://primary-clgf-test.up.railway.app/webhook/Calender-Input';
        
        fetch(calendarInputWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            console.log('Calendar input response status:', response.status);
            return response.json().catch(e => {
                console.error('Error parsing JSON:', e);
                return { error: 'Invalid JSON response' };
            });
        })
        .then(data => {
            console.log('Calendar input response:', data);
            
            // Remove typing indicator
            if (typingIndicator && typingIndicator.parentNode) {
                chatContent.removeChild(typingIndicator);
            }
            
            // Hide the form after submission
            if (calendarInputsForm) {
                calendarInputsForm.style.display = 'none';
            }
            
            // Add success message with webhook response
            const responseMessage = document.createElement('div');
            responseMessage.className = 'agent-message';
            
            // Use the response from webhook or fallback to a default message
            const responseContent = data.response || data.message || data.text || 
                'Calender has been generated, please check your Google Sheet.';
            
            responseMessage.innerHTML = `
                <div class="agent-avatar">📅</div>
                <div class="message-content">${formatResponse(responseContent)}</div>
            `;
            
            chatContent.appendChild(responseMessage);
            chatContent.scrollTop = chatContent.scrollHeight;
        })
        .catch(error => {
            console.error('Error submitting calendar inputs:', error);
            
            // Remove typing indicator
            if (typingIndicator && typingIndicator.parentNode) {
                chatContent.removeChild(typingIndicator);
            }
            
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'agent-message';
            errorMessage.innerHTML = `
                <div class="agent-avatar">📅</div>
                <div class="message-content">
                    There was an error processing your request. Please try again.
                </div>
            `;
            chatContent.appendChild(errorMessage);
            chatContent.scrollTop = chatContent.scrollHeight;
        });
    }

    // Function to handle On-Page SEO upload
    function handleOnpageUpload() {
        const chatWindow = document.getElementById('onpage-agent-chat');
        const chatContent = chatWindow.querySelector('.chat-content');
        
        if (!onpageDocumentInput.files || onpageDocumentInput.files.length === 0) {
            // Create error message if no file is selected
            const errorMessage = document.createElement('div');
            errorMessage.className = 'agent-message';
            errorMessage.innerHTML = `
                <div class="agent-avatar">🔍</div>
                <div class="message-content">Please select a file to upload.</div>
            `;
            chatContent.appendChild(errorMessage);
            chatContent.scrollTop = chatContent.scrollHeight;
            return;
        }
        
        const file = onpageDocumentInput.files[0];
        console.log('On-Page SEO Agent: Selected file:', file.name, 'Type:', file.type, 'Size:', file.size);
        
        // Add user message showing the file being uploaded
        const userMessage = document.createElement('div');
        userMessage.className = 'user-message';
        userMessage.innerHTML = `
            <div class="user-avatar">👤</div>
            <div class="message-content">Uploading file: ${file.name}</div>
        `;
        chatContent.appendChild(userMessage);
        
        const formData = new FormData();
        
        // Add the file with the key 'file' which is commonly expected by APIs
        formData.append('file', file);
        // Also add with 'document' to maintain compatibility with existing code
        formData.append('document', file);
        
        // Add typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'agent-message typing-indicator';
        typingIndicator.innerHTML = `
            <div class="agent-avatar">🔍</div>
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
        
        // Send document to webhook - using the correct On-Page SEO webhook
        const uploadWebhookUrl = 'https://primary-clgf-test.up.railway.app/webhook/On-Page';
        console.log('On-Page SEO Agent: Sending file to webhook:', uploadWebhookUrl);
        
        fetch(uploadWebhookUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            console.log('On-Page SEO Agent: Document upload response status:', response.status);
            return response.json().catch(e => {
                console.error('On-Page SEO Agent: Error parsing JSON:', e);
                return { error: 'Invalid JSON response' };
            });
        })
        .then(data => {
            console.log('On-Page SEO Agent: Document upload response data:', data);
            
            // Remove typing indicator
            if (typingIndicator && typingIndicator.parentNode) {
                chatContent.removeChild(typingIndicator);
            }
            
            // Add success message with response data
            const successMessage = document.createElement('div');
            successMessage.className = 'agent-message';
            
            // Use the response from webhook or fallback to a default message
            const responseContent = data.response || data.message || data.text || 
                `Your On-Page SEO analysis of "${file.name}" is complete. Here are the results:`;
            
            successMessage.innerHTML = `
                <div class="agent-avatar">🔍</div>
                <div class="message-content">${formatResponse(responseContent)}</div>
            `;
            
            chatContent.appendChild(successMessage);
            chatContent.scrollTop = chatContent.scrollHeight;
        })
        .catch(error => {
            console.error('On-Page SEO Agent: Error uploading document:', error);
            
            // Remove typing indicator
            if (typingIndicator && typingIndicator.parentNode) {
                chatContent.removeChild(typingIndicator);
            }
            
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'agent-message';
            errorMessage.innerHTML = `
                <div class="agent-avatar">🔍</div>
                <div class="message-content">
                    There was an error processing your On-Page SEO analysis. Please try again.
                </div>
            `;
            chatContent.appendChild(errorMessage);
            chatContent.scrollTop = chatContent.scrollHeight;
        });
    }
}); 
