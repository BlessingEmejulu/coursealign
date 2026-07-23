document.addEventListener('DOMContentLoaded', async () => {
            const courseGrid = document.getElementById('courseGrid');
            const searchInput = document.getElementById('searchInput');
            const levelFilter = document.getElementById('levelFilter');
            const semesterFilter = document.getElementById('semesterFilter');
            let allCourses = [];

            // Function to render courses
            const renderCourses = (coursesToRender) => {
                courseGrid.innerHTML = '';
                if (coursesToRender.length === 0) {
                    courseGrid.innerHTML = '<p class="col-span-full text-center text-gray-500 py-8">No courses found matching your criteria.</p>';
                    return;
                }
                
                coursesToRender.forEach(course => {
                    const card = document.createElement('div');
                    card.className = 'doodle-border p-6 bg-surface flex flex-col hover:-translate-y-1 transition-transform';
                    
                    // Simple logic to pick a background color based on level
                    let bgClass = 'bg-primary';
                    if (course.level === '100') bgClass = 'bg-green-300';
                    if (course.level === '200') bgClass = 'bg-yellow-300';
                    if (course.level === '300') bgClass = 'bg-primary';
                    if (course.level === '400') bgClass = 'bg-purple-300';

                    card.innerHTML = `
                        <div class="flex justify-between items-start mb-4">
                            <span class="font-bold px-3 py-1 ${bgClass} text-text rounded-full border-2 border-text text-sm">${course.code}</span>
                            <button class="text-gray-400 hover:text-red-500 bookmark-btn" data-course-id="${course.id}" title="Bookmark">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                            </button>
                        </div>
                        <h3 class="text-xl font-bold mb-2">${course.title}</h3>
                        <p class="text-xs font-bold text-secondary mb-2">Lecturer: ${course.lecturer_name || 'TBA'}</p>
                        <p class="text-gray-600 mb-4 flex-grow line-clamp-3">${course.description || ''}</p>
                        <div class="flex justify-between items-center text-sm border-t-2 border-dashed border-gray-300 pt-4 mt-auto gap-2">
                            <span>Units: <span class="font-bold">${course.credit_unit}</span></span>
                            <span>Level: <span class="font-bold">${course.level}</span></span>
                            <span>Sem: <span class="font-bold">${course.semester}</span></span>
                        </div>
                        <a href="course-detail.html?code=${course.code}" class="doodle-button w-full mt-4 text-white text-center inline-block">View Details</a>
                    `;
                    courseGrid.appendChild(card);
                });
            };

            // Fetch courses from API
            try {
                // Assuming the backend is on localhost:8000 or the same host if deployed
                // You may need to use the token if the route is protected, but in course_router.py get_courses is not protected by get_current_user unless defined somewhere else
                const token = localStorage.getItem('token');
                const headers = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                const response = await fetch(CONFIG.API_BASE_URL + '/api/courses/', { headers });
                if (response.ok) {
                    allCourses = await response.json();
                    renderCourses(allCourses);
                } else {
                    console.error('Failed to fetch courses', response.status);
                    courseGrid.innerHTML = '<p class="col-span-full text-center text-red-500 py-8">Failed to load courses. Please try again later.</p>';
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
                courseGrid.innerHTML = '<p class="col-span-full text-center text-red-500 py-8">Error loading courses. Is the backend running?</p>';
            }

            // Filter functionality
            const filterCourses = () => {
                const term = searchInput.value.toLowerCase();
                const level = levelFilter.value;
                const semester = semesterFilter.value;
                
                const filtered = allCourses.filter(c => 
                    (c.title.toLowerCase().includes(term) || c.code.toLowerCase().includes(term)) &&
                    (level === '' || String(c.level) === String(level)) &&
                    (semester === '' || c.semester === semester)
                );
                renderCourses(filtered);
            };

            searchInput.addEventListener('input', filterCourses);
            levelFilter.addEventListener('change', filterCourses);
            semesterFilter.addEventListener('change', filterCourses);
            
            // Bookmark functionality via event delegation
            courseGrid.addEventListener('click', async (e) => {
                const btn = e.target.closest('.bookmark-btn');
                if (btn) {
                    const courseId = btn.getAttribute('data-course-id');
                    try {
                        const token = localStorage.getItem('token');
                        if (!token) {
                            alert('Please login to bookmark courses.');
                            return;
                        }
                        const headers = { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        };
                        const response = await fetch(CONFIG.API_BASE_URL + '/api/bookmarks/', {
                            method: 'POST',
                            headers,
                            body: JSON.stringify({ course_id: parseInt(courseId) })
                        });
                        if (response.ok) {
                            alert('Course bookmarked successfully!');
                            btn.querySelector('svg').classList.add('fill-current', 'text-warning');
                            btn.classList.add('text-warning');
                            btn.classList.remove('text-gray-400');
                        } else {
                            const errorData = await response.json();
                            alert(errorData.detail || 'Failed to bookmark course.');
                        }
                    } catch (err) {
                        console.error('Error bookmarking:', err);
                        alert('An error occurred.');
                    }
                }
            });
        });