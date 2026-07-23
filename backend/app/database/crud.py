import sqlite3
from typing import List, Optional, Dict

# --- Bookmark CRUD ---
def get_user_bookmarks(conn: sqlite3.Connection, user_id: int) -> List[Dict]:
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM bookmarks WHERE user_id = ?", (user_id,))
    bookmarks = cursor.fetchall()
    
    result = []
    for b in bookmarks:
        b_dict = dict(b)
        cursor.execute("SELECT * FROM courses WHERE id = ?", (b_dict["course_id"],))
        course = cursor.fetchone()
        b_dict["course"] = dict(course) if course else None
        result.append(b_dict)
    return result

def get_course_by_id(conn: sqlite3.Connection, course_id: int) -> Optional[Dict]:
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM courses WHERE id = ?", (course_id,))
    res = cursor.fetchone()
    return dict(res) if res else None

def get_bookmark(conn: sqlite3.Connection, user_id: int, course_id: int) -> Optional[Dict]:
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM bookmarks WHERE user_id = ? AND course_id = ?", (user_id, course_id))
    res = cursor.fetchone()
    return dict(res) if res else None

def create_bookmark(conn: sqlite3.Connection, user_id: int, course_id: int) -> int:
    cursor = conn.cursor()
    cursor.execute("INSERT INTO bookmarks (user_id, course_id) VALUES (?, ?)", (user_id, course_id))
    conn.commit()
    return cursor.lastrowid

def get_bookmark_by_id(conn: sqlite3.Connection, bookmark_id: int) -> Optional[Dict]:
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM bookmarks WHERE id = ?", (bookmark_id,))
    res = cursor.fetchone()
    return dict(res) if res else None

def delete_bookmark(conn: sqlite3.Connection, user_id: int, course_id: int):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM bookmarks WHERE user_id = ? AND course_id = ?", (user_id, course_id))
    conn.commit()
