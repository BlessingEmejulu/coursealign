// Modern course outline page functionality

// Navigate back to previous page with fallback
function goBack() {
    try {
        console.log('Go back button clicked');
        console.log('History length:', window.history.length);
        console.log('Referrer:', document.referrer);
        
        // Check if we came from another page on the same domain
        if (document.referrer && document.referrer.includes(window.location.hostname)) {
            console.log('Going back to referrer');
            window.history.back();
        } else if (window.history.length > 1) {
            console.log('Going back in history');
            window.history.back();
        } else {
            // Fallback: navigate to home page if no history
            console.log('No history, redirecting to home');
            window.location.href = 'home.html';
        }
    } catch (error) {
        console.error('Error in goBack function:', error);
        // Emergency fallback
        try {
            window.location.href = 'home.html';
        } catch (fallbackError) {
            console.error('Fallback failed:', fallbackError);
            // Last resort: try to navigate to index
            window.location.href = '../index.html';
        }
    }
}

// Alternative navigation function
function navigateToHome() {
    try {
        window.location.href = 'home.html';
    } catch (error) {
        console.error('Navigation error:', error);
        window.location.href = '../index.html';
    }
}

// Filter courses by level with modern animations
function filterCourses(level) {
    // Update active tab
    const tabs = document.querySelectorAll('.modern-filter-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // Hide all course cards with fade animation
    const cards = document.querySelectorAll('.modern-course-card');
    cards.forEach((card, index) => {
        card.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            if (card.dataset.level === level) {
                card.style.display = 'flex';
                card.style.animation = `cardSlideIn 0.6s ease forwards`;
                card.style.animationDelay = `${index * 0.1}s`;
            } else {
                card.style.display = 'none';
            }
        }, 300);
    });
    
    // Check if we need to show no courses message
    setTimeout(() => {
        const visibleCards = document.querySelectorAll(`[data-level="${level}"]`);
        if (visibleCards.length === 0) {
            showNoCourses(level);
        } else {
            hideNoCourses();
        }
    }, 400);
}

// Show modern no courses message
function showNoCourses(level) {
    hideNoCourses(); // Remove existing message
    
    const container = document.querySelector('.modern-courses-grid');
    const noCoursesDiv = document.createElement('div');
    noCoursesDiv.className = 'no-courses-modern';
    noCoursesDiv.innerHTML = `
        <div style="
            grid-column: 1 / -1;
            text-align: center; 
            padding: 60px 20px; 
            color: #64748b;
            background: #ffffff;
            border-radius: 20px;
            border: 1px solid #e2e8f0;
            animation: fadeInUp 0.6s ease;
        ">
            <div style="
                width: 80px;
                height: 80px;
                margin: 0 auto 24px;
                background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color: #94a3b8;">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </div>
            <h3 style="margin: 0 0 12px 0; font-size: 1.5rem; font-weight: 600; color: #374151;">No courses available</h3>
            <p style="margin: 0; font-size: 1rem; line-height: 1.6; max-width: 400px; margin: 0 auto;">No ${level} level courses found at the moment. Please check back later or try a different level.</p>
        </div>
    `;
    container.appendChild(noCoursesDiv);
}

// Hide no courses message
function hideNoCourses() {
    const message = document.querySelector('.no-courses-modern');
    if (message) {
        message.remove();
    }
}

// Get course outline with modern loading
function getCourseOutline(courseCode) {
    const button = event.target;
    const originalHTML = button.innerHTML;
    
    // Show loading state with spinner
    button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="animation: spin 1s linear infinite;">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-opacity="0.3"/>
            <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"/>
        </svg>
        Loading...
    `;
    button.disabled = true;
    button.style.opacity = '0.7';
    
    // Add spinner styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        button.innerHTML = originalHTML;
        button.disabled = false;
        button.style.opacity = '1';
        
        // Show modern success message
        showModernNotification(`Course outline for ${courseCode} is being generated...`, 'success');
        
        // In a real app, you might navigate to the actual outline page:
        // window.location.href = `course-detail.html?code=${courseCode}`;
    }, 2000);
}

// Toggle bookmark with heart animation
function toggleBookmark(courseCode) {
    const button = event.target.closest('.heart-bookmark');
    const isBookmarked = button.classList.contains('bookmarked');
    
    // Add heart animation
    button.style.transform = 'scale(1.3)';
    
    setTimeout(() => {
        if (isBookmarked) {
            button.classList.remove('bookmarked');
            showModernNotification(`${courseCode} removed from bookmarks`, 'info');
        } else {
            button.classList.add('bookmarked');
            showModernNotification(`${courseCode} added to bookmarks`, 'success');
        }
        
        button.style.transform = 'scale(1)';
    }, 150);
}

// Show modern notification
function showModernNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.modern-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const colors = {
        success: { bg: '#10b981', border: '#059669' },
        info: { bg: '#0097DC', border: '#0284c7' },
        error: { bg: '#ef4444', border: '#dc2626' }
    };
    
    const color = colors[type] || colors.info;
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'modern-notification';
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 24px;
            right: 24px;
            background: ${color.bg};
            color: white;
            padding: 16px 24px;
            border-radius: 16px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            z-index: 1000;
            animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            font-weight: 500;
            max-width: 350px;
            font-family: 'Inter', sans-serif;
            border: 1px solid ${color.border};
            backdrop-filter: blur(8px);
        ">
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="
                    width: 24px;
                    height: 24px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                ">
                    ${type === 'success' ? '✓' : type === 'info' ? 'ℹ' : '⚠'}
                </div>
                <span style="line-height: 1.4;">${message}</span>
            </div>
        </div>
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { 
                transform: translateX(100%); 
                opacity: 0; 
            }
            to { 
                transform: translateX(0); 
                opacity: 1; 
            }
        }
        @keyframes slideOutRight {
            from { 
                transform: translateX(0); 
                opacity: 1; 
            }
            to { 
                transform: translateX(100%); 
                opacity: 0; 
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification) {
            notification.style.animation = 'slideOutRight 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards';
            setTimeout(() => notification.remove(), 400);
        }
    }, 4000);
}

// Initialize page with modern animations
document.addEventListener('DOMContentLoaded', function() {
    // Set up back button event listener
    const backButton = document.querySelector('.modern-back-btn');
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            goBack();
        });
        console.log('Back button event listener added');
    }
    
    // Set default to 400 level
    filterCourses('400');
    
    // Add entrance animations to cards
    const cards = document.querySelectorAll('.modern-course-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100 + 200);
    });
});

// Add CSS fade out animation
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes fadeOut {
        from { 
            opacity: 1; 
            transform: translateY(0); 
        }
        to { 
            opacity: 0; 
            transform: translateY(-20px); 
        }
    }
`;
document.head.appendChild(fadeOutStyle);
