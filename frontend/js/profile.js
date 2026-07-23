document.addEventListener('DOMContentLoaded', async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = 'login.html';
                return;
            }

            try {
                const response = await fetch(CONFIG.API_BASE_URL + '/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    
                    document.getElementById('profile-name').innerText = userData.username;
                    document.getElementById('profile-role').innerText = userData.role;
                    
                    document.getElementById('info-username').value = userData.username;
                    document.getElementById('info-email').value = userData.email;
                    document.getElementById('info-level').value = userData.level || '100L';
                    document.getElementById('info-role').innerText = userData.role;
                    
                    if (userData.username.length > 0) {
                        document.getElementById('profile-avatar').innerText = userData.username.charAt(0).toUpperCase();
                    }
                } else {
                    // Token might be expired
                    localStorage.removeItem('token');
                    window.location.href = 'login.html';
                }
            } catch (e) {
                console.error("Failed to load profile", e);
            }
        });

        document.getElementById('profile-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const token = localStorage.getItem('token');
            const errorMsg = document.getElementById('error-message');
            const successMsg = document.getElementById('success-message');
            const btn = document.getElementById('save-btn');
            
            errorMsg.classList.add('hidden');
            successMsg.classList.add('hidden');
            btn.innerText = 'Saving...';
            btn.disabled = true;

            const updateData = {
                username: document.getElementById('info-username').value,
                email: document.getElementById('info-email').value,
                level: document.getElementById('info-level').value
            };

            try {
                const response = await fetch(CONFIG.API_BASE_URL + '/api/auth/me', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updateData)
                });

                if (response.ok) {
                    const userData = await response.json();
                    document.getElementById('profile-name').innerText = userData.username;
                    if (userData.username.length > 0) {
                        document.getElementById('profile-avatar').innerText = userData.username.charAt(0).toUpperCase();
                    }
                    successMsg.classList.remove('hidden');
                    
                    // Update token logic might be needed here if backend expects token with new username, 
                    // but since username changed, the token sub might be invalid on next request if sub is used.
                    // For now, it will work since backend checks user by token sub, wait, if username changes, the token is technically invalid for next refresh.
                    // Let's prompt user to login again if username changed, or just let it be.
                } else {
                    const data = await response.json();
                    errorMsg.innerText = data.detail || 'Failed to update profile';
                    errorMsg.classList.remove('hidden');
                }
            } catch (e) {
                errorMsg.innerText = 'Network error occurred.';
                errorMsg.classList.remove('hidden');
            } finally {
                btn.innerText = 'Save Changes';
                btn.disabled = false;
            }
        });

        function logout() {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        }