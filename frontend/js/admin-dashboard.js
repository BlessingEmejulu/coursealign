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

        document.addEventListener('DOMContentLoaded', () => {
            if (!token) window.location.href = 'login.html';
            const payload = parseJwt(token);
            if (payload && payload.role !== 'admin') {
                alert('Unauthorized access.');
                window.location.href = 'login.html';
            }
            if (payload && payload.sub) {
                document.getElementById('welcome-msg').innerText = `Admin Portal - Welcome ${payload.sub}`;
            }
            
            fetchUsers();
            fetchCourses();
        });

        function logout() {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        }

        async function fetchUsers() {
            try {
                const res = await fetch(CONFIG.API_BASE_URL + '/api/admin/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const users = await res.json();
                    document.getElementById('totalUsersCount').innerText = users.length;
                    
                    const tbody = document.getElementById('usersTableBody');
                    tbody.innerHTML = '';
                    if (users.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="5" class="p-4 text-center">No users found.</td></tr>';
                        return;
                    }

                    users.forEach(u => {
                        const tr = document.createElement('tr');
                        tr.className = "border-b border-gray-200 hover:bg-gray-50";
                        tr.innerHTML = `
                            <td class="p-4">${u.id}</td>
                            <td class="p-4 font-bold">${u.username}</td>
                            <td class="p-4 text-gray-600">${u.email}</td>
                            <td class="p-4">
                                <select class="doodle-input py-1 px-2 text-sm role-select" data-user-id="${u.id}">
                                    <option value="student" ${u.role === 'student' ? 'selected' : ''}>Student</option>
                                    <option value="lecturer" ${u.role === 'lecturer' ? 'selected' : ''}>Lecturer</option>
                                    <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
                                </select>
                            </td>
                            <td class="p-4 text-right space-x-2">
                                <button onclick="updateRole(${u.id})" class="text-sm bg-primary text-white px-3 py-1 doodle-border font-bold hover:bg-opacity-90">Save Role</button>
                                <button onclick="deleteUser(${u.id}, '${u.username}')" class="text-sm bg-danger text-white px-3 py-1 doodle-border font-bold hover:bg-opacity-90">Delete</button>
                            </td>
                        `;
                        tbody.appendChild(tr);
                    });
                }
            } catch (error) {
                console.error("Error fetching users", error);
            }
        }

        let adminCourses = [];

        async function fetchCourses() {
            try {
                const res = await fetch(CONFIG.API_BASE_URL + '/api/admin/courses', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    adminCourses = await res.json();
                    document.getElementById('totalCoursesCount').innerText = adminCourses.length;
                    
                    const tbody = document.getElementById('coursesTableBody');
                    tbody.innerHTML = '';
                    if (adminCourses.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="5" class="p-4 text-center">No courses found.</td></tr>';
                        return;
                    }

                    adminCourses.forEach(c => {
                        const tr = document.createElement('tr');
                        tr.className = "border-b border-gray-200 hover:bg-gray-50";
                        tr.innerHTML = `
                            <td class="p-4">${c.id}</td>
                            <td class="p-4 font-bold text-primary">${c.code}</td>
                            <td class="p-4">${c.title}</td>
                            <td class="p-4 italic">${c.lecturer_name || 'TBA'}</td>
                            <td class="p-4 text-right space-x-2">
                                <button onclick="openEditModal(${c.id})" class="text-sm bg-primary text-white px-3 py-1 doodle-border font-bold hover:bg-opacity-90">Edit</button>
                                <button onclick="deleteCourse(${c.id}, '${c.code}')" class="text-sm bg-danger text-white px-3 py-1 doodle-border font-bold hover:bg-opacity-90">Delete</button>
                            </td>
                        `;
                        tbody.appendChild(tr);
                    });
                }
            } catch (error) {
                console.error("Error fetching courses", error);
            }
        }

        async function updateRole(userId) {
            const select = document.querySelector(`.role-select[data-user-id="${userId}"]`);
            const newRole = select.value;
            try {
                const res = await fetch(CONFIG.API_BASE_URL + `/api/admin/users/${userId}/role`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify({ role: newRole })
                });
                if (res.ok) {
                    alert(`User role updated to ${newRole}`);
                } else {
                    const err = await res.json();
                    alert(err.detail || "Failed to update role");
                }
            } catch (e) {
                console.error(e);
                alert("Error communicating with server.");
            }
        }

        async function deleteUser(userId, username) {
            if (!confirm(`Are you sure you want to permanently delete user '${username}'?`)) return;
            try {
                const res = await fetch(CONFIG.API_BASE_URL + `/api/admin/users/${userId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    alert('User deleted.');
                    fetchUsers();
                } else {
                    const err = await res.json();
                    alert(err.detail || "Failed to delete user");
                }
            } catch (e) {
                console.error(e);
                alert("Error communicating with server.");
            }
        }

        async function deleteCourse(courseId, code) {
            if (!confirm(`Are you sure you want to permanently delete course '${code}'?`)) return;
            try {
                const res = await fetch(CONFIG.API_BASE_URL + `/api/admin/courses/${courseId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    alert('Course deleted.');
                    fetchCourses();
                } else {
                    const err = await res.json();
                    alert(err.detail || "Failed to delete course");
                }
            } catch (e) {
                console.error(e);
                alert("Error communicating with server.");
            }
        }

        function openCreateModal() { document.getElementById('createModal').classList.remove('hidden'); }
        function closeCreateModal() { document.getElementById('createModal').classList.add('hidden'); }

        document.getElementById('createCourseForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const payload = {
                code: document.getElementById('ccode').value,
                title: document.getElementById('ctitle').value,
                credit_unit: parseInt(document.getElementById('cunit').value),
                level: document.getElementById('clevel').value,
                semester: document.getElementById('csem').value,
                lecturer_name: null
            };

            try {
                const res = await fetch(CONFIG.API_BASE_URL + '/api/admin/courses', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    alert("Course created successfully!");
                    closeCreateModal();
                    document.getElementById('createCourseForm').reset();
                    fetchCourses();
                } else {
                    const err = await res.json();
                    alert(err.detail || "Failed to create course.");
                }
            } catch(err) {
                console.error(err);
                alert("Error communicating with server.");
            }
        });
        let currentEditCourseId = null;

        function openEditModal(courseId) {
            const course = adminCourses.find(c => c.id === courseId);
            if (!course) return;
            currentEditCourseId = courseId;
            
            document.getElementById('edit_ccode').value = course.code;
            document.getElementById('edit_ctitle').value = course.title;
            document.getElementById('edit_cunit').value = course.credit_unit;
            document.getElementById('edit_clevel').value = course.level;
            document.getElementById('edit_csem').value = course.semester;
            
            document.getElementById('editModal').classList.remove('hidden');
        }

        function closeEditModal() {
            currentEditCourseId = null;
            document.getElementById('editModal').classList.add('hidden');
        }

        document.getElementById('editCourseForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentEditCourseId) return;

            const course = adminCourses.find(c => c.id === currentEditCourseId);

            const payload = {
                code: document.getElementById('edit_ccode').value,
                title: document.getElementById('edit_ctitle').value,
                credit_unit: parseInt(document.getElementById('edit_cunit').value),
                level: document.getElementById('edit_clevel').value,
                semester: document.getElementById('edit_csem').value,
                lecturer_name: course.lecturer_name // preserve the existing lecturer
            };

            try {
                const res = await fetch(CONFIG.API_BASE_URL + `/api/admin/courses/${currentEditCourseId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    alert("Course updated successfully!");
                    closeEditModal();
                    fetchCourses();
                } else {
                    const err = await res.json();
                    alert(err.detail || "Failed to update course.");
                }
            } catch(err) {
                console.error(err);
                alert("Error communicating with server.");
            }
        });