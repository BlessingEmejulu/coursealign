import requests
import sqlite3

user_data = {
    'username': 'admin_user', 
    'email': 'admin@coursealign.com', 
    'password': 'AdminPassword123!', 
    'role': 'student'
}
r = requests.post('http://127.0.0.1:8000/api/auth/register', json=user_data)
print('Register Response:', r.status_code, r.text)

conn = sqlite3.connect('coursealign.db')
cursor = conn.cursor()
cursor.execute("UPDATE users SET role='admin' WHERE username='admin_user'")
conn.commit()
conn.close()
print('Admin user seeded.')
