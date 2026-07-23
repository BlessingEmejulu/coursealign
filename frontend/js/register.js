document.getElementById('registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;
            
            const btn = e.target.querySelector('button');
            const originalText = btn.innerText;
            
            try {
                btn.innerText = 'Creating account...';
                btn.disabled = true;
                
                const response = await fetch(CONFIG.API_BASE_URL + '/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email, password, role })
                });
                
                if (response.ok) {
                    alert('Registration successful! Please log in.');
                    window.location.href = 'login.html';
                } else {
                    const errorData = await response.json();
                    alert(errorData.detail || 'Registration failed');
                    btn.innerText = originalText;
                    btn.disabled = false;
                }
            } catch (error) {
                console.error('Registration error:', error);
                alert('Failed to communicate with the server.');
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });