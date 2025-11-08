// Course Detail Page
let currentCourse = null;
let allCourses = [];

// Initialize page
document.addEventListener('DOMContentLoaded', async function() {
    try {
        await loadCoursesData();
        const courseCode = new URLSearchParams(window.location.search).get('code');
        
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

// Load courses data
async function loadCoursesData() {
    const response = await fetch('../scripts/courses.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    allCourses = await response.json();
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
    // Simple paragraph formatting
    return `<div class="course-outline">${text}</div>`;
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
        alert('No course loaded');
        return;
    }
    
    const shareText = `${currentCourse.title} (${currentCourse.code}) - ${window.location.href}`;
    
    // Try native share API first
    if (navigator.share) {
        navigator.share({
            title: `${currentCourse.title} (${currentCourse.code})`,
            url: window.location.href
        }).catch(() => {
            // Fallback to clipboard
            copyToClipboard(shareText);
        });
    } else {
        copyToClipboard(shareText);
    }
}

// Copy to clipboard helper
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
            .then(() => alert('Course link copied to clipboard!'))
            .catch(() => alert('Unable to copy. Please copy the URL manually.'));
    } else {
        alert('Course URL: ' + window.location.href);
    }
}



// Show error state
function showError(message) {
    document.body.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100vh; text-align: center;">
            <div>
                <h2>Error</h2>
                <p>${message}</p>
                <button onclick="goBack()">Go Back</button>
            </div>
        </div>
    `;
}