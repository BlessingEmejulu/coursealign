document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const courseGrid = document.getElementById('courseGrid');
    const searchInput = document.getElementById('searchInput');
    const levelFilter = document.getElementById('levelFilter');
    const semesterFilter = document.getElementById('semesterFilter');
    const noCoursesMsg = document.getElementById('noCoursesMsg');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    
    let allCourses = [];

    // Fetch courses from API
    async function fetchCourses() {
        try {
            courseGrid.innerHTML = '<div class="col-span-full text-center py-10 font-bold text-gray-500">Loading courses...</div>';
            
            const response = await fetch(`${CONFIG.API_BASE_URL}/api/courses/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = 'login.html';
                    return;
                }
                throw new Error('Failed to fetch courses');
            }
            
            allCourses = await response.json();
            renderCourses(allCourses);
        } catch (error) {
            console.error('Error fetching courses:', error);
            courseGrid.innerHTML = `<div class="col-span-full text-center py-10 text-red-500 font-bold">Error loading courses. Please try again later.</div>`;
        }
    }

    // Render course cards
    function renderCourses(courses) {
        courseGrid.innerHTML = '';
        
        if (courses.length === 0) {
            courseGrid.classList.add('hidden');
            noCoursesMsg.classList.remove('hidden');
            return;
        }

        courseGrid.classList.remove('hidden');
        noCoursesMsg.classList.add('hidden');

        courses.forEach(course => {
            const card = document.createElement('div');
            card.className = 'doodle-border p-6 bg-surface flex flex-col h-full hover:shadow-lg transition-shadow relative overflow-hidden';
            
            // Just a fun decorative corner element
            const decorator = document.createElement('div');
            decorator.className = 'absolute -right-6 -top-6 w-16 h-16 bg-primary opacity-20 rounded-full border-2 border-dashed border-primary';
            card.appendChild(decorator);

            let desc = course.description || 'No description available.';
            if (desc.length > 100) desc = desc.substring(0, 100) + '...';

            card.innerHTML += `
                <div class="flex-grow relative z-10">
                    <div class="flex justify-between items-start mb-2">
                        <span class="text-sm font-bold px-3 py-1 bg-blue-100 rounded-full border border-blue-300 text-blue-800">${course.code}</span>
                        <span class="text-xs font-bold px-2 py-1 bg-yellow-100 rounded border border-yellow-300 text-yellow-800">${course.level}</span>
                    </div>
                    <h3 class="text-xl font-bold text-secondary mb-2">${course.title}</h3>
                    <p class="text-xs text-gray-500 font-bold mb-3 uppercase tracking-wider">${course.semester}</p>
                    <p class="text-sm text-gray-600 mb-6">${desc}</p>
                </div>
                <div class="mt-auto relative z-10 pt-4 border-t border-gray-100">
                    <a href="quiz.html?code=${encodeURIComponent(course.code)}" class="doodle-button bg-success text-white w-full text-center block py-2">Practice Quiz</a>
                </div>
            `;
            courseGrid.appendChild(card);
        });
    }

    // Filter logic
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const level = levelFilter.value;
        const semester = semesterFilter.value;

        const filtered = allCourses.filter(course => {
            const matchesSearch = course.code.toLowerCase().includes(searchTerm) || 
                                  course.title.toLowerCase().includes(searchTerm);
            const matchesLevel = level === '' || String(course.level) === level;
            
            // The database might have '1st Semester', 'First Semester', '1st', etc. 
            // So we normalize for comparison if needed, or just match exactly depending on how data is stored.
            // Let's do a loose inclusion check to be safe.
            const matchesSemester = semester === '' || (course.semester && course.semester.toLowerCase().includes(semester.split(' ')[0].toLowerCase()));

            return matchesSearch && matchesLevel && matchesSemester;
        });

        renderCourses(filtered);
    }

    // Event Listeners
    searchInput.addEventListener('input', applyFilters);
    levelFilter.addEventListener('change', applyFilters);
    semesterFilter.addEventListener('change', applyFilters);

    clearFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        levelFilter.value = '';
        semesterFilter.value = '';
        applyFilters();
    });

    // Initialize
    fetchCourses();
});
