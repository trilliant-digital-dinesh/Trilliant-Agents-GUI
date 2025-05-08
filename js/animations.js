// Advanced Animations and Micro-interactions
document.addEventListener('DOMContentLoaded', () => {
    // Ripple effect for buttons
    const buttons = document.querySelectorAll('.neon-button, .glass-btn, .toggle-btn, .fab-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.top = `${y}px`;
            ripple.style.left = `${x}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Floating panels effect - subtle mouse movement parallax
    const glassPanels = document.querySelectorAll('.glass-panel');
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        glassPanels.forEach(panel => {
            const rect = panel.getBoundingClientRect();
            const panelCenterX = rect.left + rect.width / 2;
            const panelCenterY = rect.top + rect.height / 2;
            
            const distanceX = (e.clientX - panelCenterX) / 20;
            const distanceY = (e.clientY - panelCenterY) / 20;
            
            const maxMovement = 5; // maximum pixels to move
            const moveX = Math.min(Math.max(distanceX, -maxMovement), maxMovement);
            const moveY = Math.min(Math.max(distanceY, -maxMovement), maxMovement);
            
            // Only apply the effect if mouse is somewhat near the panel
            if (Math.abs(distanceX) < 100 && Math.abs(distanceY) < 100) {
                panel.style.transform = `translateY(-3px) perspective(1000px) rotateX(${-moveY * 0.2}deg) rotateY(${moveX * 0.2}deg)`;
            } else {
                panel.style.transform = 'translateY(-3px)';
            }
        });
    });
    
    // Reset panel positions when mouse leaves
    document.addEventListener('mouseleave', () => {
        glassPanels.forEach(panel => {
            panel.style.transform = 'translateY(-3px)';
        });
    });
    
    // Typing effect for the "Content Strategy AI Coming Soon..."
    const typingText = document.querySelector('.typing-text');
    
    if (typingText) {
        // Set initial empty content
        const finalText = typingText.textContent;
        typingText.textContent = '';
        
        // Start typing after a delay
        setTimeout(() => {
            let charIndex = 0;
            
            const typingInterval = setInterval(() => {
                if (charIndex < finalText.length) {
                    typingText.textContent += finalText.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(typingInterval);
                    
                    // After finishing, wait and restart
                    setTimeout(() => {
                        typingText.textContent = '';
                        charIndex = 0;
                        
                        // Start typing again
                        const restartTyping = setInterval(() => {
                            if (charIndex < finalText.length) {
                                typingText.textContent += finalText.charAt(charIndex);
                                charIndex++;
                            } else {
                                clearInterval(restartTyping);
                            }
                        }, 100);
                    }, 3000);
                }
            }, 100);
        }, 1000);
    }
    
    // Scroll animations for panels
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    glassPanels.forEach(panel => {
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(20px)';
        panel.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(panel);
    });
    
    // Add the CSS class for visible panels
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .glass-panel.visible {
                opacity: 1 !important;
                transform: translateY(-3px) !important;
            }
            
            .ripple-effect {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                width: 100px;
                height: 100px;
                margin-top: -50px;
                margin-left: -50px;
            }
            
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(17, 24, 39, 0.9);
                border-left: 4px solid #0ea5e9;
                border-radius: 4px;
                padding: 16px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                transform: translateX(120%);
                transition: transform 0.3s ease;
                z-index: 1000;
                backdrop-filter: blur(10px);
                max-width: 350px;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification.success {
                border-left-color: #10b981;
            }
            
            .notification.error {
                border-left-color: #ef4444;
            }
            
            .notification.info {
                border-left-color: #0ea5e9;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .close-notification {
                background: none;
                border: none;
                color: #9ca3af;
                font-size: 1.2rem;
                cursor: pointer;
                margin-left: 10px;
            }
            
            .suggestion-list {
                background: rgba(30, 41, 59, 0.95);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 0 0 4px 4px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                overflow: hidden;
                backdrop-filter: blur(10px);
            }
            
            .suggestion-item {
                padding: 10px 15px;
                cursor: pointer;
                transition: background 0.2s ease;
            }
            
            .suggestion-item:hover {
                background: rgba(14, 165, 233, 0.1);
            }
            
            .shake-animation {
                animation: shake 0.5s ease-in-out;
            }
            
            input.error {
                border-color: #ef4444;
                box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.25);
            }
        </style>
    `);
    
    // Animated placeholders
    const placeholderBars = document.querySelectorAll('.placeholder-bar');
    
    placeholderBars.forEach(bar => {
        const shimmer = document.createElement('div');
        shimmer.className = 'shimmer';
        shimmer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            animation: shimmer 2s infinite;
            background: linear-gradient(
                90deg, 
                rgba(14, 165, 233, 0.2) 0%, 
                rgba(14, 165, 233, 0.5) 50%, 
                rgba(14, 165, 233, 0.2) 100%
            );
            transform: translateX(-100%);
        `;
        bar.appendChild(shimmer);
    });
    
    // Additional keyframe for shimmer effect
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            @keyframes shimmer {
                100% { transform: translateX(100%); }
            }
        </style>
    `);
    
    // Connect button glow effect
    const connectBtn = document.querySelector('.connect-btn');
    
    if (connectBtn) {
        setInterval(() => {
            connectBtn.classList.add('glow-pulse');
            
            setTimeout(() => {
                connectBtn.classList.remove('glow-pulse');
            }, 1000);
        }, 5000);
        
        document.head.insertAdjacentHTML('beforeend', `
            <style>
                .glow-pulse {
                    animation: glowPulse 1s ease-in-out;
                }
            </style>
        `);
    }
    
    // Section transition effects
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetSection = document.querySelector(link.getAttribute('href'));
            
            // Fade out all sections
            sections.forEach(section => {
                if (section.classList.contains('active')) {
                    section.style.opacity = '0';
                    section.style.transform = 'translateY(20px)';
                    
                    // After fade out, switch sections
                    setTimeout(() => {
                        section.classList.remove('active');
                        targetSection.classList.add('active');
                        
                        // Reset glassPanels visibility
                        const targetPanels = targetSection.querySelectorAll('.glass-panel');
                        targetPanels.forEach(panel => {
                            panel.style.opacity = '0';
                            panel.style.transform = 'translateY(20px)';
                            
                            // Staggered reveal
                            setTimeout(() => {
                                panel.classList.add('visible');
                            }, 100 + Array.from(targetPanels).indexOf(panel) * 100);
                        });
                        
                        // Fade in the new section
                        setTimeout(() => {
                            targetSection.style.opacity = '1';
                            targetSection.style.transform = 'translateY(0)';
                        }, 50);
                    }, 300);
                }
            });
        });
    });
    
    // Initialize sections with transition styles
    sections.forEach(section => {
        section.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        section.style.opacity = section.classList.contains('active') ? '1' : '0';
        section.style.transform = section.classList.contains('active') ? 'translateY(0)' : 'translateY(20px)';
    });
});