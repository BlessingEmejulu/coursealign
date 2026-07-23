import sqlite3
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.auth.auth import get_password_hash
from app.database.database import DB_FILE

def create_admin():
    print("--- CourseAlign Admin Bootstrap ---")
    username = input("Enter admin username: ").strip()
    email = input("Enter admin email: ").strip()
    password = input("Enter admin password: ").strip()

    if not username or not email or not password:
        print("Error: All fields are required.")
        return

    hashed_password = get_password_hash(password)

    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO users (username, email, hashed_password, role)
            VALUES (?, ?, ?, 'admin')
        ''', (username, email, hashed_password))
        
        conn.commit()
        print(f"Success! Admin user '{username}' created.")
    except sqlite3.IntegrityError:
        print("Error: Username or email already exists. Try promoting an existing user or using a different name.")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    create_admin()
