/**
 * Course Detail Page - Modern & Sleek Implementation
 * Loads and displays detailed course information
 */

// Global variables
let currentCourse = null;
let allCourses = [];

// Initialize page when DOM loads
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Load courses data
        await loadCoursesData();
        
        // Get course code from URL parameters
        const courseCode = getCourseCodeFromURL();
        
        if (courseCode) {
            loadCourseDetails(courseCode);
        } else {
            showError('No course specified');
        }
    } catch (error) {
        console.error('❌ Error initializing page:', error);
        showError('Failed to load course details');
    }
});

// Load courses data from JSON
async function loadCoursesData() {
    try {
        const response = await fetch('../scripts/courses.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allCourses = await response.json();
        
    } catch (error) {
        console.error('❌ Failed to load courses:', error);
        throw error;
    }
}

// Get course code from URL parameters
function getCourseCodeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseCode = urlParams.get('code');
    return courseCode;
}

// Load and display course details
function loadCourseDetails(courseCode) {
    // Find the course in our data
    const course = allCourses.find(c => 
        c.code.replace(/\s+/g, '').toLowerCase() === courseCode.replace(/\s+/g, '').toLowerCase()
    );
    
    if (!course) {
        console.error(`❌ Course not found: ${courseCode}`);
        showError('Course not found');
        return;
    }
    
    currentCourse = course;
    
    // Update page content
    updatePageContent(course);
    
    // Add smooth entrance animation
    animatePageContent();
}

// Update page content with course data
function updatePageContent(course) {
    // Update document title
    document.title = `${course.title} - CourseAlign`;
    
    // Update course header
    document.getElementById('courseTitle').textContent = course.title;
    document.getElementById('courseCode').textContent = course.code;
    document.getElementById('courseLevel').textContent = `${course.level} Level`;
    document.getElementById('courseUnits').textContent = `${course.unit} Unit${course.unit !== 1 ? 's' : ''}`;
    
    // Handle semester display
    const semesterElement = document.getElementById('courseSemester');
    if (course.semester) {
        semesterElement.textContent = `${course.semester} Semester`;
        semesterElement.style.display = 'inline-block';
    } else {
        semesterElement.style.display = 'none';
    }
    
    // Update course outline
    updateCourseOutline(course.course_outline);
}

// Update course outline with better formatting
function updateCourseOutline(outline) {
    const outlineContainer = document.getElementById('courseOutlineContent');
    
    if (!outline) {
        outlineContainer.innerHTML = `
            <div class="no-outline">
                <div class="no-outline-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
                        <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </div>
                <h3>Course Outline Not Available</h3>
                <p>The detailed course outline for this course is not currently available. Please contact your academic advisor for more information.</p>
            </div>
        `;
        return;
    }
    
    // Format the outline text
    const formattedOutline = formatOutlineText(outline);
    outlineContainer.innerHTML = formattedOutline;
}

// Format outline text for better readability
function formatOutlineText(text) {
    // Split by sentences and create paragraphs
    const sentences = text.split(/\.\s+/).filter(s => s.trim().length > 0);
    
    if (sentences.length <= 1) {
        return `<p class="outline-paragraph">${text}</p>`;
    }
    
    // Group sentences into logical paragraphs
    const paragraphs = [];
    let currentParagraph = [];
    
    sentences.forEach((sentence, index) => {
        currentParagraph.push(sentence.trim());
        
        // Create new paragraph every 2-3 sentences or at logical breaks
        if (currentParagraph.length >= 3 || 
            sentence.includes('Practical Section') || 
            sentence.includes('Laboratory') ||
            sentence.includes('Assessment') ||
            index === sentences.length - 1) {
            
            const paragraphText = currentParagraph.join('. ') + (currentParagraph[currentParagraph.length - 1].endsWith('.') ? '' : '.');
            paragraphs.push(`<p class="outline-paragraph">${paragraphText}</p>`);
            currentParagraph = [];
        }
    });
    
    return paragraphs.join('');
}

// Animate page content on load
function animatePageContent() {
    // Add smooth fade-in animation for cards
    const courseCard = document.querySelector('.course-card');
    const outlineCard = document.querySelector('.outline-card');
    
    if (courseCard) {
        courseCard.style.opacity = '0';
        courseCard.style.transform = 'translateY(20px)';
        courseCard.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            courseCard.style.opacity = '1';
            courseCard.style.transform = 'translateY(0)';
        }, 100);
    }
    
    if (outlineCard) {
        outlineCard.style.opacity = '0';
        outlineCard.style.transform = 'translateY(20px)';
        outlineCard.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            outlineCard.style.opacity = '1';
            outlineCard.style.transform = 'translateY(0)';
        }, 300);
    }
}

// Go back to previous page
function goBack() {
    if (document.referrer && document.referrer.includes(window.location.hostname)) {
        window.history.back();
    } else {
        window.location.href = 'courses.html';
    }
}

// Share course functionality
function shareCourse() {
    if (!currentCourse) {
        showNotification('No course loaded', 'error');
        return;
    }
    
    const shareData = {
        title: `${currentCourse.title} (${currentCourse.code})`,
        text: `Check out this ${currentCourse.level} level course: ${currentCourse.title}\\n\\n${currentCourse.course_outline ? currentCourse.course_outline.substring(0, 200) + '...' : 'Course outline available on CourseAlign'}`,
        url: window.location.href
    };
    
    // Try native share API first
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => showNotification('Course shared successfully!', 'success'))
            .catch(() => fallbackShare(shareData));
    } else {
        fallbackShare(shareData);
    }
}

// Fallback share function
function fallbackShare(shareData) {
    const shareText = `${shareData.title}\\n\\n${shareData.text}\\n\\n${shareData.url}`;
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(shareText)
            .then(() => showNotification('Course details copied to clipboard!', 'success'))
            .catch(() => showShareOptions(shareData));
    } else {
        showShareOptions(shareData);
    }
}

// Show share options
function showShareOptions(shareData) {
    const modal = document.createElement('div');
    modal.className = 'share-modal-overlay';
    modal.innerHTML = `
        <div class="share-modal">
            <h3>Share Course</h3>
            <div class="share-options">
                <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}" target="_blank" class="share-option twitter">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                    </svg>
                    Twitter
                </a>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}" target="_blank" class="share-option facebook">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                    </svg>
                    Facebook
                </a>
                <a href="mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.text + '\\n\\n' + shareData.url)}" class="share-option email">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    Email
                </a>
            </div>
            <button onclick="this.closest('.share-modal-overlay').remove()" class="close-share">Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto-close after 15 seconds
    setTimeout(() => {
        if (modal.parentElement) {
            modal.remove();
        }
    }, 15000);
}

// Toggle bookmark
function toggleBookmark() {
    if (!currentCourse) return;
    
    const bookmarkBtn = document.querySelector('.secondary-action-btn');
    const isBookmarked = bookmarkBtn.classList.contains('bookmarked');
    
    if (isBookmarked) {
        bookmarkBtn.classList.remove('bookmarked');
        showNotification('Removed from bookmarks', 'info');
    } else {
        bookmarkBtn.classList.add('bookmarked');
        showNotification('Added to bookmarks', 'success');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Show error state
function showError(message) {
    const content = document.querySelector('.course-content');
    content.innerHTML = `
        <div class="error-state">
            <div class="error-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
                    <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
                </svg>
            </div>
            <h2>Course Not Found</h2>
            <p>${message}</p>
            <button onclick="goBack()" class="error-back-btn">Back to Courses</button>
        </div>
    `;
}