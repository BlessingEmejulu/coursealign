// Modern course outline page functionality

// Global variables for course data
let allCourses = [];
let currentFilter = '400';

// Load courses data from JSON file
async function loadCoursesData() {
    try {
        console.log('🔍 Loading courses data from JSON...');
        console.log('📁 Fetching from: ../scripts/courses.json');
        const response = await fetch('../scripts/courses.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        allCourses = data; // Direct array from JSON
        console.log(`✅ Successfully loaded ${allCourses.length} courses from JSON file`);
        
        // Log sample course for verification
        if (allCourses.length > 0) {
            console.log('📋 Sample course:', allCourses[0]);
        }
        
        return allCourses;
    } catch (error) {
        console.error('Error loading courses data:', error);
        showErrorMessage('Failed to load course data. Please refresh the page.');
        return [];
    }
}

// Create course card HTML using JSON data structure
function createCourseCard(course) {
    const courseDescription = course.course_outline ? course.course_outline.substring(0, 120) + '...' : 'Course description not available.';
    const semesterText = course.semester ? `${course.semester} Semester` : 'TBD';
    
    return `
        <div class="modern-course-card" data-level="${course.level}">
            <div class="card-header">
                <div class="course-meta">
                    <span class="course-code-modern">${course.code}</span>
                    <span class="course-units-modern">${course.unit} Unit${course.unit !== 1 ? 's' : ''}</span>
                </div>
                <button class="heart-bookmark" onclick="toggleBookmark('${course.code.replace(/\s+/g, '')}')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
            <div class="card-content">
                <h3 class="modern-course-title">${course.title}</h3>
                <p class="course-description">${courseDescription}</p>
                <div class="modern-course-tags">
                    <span class="modern-tag primary">${course.level} Level</span>
                    <span class="modern-tag">${semesterText}</span>
                    <span class="modern-tag">CIS Dept</span>
                </div>
            </div>
            <div class="card-footer">
                <button class="modern-outline-btn" onclick="getCourseOutline('${course.code.replace(/\s+/g, '')}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <line x1="12" y1="9" x2="8" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Get Outline
                </button>
            </div>
        </div>
    `;
}

// Render courses to the grid
function renderCourses(courses) {
    const grid = document.querySelector('.modern-courses-grid');
    const loadingDiv = document.querySelector('.loading-indicator');
    
    if (!grid) {
        console.error('Courses grid container not found');
        return;
    }
    
    // Hide loading indicator
    if (loadingDiv) {
        loadingDiv.style.display = 'none';
    }
    
    // Clear existing cards (but keep loading indicator for potential future use)
    const existingCards = grid.querySelectorAll('.modern-course-card');
    existingCards.forEach(card => card.remove());
    
    console.log(`Rendering ${courses.length} courses`);
    
    if (courses.length === 0) {
        showNoCourses(currentFilter);
        return;
    }
    
    // Remove any no-courses message
    hideNoCourses();
    
    // Create and add course cards
    courses.forEach((course, index) => {
        const cardHTML = createCourseCard(course);
        const cardElement = document.createElement('div');
        cardElement.innerHTML = cardHTML;
        const card = cardElement.firstElementChild;
        
        // Add entrance animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        grid.appendChild(card);
        
        // Animate in with stagger
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100 + 200);
    });
}

// Filter courses by level
function filterByLevel(level) {
    currentFilter = level;
    console.log(`Filtering courses by level: ${level}`);
    
    // Update active tab
    const tabs = document.querySelectorAll('.modern-filter-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.level === level) {
            tab.classList.add('active');
        }
    });
    
    // Filter and render courses
    const filteredCourses = allCourses.filter(course => course.level.toString() === level);
    console.log(`Found ${filteredCourses.length} courses for level ${level}`);
    renderCourses(filteredCourses);
}

// Show error message
function showErrorMessage(message) {
    const grid = document.querySelector('.modern-courses-grid');
    const loadingDiv = document.querySelector('.loading-indicator');
    
    if (loadingDiv) {
        loadingDiv.style.display = 'none';
    }
    
    if (grid) {
        grid.innerHTML = `
            <div class="error-message" style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 60px 20px;
                color: #ef4444;
                background: #ffffff;
                border-radius: 20px;
                border: 1px solid #fecaca;
            ">
                <div style="margin-bottom: 16px;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color: #ef4444;">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
                        <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </div>
                <h3 style="margin: 0 0 12px 0; font-size: 1.5rem; font-weight: 600;">Error Loading Courses</h3>
                <p style="margin: 0; font-size: 1rem; line-height: 1.6;">${message}</p>
            </div>
        `;
    }
}

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

// Legacy function for backward compatibility
function filterCourses(level) {
    filterByLevel(level);
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
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Page loaded, initializing...');
    
    // Set up back button event listener
    const backButton = document.querySelector('.modern-back-btn');
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            goBack();
        });
        console.log('Back button event listener added');
    }
    
    // Check if we're on the courses.html page (with dynamic loading)
    const loadingIndicator = document.querySelector('.loading-indicator');
    if (loadingIndicator) {
        console.log('Detected courses.html page - loading dynamic content');
        
        // Load courses data from JSON
        await loadCoursesData();
        
        // Set default filter to 400 level and render
        currentFilter = '400';
        filterByLevel('400');
    } else {
        console.log('Detected course-outline.html page - using static content');
        
        // Legacy behavior for course-outline.html with hardcoded cards
        filterCourses('400');
        
        // Add entrance animations to existing cards
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
    }
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
