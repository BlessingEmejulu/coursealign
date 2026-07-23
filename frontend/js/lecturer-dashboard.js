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

        const token = localStorage.getItem('token');
        let lecturerName = "Lecturer";
        if (token) {
            const payload = parseJwt(token);
            if (payload) lecturerName = payload.sub;
        }

        function logout() {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        }

        function openSelectModal() { 
            document.getElementById('selectModal').classList.remove('hidden');
            fetchGlobalCourses();
        }
        function closeSelectModal() { document.getElementById('selectModal').classList.add('hidden'); }

        let globalCourses = [];

        async function fetchGlobalCourses() {
            try {
                const res = await fetch(CONFIG.API_BASE_URL + '/api/courses/');
                if (res.ok) {
                    globalCourses = await res.json();
                    // Filter courses that don't have a lecturer assigned yet
                    const availableCourses = globalCourses.filter(c => !c.lecturer_name || c.lecturer_name === 'TBA');
                    
                    const select = document.getElementById('ccode');
                    select.innerHTML = '<option value="">Select a course...</option>';
                    availableCourses.forEach(c => {
                        const option = document.createElement('option');
                        option.value = c.code;
                        option.textContent = `${c.code} - ${c.title}`;
                        select.appendChild(option);
                    });
                }
            } catch (err) {
                console.error(err);
            }
        }

        function handleCourseSelection() {
            const selectedCode = document.getElementById('ccode').value;
            const titleInput = document.getElementById('ctitle');
            const descInput = document.getElementById('cdescription');
            const unitInput = document.getElementById('cunit');
            const levelInput = document.getElementById('clevel');
            const semInput = document.getElementById('csem');
            
            if (!selectedCode) {
                titleInput.value = '';
                descInput.value = '';
                unitInput.value = '';
                levelInput.value = '';
                semInput.value = '';
                return;
            }
            const course = globalCourses.find(c => c.code === selectedCode);
            if (course) {
                titleInput.value = course.title;
                descInput.value = course.description || '';
                unitInput.value = course.credit_unit;
                levelInput.value = course.level;
                semInput.value = course.semester;
            }
        }

        document.getElementById('selectCourseForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!token) { alert("You must be logged in."); return; }

            const courseCode = document.getElementById('ccode').value;
            if (!courseCode) { alert("Please select a course."); return; }

            const payload = {
                description: document.getElementById('cdescription').value,
                credit_unit: parseInt(document.getElementById('cunit').value),
                level: document.getElementById('clevel').value,
                semester: document.getElementById('csem').value
            };

            try {
                const res = await fetch(CONFIG.API_BASE_URL + `/api/courses/${courseCode}/assign`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    alert("Course selected successfully!");
                    closeSelectModal();
                    fetchMyCourses();
                } else {
                    const err = await res.json();
                    alert(err.detail || "Failed to select course.");
                }
            } catch(err) {
                console.error(err);
                alert("Error communicating with server.");
            }
        });

        async function fetchMyCourses() {
            const grid = document.getElementById('courseGrid');
            try {
                const res = await fetch(CONFIG.API_BASE_URL + '/api/courses/');
                if (res.ok) {
                    const courses = await res.json();
                    // Filter courses assigned to this lecturer
                    const myCourses = courses.filter(c => c.lecturer_name === lecturerName);
                    
                    grid.innerHTML = '';
                    if (myCourses.length === 0) {
                        grid.innerHTML = '<p class="text-gray-500 col-span-3">You have not selected any courses to teach yet.</p>';
                        return;
                    }

                    myCourses.forEach(c => {
                        const card = document.createElement('div');
                        card.className = 'doodle-border p-6 bg-surface flex flex-col';
                        card.innerHTML = `
                            <span class="font-bold px-3 py-1 bg-yellow-200 text-text rounded-full border-2 border-text text-sm self-start mb-2">${c.code}</span>
                            <h4 class="text-xl font-bold mb-2">${c.title}</h4>
                            <p class="text-sm text-gray-600 mb-4">${c.credit_unit} Units | Level ${c.level}</p>
                            <div class="mt-auto pt-4 border-t-2 border-dashed border-gray-200">
                                <a href="lecturer-manage-course.html?code=${encodeURIComponent(c.code)}" class="doodle-button block text-center bg-secondary text-white">Manage Content</a>
                            </div>
                        `;
                        grid.appendChild(card);
                    });
                }
            } catch (err) {
                console.error(err);
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            if (!token) window.location.href = 'login.html';
            if (lecturerName !== "Lecturer") {
                document.getElementById('welcome-msg').innerText = `Lecturer Portal - Welcome ${lecturerName}`;
            }
            fetchMyCourses();
        });