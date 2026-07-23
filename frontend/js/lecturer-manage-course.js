let currentCourseId = null;

        document.addEventListener('DOMContentLoaded', async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = 'login.html';
                return;
            }

            const urlParams = new URLSearchParams(window.location.search);
            const courseCode = urlParams.get('code');

            if (!courseCode) {
                document.getElementById('course-title').innerText = "Invalid Course";
                return;
            }

            try {
                const res = await fetch(CONFIG.API_BASE_URL + `/api/courses/${encodeURIComponent(courseCode)}`);
                if (res.ok) {
                    const course = await res.json();
                    currentCourseId = course.id;
                    document.getElementById('course-title').innerText = course.title;
                    document.getElementById('course-code').innerText = course.code;

                    // Fetch existing outline
                    try {
                        const outlineRes = await fetch(CONFIG.API_BASE_URL + `/api/courses/${currentCourseId}/outline`);
                        if (outlineRes.ok) {
                            const outline = await outlineRes.json();
                            document.getElementById('description').value = outline.description || '';
                            document.getElementById('objectives').value = outline.learning_objectives || '';
                            document.getElementById('weekly').value = outline.weekly_outline || '';
                            document.getElementById('textbooks').value = outline.recommended_textbooks || '';
                        } else {
                            // Fetch course description if outline not found
                            document.getElementById('description').value = course.description || '';
                        }
                    } catch (err) {
                        console.error('No outline found or error fetching outline', err);
                    }
                } else {
                    document.getElementById('course-title').innerText = "Course Not Found";
                }
            } catch (err) {
                console.error(err);
                document.getElementById('course-title').innerText = "Error loading course";
            }
        });

        // Save Outline
        document.getElementById('outlineForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentCourseId) return;
            const token = localStorage.getItem('token');

            const payload = {
                description: document.getElementById('description').value,
                learning_objectives: document.getElementById('objectives').value,
                weekly_outline: document.getElementById('weekly').value,
                recommended_textbooks: document.getElementById('textbooks').value
            };

            try {
                const btn = e.target.querySelector('button');
                btn.innerText = "Saving...";
                const res = await fetch(CONFIG.API_BASE_URL + `/api/courses/${currentCourseId}/outline`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(payload)
                });
                
                if (res.ok) {
                    alert("Outline saved successfully!");
                } else {
                    const err = await res.json();
                    alert(err.detail || "Failed to save outline.");
                }
                btn.innerText = "Save Outline";
            } catch (err) {
                console.error(err);
                alert("An error occurred.");
            }
        });

        // Add Resource
        document.getElementById('resourceForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentCourseId) return;
            const token = localStorage.getItem('token');

            const payload = {
                title: document.getElementById('restitle').value,
                file_path: document.getElementById('resurl').value,
                type: "link"
            };

            try {
                const btn = e.target.querySelector('button');
                btn.innerText = "Adding...";
                const res = await fetch(CONFIG.API_BASE_URL + `/api/courses/${currentCourseId}/resources`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(payload)
                });
                
                if (res.ok) {
                    alert("Resource added successfully!");
                    e.target.reset();
                } else {
                    const err = await res.json();
                    alert(err.detail || "Failed to add resource.");
                }
                btn.innerText = "Add Resource";
            } catch (err) {
                console.error(err);
                alert("An error occurred.");
            }
        });