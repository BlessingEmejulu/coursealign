function parseJwt(token) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                return JSON.parse(jsonPayload);
            } catch(e) {
                return null;
            }
        }

        document.addEventListener('DOMContentLoaded', async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = 'login.html';
                return;
            }
            
            const payload = parseJwt(token);
            if (payload && payload.sub) {
                document.getElementById('welcome-msg').innerText = `Welcome back, ${payload.sub}!`;
            }

            try {
                const response = await fetch(CONFIG.API_BASE_URL + '/api/auth/me/dashboard', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    
                    document.getElementById('stat-courses').innerText = data.stats.courses_studied;
                    document.getElementById('stat-quiz').innerText = data.stats.quiz_average + '%';
                    document.getElementById('stat-chats').innerText = data.stats.ai_chats;
                    
                    const grid = document.getElementById('recent-courses-grid');
                    grid.innerHTML = '';
                    
                    if (data.recent_courses.length === 0) {
                        grid.innerHTML = '<p class="text-gray-500">No recent courses found.</p>';
                    } else {
                        data.recent_courses.forEach(course => {
                            let bgClass = 'bg-blue-200';
                            if (course.level === '100') bgClass = 'bg-green-200';
                            if (course.level === '200') bgClass = 'bg-yellow-200';
                            if (course.level === '400') bgClass = 'bg-purple-200';
                            
                            const card = document.createElement('div');
                            card.className = 'doodle-border p-4 bg-gray-50 flex flex-col justify-between h-32 hover:-translate-y-1 transition-transform';
                            card.innerHTML = `
                                <div>
                                    <span class="text-xs font-bold px-2 py-1 ${bgClass} rounded-full mb-2 inline-block border border-black">${course.code}</span>
                                    <h4 class="font-bold truncate" title="${course.title}">${course.title}</h4>
                                </div>
                                <a href="course-detail.html?code=${course.code}" class="text-primary text-sm font-bold mt-2 hover:underline">View Outline &rarr;</a>
                            `;
                            grid.appendChild(card);
                        });
                    }
                }
            } catch (err) {
                console.error("Failed to load dashboard data", err);
                const grid = document.getElementById('recent-courses-grid');
                if (grid) grid.innerHTML = '<p class="text-red-500 text-sm">Failed to load courses.</p>';
            }
        });

        function logout() {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        }