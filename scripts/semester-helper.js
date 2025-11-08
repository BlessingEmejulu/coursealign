/**
 * Semester Assignment Helper Script
 * This script helps you identify and update courses that need semester assignments
 */

// Function to load and analyze courses
async function analyzeCourses() {
    try {
        const response = await fetch('./courses.json');
        const courses = await response.json();
        
        console.log('='.repeat(60));
        console.log('SEMESTER ASSIGNMENT ANALYSIS');
        console.log('='.repeat(60));
        
        // Group courses by level and semester status
        const coursesByLevel = {
            100: { assigned: [], unassigned: [] },
            200: { assigned: [], unassigned: [] },
            300: { assigned: [], unassigned: [] },
            400: { assigned: [], unassigned: [] }
        };
        
        courses.forEach(course => {
            if (course.semester === null || course.semester === undefined) {
                coursesByLevel[course.level].unassigned.push(course);
            } else {
                coursesByLevel[course.level].assigned.push(course);
            }
        });
        
        // Display analysis
        Object.keys(coursesByLevel).forEach(level => {
            console.log(`\n📚 LEVEL ${level} COURSES:`);
            console.log(`   ✅ Assigned: ${coursesByLevel[level].assigned.length}`);
            console.log(`   ❌ Unassigned: ${coursesByLevel[level].unassigned.length}`);
            
            if (coursesByLevel[level].assigned.length > 0) {
                console.log(`   📋 Assigned courses:`);
                coursesByLevel[level].assigned.forEach(course => {
                    console.log(`      ${course.code} - ${course.title} (${course.semester} semester)`);
                });
            }
            
            if (coursesByLevel[level].unassigned.length > 0) {
                console.log(`   🔄 Courses needing semester assignment:`);
                coursesByLevel[level].unassigned.forEach(course => {
                    console.log(`      ${course.code} - ${course.title}`);
                });
            }
        });
        
        // Generate semester assignment suggestions
        console.log('\n' + '='.repeat(60));
        console.log('SEMESTER ASSIGNMENT SUGGESTIONS');
        console.log('='.repeat(60));
        
        Object.keys(coursesByLevel).forEach(level => {
            if (coursesByLevel[level].unassigned.length > 0) {
                console.log(`\n📝 Level ${level} - Suggested semester assignments:`);
                console.log('Copy and paste these into your JSON file:\n');
                
                coursesByLevel[level].unassigned.forEach((course, index) => {
                    // Suggest alternating semesters or based on course patterns
                    const suggestedSemester = getSemesterSuggestion(course, index);
                    console.log(`    "${course.code}": "${suggestedSemester}",`);
                });
            }
        });
        
        return coursesByLevel;
        
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

// Function to suggest semester based on course characteristics
function getSemesterSuggestion(course, index) {
    const code = course.code.toLowerCase();
    const title = course.title.toLowerCase();
    
    // Logic-based suggestions
    if (title.includes('introduction') || title.includes('fundamentals') || title.includes('basic')) {
        return '1st';
    }
    
    if (title.includes('advanced') || title.includes('ii') || title.includes('2')) {
        return '2nd';
    }
    
    // Programming courses often follow a pattern
    if (title.includes('programming')) {
        return index % 2 === 0 ? '1st' : '2nd';
    }
    
    // Math and theory courses often in first semester
    if (title.includes('mathematics') || title.includes('statistics') || title.includes('theory')) {
        return '1st';
    }
    
    // Project and practical courses often in second semester
    if (title.includes('project') || title.includes('practical') || title.includes('application')) {
        return '2nd';
    }
    
    // Default alternating assignment
    return index % 2 === 0 ? '1st' : '2nd';
}

// Function to generate JSON update script
function generateUpdateScript(coursesByLevel) {
    console.log('\n' + '='.repeat(60));
    console.log('JSON UPDATE SCRIPT');
    console.log('='.repeat(60));
    console.log('\nUse find & replace in your editor with these patterns:\n');
    
    Object.keys(coursesByLevel).forEach(level => {
        coursesByLevel[level].unassigned.forEach((course, index) => {
            const suggestedSemester = getSemesterSuggestion(course, index);
            console.log(`Find:    "code": "${course.code}",`);
            console.log(`Replace with suggestions for semester assignment...`);
        });
    });
}

// Run analysis when page loads
if (typeof window !== 'undefined') {
    // Browser environment
    document.addEventListener('DOMContentLoaded', analyzeCourses);
} else {
    // Node.js environment
    analyzeCourses();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { analyzeCourses, getSemesterSuggestion };
}