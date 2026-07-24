document.addEventListener('DOMContentLoaded', async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const courseCode = urlParams.get('code');

            if (!courseCode) {
                document.getElementById('course-title').innerText = "Course Not Found";
                document.getElementById('course-description').innerText = "No course code provided in the URL.";
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const headers = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                const response = await fetch(CONFIG.API_BASE_URL + `/api/courses/${courseCode}`, { headers });
                
                if (response.ok) {
                    const course = await response.json();
                    
                    document.getElementById('course-code').innerText = course.code;
                    document.getElementById('course-level-units').innerText = `${course.credit_unit} Units | ${course.level} Level`;
                    document.getElementById('course-title').innerText = course.title;
                    document.getElementById('course-description').innerText = course.description || 'No description available.';
                    document.getElementById('course-lecturer').innerText = course.lecturer_name || 'TBA';
                    document.getElementById('course-semester').innerText = course.semester || 'TBA';

                    // Update action links with the course code
                    document.getElementById('ai-tutor-btn').href = `ai-tutor.html?code=${course.code}`;
                    document.getElementById('practice-quiz-btn').href = `quiz.html?code=${course.code}`;

                    // Fetch Outline
                    try {
                        const outlineRes = await fetch(CONFIG.API_BASE_URL + `/api/courses/${course.id}/outline`);
                        if (outlineRes.ok) {
                            const outline = await outlineRes.json();
                            
                            if (outline.learning_objectives) {
                                document.getElementById('learning-objectives-list').innerHTML = `<li>${outline.learning_objectives.replace(/\n/g, '<br>')}</li>`;
                            } else {
                                document.getElementById('learning-objectives-list').innerHTML = `<li>No learning objectives available.</li>`;
                            }
                            
                            if (outline.weekly_outline) {
                                document.getElementById('course-outline-list').innerHTML = `<li>${outline.weekly_outline.replace(/\n/g, '<br>')}</li>`;
                            } else {
                                document.getElementById('course-outline-list').innerHTML = `<li>No course outline available.</li>`;
                            }

                            // If we had a textbooks section, we'd populate it here
                        } else {
                            document.getElementById('learning-objectives-list').innerHTML = `<li>No learning objectives available.</li>`;
                            document.getElementById('course-outline-list').innerHTML = `<li>No course outline available.</li>`;
                        }
                    } catch (err) {
                        document.getElementById('learning-objectives-list').innerHTML = `<li>Failed to load learning objectives.</li>`;
                        document.getElementById('course-outline-list').innerHTML = `<li>Failed to load course outline.</li>`;
                    }

                    // Fetch Resources
                    try {
                        const resRes = await fetch(CONFIG.API_BASE_URL + `/api/courses/${course.id}/resources`);
                        if (resRes.ok) {
                            const resources = await resRes.json();
                            const resList = document.getElementById('course-resources-list');
                            if (resources.length > 0) {
                                resList.innerHTML = resources.map(r => `
                                    <li>
                                        <a href="${r.file_path}" target="_blank" class="flex items-center gap-2 text-primary hover:underline">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                                            ${r.title}
                                        </a>
                                    </li>
                                `).join('');
                            } else {
                                resList.innerHTML = `<li>No resources available.</li>`;
                            }
                        } else {
                            document.getElementById('course-resources-list').innerHTML = `<li>No resources available.</li>`;
                        }
                    } catch (err) {
                        document.getElementById('course-resources-list').innerHTML = `<li>Failed to load resources.</li>`;
                    }
                    
                    // Share logic
                    const shareBtn = document.getElementById('share-btn');
                    if (shareBtn) {
                        shareBtn.addEventListener('click', async () => {
                            try {
                                await navigator.clipboard.writeText(window.location.href);
                                if (window.showToast) {
                                    window.showToast('Course link copied to clipboard!', 'success');
                                } else {
                                    alert('Course link copied to clipboard!');
                                }
                            } catch (err) {
                                console.error('Failed to copy text: ', err);
                                const input = document.createElement('input');
                                input.value = window.location.href;
                                document.body.appendChild(input);
                                input.select();
                                document.execCommand('copy');
                                document.body.removeChild(input);
                                if (window.showToast) {
                                    window.showToast('Course link copied to clipboard!', 'success');
                                } else {
                                    alert('Course link copied to clipboard!');
                                }
                            }
                        });
                    }
                    
                    // Bookmark logic
                    const bookmarkBtn = document.getElementById('bookmark-btn');
                    bookmarkBtn.setAttribute('data-course-id', course.id);
                    bookmarkBtn.addEventListener('click', async () => {
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
                            const res = await fetch(CONFIG.API_BASE_URL + '/api/bookmarks/', {
                                method: 'POST',
                                headers,
                                body: JSON.stringify({ course_id: course.id })
                            });
                            if (res.ok) {
                                alert('Course bookmarked successfully!');
                                bookmarkBtn.querySelector('svg').classList.add('fill-current');
                            } else {
                                const errData = await res.json();
                                alert(errData.detail || 'Failed to bookmark course.');
                            }
                        } catch (err) {
                            console.error('Error bookmarking:', err);
                            alert('An error occurred while bookmarking.');
                        }
                    });
                } else {
                    document.getElementById('course-title').innerText = "Course Not Found";
                    document.getElementById('course-description').innerText = "Could not find the requested course.";
                    console.error('Failed to fetch course details', response.status);
                }
            } catch (error) {
                console.error('Error fetching course:', error);
                document.getElementById('course-title').innerText = "Error Loading Course";
                document.getElementById('course-description').innerText = "Failed to communicate with the server.";
            }
        });