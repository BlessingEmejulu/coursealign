from fastapi import APIRouter, Depends, HTTPException, status
import sqlite3
from typing import List, Dict

from app.database.database import get_db
from app.auth.auth import require_role
from app.schemas.schemas import CourseCreate, CourseResponse

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/users")
def get_all_users(db: sqlite3.Connection = Depends(get_db), current_user: dict = Depends(require_role("admin"))):
    cursor = db.cursor()
    cursor.execute("SELECT id, username, email, role, created_at FROM users")
    users = cursor.fetchall()
    return [dict(u) for u in users]

@router.put("/users/{user_id}/role")
def update_user_role(user_id: int, payload: Dict[str, str], db: sqlite3.Connection = Depends(get_db), current_user: dict = Depends(require_role("admin"))):
    new_role = payload.get("role")
    if new_role not in ["student", "lecturer", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")
        
    cursor = db.cursor()
    cursor.execute("UPDATE users SET role = ? WHERE id = ?", (new_role, user_id))
    db.commit()
    
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="User not found")
        
    return {"message": f"User {user_id} role updated to {new_role}"}

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: sqlite3.Connection = Depends(get_db), current_user: dict = Depends(require_role("admin"))):
    if user_id == current_user['id']:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
        
    cursor = db.cursor()
    # Delete related data first to avoid constraint issues, or let CASCADE handle if configured.
    # SQLite default might not cascade unless PRAGMA foreign_keys = ON.
    # Safe manual deletion:
    cursor.execute("DELETE FROM bookmarks WHERE user_id = ?", (user_id,))
    cursor.execute("DELETE FROM chat_sessions WHERE user_id = ?", (user_id,))
    cursor.execute("DELETE FROM quiz_attempts WHERE user_id = ?", (user_id,))
    
    # Check if they are a lecturer and created courses
    cursor.execute("SELECT username FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()
    if user:
        # Set their courses to TBA
        cursor.execute("UPDATE courses SET lecturer_name = 'TBA' WHERE lecturer_name = ?", (user['username'],))
        
    cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
    db.commit()
    
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="User not found")
        
    return {"message": "User deleted successfully"}

@router.get("/courses")
def get_all_courses(db: sqlite3.Connection = Depends(get_db), current_user: dict = Depends(require_role("admin"))):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM courses")
    courses = cursor.fetchall()
    return [dict(c) for c in courses]

@router.delete("/courses/{course_id}")
def delete_course(course_id: int, db: sqlite3.Connection = Depends(get_db), current_user: dict = Depends(require_role("admin"))):
    cursor = db.cursor()
    # Manual cascade deletes
    cursor.execute("DELETE FROM bookmarks WHERE course_id = ?", (course_id,))
    cursor.execute("DELETE FROM course_outlines WHERE course_id = ?", (course_id,))
    cursor.execute("DELETE FROM resources WHERE course_id = ?", (course_id,))
    cursor.execute("DELETE FROM courses WHERE id = ?", (course_id,))
    db.commit()
    
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Course not found")
        
    return {"message": "Course deleted successfully"}

@router.post('/courses', response_model=CourseResponse)
def create_course(course: CourseCreate, db: sqlite3.Connection = Depends(get_db), current_user: dict = Depends(require_role('admin'))):
    cursor = db.cursor()
    cursor.execute('SELECT * FROM courses WHERE code = ?', (course.code,))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail='Course code already exists')
    
    cursor.execute(
        '''INSERT INTO courses 
        (code, title, description, credit_unit, level, semester, lecturer_name)
        VALUES (?, ?, ?, ?, ?, ?, ?)''',
        (course.code, course.title, course.description, course.credit_unit, 
         course.level, course.semester, course.lecturer_name)
    )
    db.commit()
    course_id = cursor.lastrowid
    
    cursor.execute('SELECT * FROM courses WHERE id = ?', (course_id,))
    new_course = cursor.fetchone()
    return dict(new_course)


@router.put('/courses/{course_id}', response_model=CourseResponse)
def update_course(course_id: int, course: CourseCreate, db: sqlite3.Connection = Depends(get_db), current_user: dict = Depends(require_role('admin'))):
    cursor = db.cursor()
    cursor.execute('SELECT * FROM courses WHERE id = ?', (course_id,))
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail='Course not found')
    
    # Ensure code uniqueness if changed
    cursor.execute('SELECT * FROM courses WHERE code = ? AND id != ?', (course.code, course_id))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail='Course code already exists for another course')
        
    cursor.execute(
        '''UPDATE courses SET 
        code = ?, title = ?, description = ?, credit_unit = ?, level = ?, semester = ?, lecturer_name = ?
        WHERE id = ?''',
        (course.code, course.title, course.description, course.credit_unit, 
         course.level, course.semester, course.lecturer_name, course_id)
    )
    db.commit()
    
    cursor.execute('SELECT * FROM courses WHERE id = ?', (course_id,))
    updated_course = cursor.fetchone()
    return dict(updated_course)

