import requests
import sqlite3

# Let's just create a test user or login with one.
db = sqlite3.connect('coursealign.db')
cursor = db.cursor()
cursor.execute("SELECT username, email FROM users LIMIT 1")
row = cursor.fetchone()
db.close()

if not row:
    print("No users found.")
else:
    username = row[0]
    # Default password used for test users or maybe we can just create a new test user via API.
    # Actually, we can just login with a new registered user.
    session = requests.Session()
    
    # Register test
    test_user = {"username": "test_auth_me_user", "email": "test@authme.com", "password": "password123", "role": "student"}
    r = session.post("http://127.0.0.1:8000/api/auth/register", json=test_user)
    
    # Login
    r = session.post("http://127.0.0.1:8000/api/auth/login", data={"username": "test_auth_me_user", "password": "password123"})
    if r.status_code == 200:
        token = r.json().get("access_token")
        
        # Hit /me
        r_me = session.get("http://127.0.0.1:8000/api/auth/me", headers={"Authorization": f"Bearer {token}"})
        print(f"Status: {r_me.status_code}")
        print(f"Response: {r_me.text}")
    else:
        print(f"Login failed: {r.text}")
