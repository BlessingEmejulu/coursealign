import sqlite3
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.auth.auth import get_password_hash
from app.database.database import DB_FILE

def seed_users():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # 1. Admin
    cursor.execute("DELETE FROM users WHERE username IN ('admin_user', 'student_demo', 'prof_okeke')")
    
    admin_hash = get_password_hash('AdminPassword123!')
    cursor.execute("""
        INSERT INTO users (username, email, hashed_password, role, level, is_active)
        VALUES ('admin_user', 'admin@coursealign.com', ?, 'admin', '400L', 1)
    """, (admin_hash,))
    admin_id = cursor.lastrowid
    
    # 2. Lecturer
    lecturer_hash = get_password_hash('LecturerPass123!')
    cursor.execute("""
        INSERT INTO users (username, email, hashed_password, role, level, is_active)
        VALUES ('prof_okeke', 'okeke@coou.edu.ng', ?, 'lecturer', 'Staff', 1)
    """, (lecturer_hash,))
    lecturer_id = cursor.lastrowid
    
    # 3. Student
    student_hash = get_password_hash('StudentPass123!')
    cursor.execute("""
        INSERT INTO users (username, email, hashed_password, role, level, is_active)
        VALUES ('student_demo', 'student@coou.edu.ng', ?, 'student', '300L', 1)
    """, (student_hash,))
    student_id = cursor.lastrowid
    
    # Assign lecturer to some courses
    cursor.execute("UPDATE courses SET lecturer_name = 'Dr. C. Okeke' WHERE code IN ('CIS 321', 'CIS 201', 'CIS 312')")
    
    # Add bookmarks for student
    cursor.execute("SELECT id FROM courses WHERE code IN ('CIS 321', 'CIS 201', 'CIS 312')")
    courses = cursor.fetchall()
    for (c_id,) in courses:
        cursor.execute("INSERT INTO bookmarks (user_id, course_id) VALUES (?, ?)", (student_id, c_id))
        
    # Add quiz attempts for student
    if courses:
        cursor.execute("INSERT INTO quiz_attempts (user_id, course_id, score, total_questions) VALUES (?, ?, 4, 5)", (student_id, courses[0][0]))
        if len(courses) > 1:
            cursor.execute("INSERT INTO quiz_attempts (user_id, course_id, score, total_questions) VALUES (?, ?, 5, 5)", (student_id, courses[1][0]))
            
    # Add a sample chat session and message
    if courses:
        cursor.execute("INSERT INTO chat_sessions (user_id, course_id, title) VALUES (?, ?, 'Data Structures Query')", (student_id, courses[0][0]))
        session_id = cursor.lastrowid
        cursor.execute("INSERT INTO chat_messages (session_id, role, content) VALUES (?, 'user', 'What is the time complexity of searching in a Balanced Binary Search Tree (AVL Tree)?')", (session_id,))
        cursor.execute("""
            INSERT INTO chat_messages (session_id, role, content) 
            VALUES (?, 'ai', 'In a Balanced Binary Search Tree such as an **AVL Tree** or **Red-Black Tree**, the search time complexity is strictly **O(log n)** in the worst, average, and best cases because the tree maintains a height balanced within O(log n).')
        """, (session_id,))
        
    conn.commit()
    conn.close()
    print("Demo users, courses assignment, bookmarks, quiz attempts, and chat records seeded successfully!")

if __name__ == "__main__":
    seed_users()
