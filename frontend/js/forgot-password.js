document.getElementById('resetForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const new_password = document.getElementById('new_password').value;
            
            const btn = e.target.querySelector('button');
            const originalText = btn.innerText;
            
            try {
                btn.innerText = 'Resetting...';
                btn.disabled = true;
                
                const response = await fetch(CONFIG.API_BASE_URL + '/api/auth/reset-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email, new_password })
                });
                
                if (response.ok) {
                    alert('Password successfully reset! You can now login with your new password.');
                    window.location.href = 'login.html';
                } else {
                    const errorData = await response.json();
                    alert(errorData.detail || 'Failed to reset password. Please check your details.');
                    btn.innerText = originalText;
                    btn.disabled = false;
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Is the backend running?');
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });