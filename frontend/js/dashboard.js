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

        document.addEventListener('DOMContentLoaded', () => {
            const token = localStorage.getItem('token');
            if (token) {
                const payload = parseJwt(token);
                if (payload && payload.sub) {
                    document.getElementById('welcome-msg').innerText = `Welcome back, ${payload.sub}!`;
                }
            }
        });

        function logout() {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        }