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

        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const btn = e.target.querySelector('button');
            const originalText = btn.innerText;
            
            try {
                btn.innerText = 'Logging in...';
                btn.disabled = true;
                
                const formData = new URLSearchParams();
                formData.append('username', username);
                formData.append('password', password);

                const response = await fetch(CONFIG.API_BASE_URL + '/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formData
                });
                
                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('token', data.access_token);
                    
                    const payload = parseJwt(data.access_token);
                    if (payload && payload.role === 'admin') {
                        window.location.href = 'admin-dashboard.html';
                    } else if (payload && payload.role === 'lecturer') {
                        window.location.href = 'lecturer-dashboard.html';
                    } else {
                        window.location.href = 'dashboard.html';
                    }
                } else {
                    const errorData = await response.json();
                    alert(errorData.detail || 'Incorrect username or password');
                    btn.innerText = originalText;
                    btn.disabled = false;
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('Failed to communicate with the server.');
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });