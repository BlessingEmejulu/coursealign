from fastapi import APIRouter, Depends, HTTPException, status
import sqlite3
from typing import List

from app.database.database import get_db
from app.schemas.schemas import CourseResponse, CourseCreate, CourseOutlineCreate, CourseOutlineResponse, ResourceCreate, ResourceResponse
from app.auth.auth import get_current_active_user, require_role

router = APIRouter(prefix="/api/courses", tags=["courses"])

@router.get("/", response_model=List[CourseResponse])
def get_courses(skip: int = 0, limit: int = 100, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM courses LIMIT ? OFFSET ?", (limit, skip))
    rows = cursor.fetchall()
    return [dict(row) for row in rows]

@router.get("/{course_code}", response_model=CourseResponse)
def get_course_by_code(course_code: str, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM courses WHERE code = ?", (course_code.upper(),))
    course = cursor.fetchone()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return dict(course)

@router.post("/", response_model=CourseResponse, dependencies=[Depends(require_role("lecturer"))])
def create_course(course: CourseCreate, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM courses WHERE code = ?", (course.code,))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Course code already exists")
    
    cursor.execute(
        '''INSERT INTO courses 
        (code, title, description, credit_unit, level, semester, lecturer_name)
        VALUES (?, ?, ?, ?, ?, ?, ?)''',
        (course.code, course.title, course.description, course.credit_unit, 
         course.level, course.semester, course.lecturer_name)
    )
    db.commit()
    course_id = cursor.lastrowid
    
    cursor.execute("SELECT * FROM courses WHERE id = ?", (course_id,))
    new_course = cursor.fetchone()
    return dict(new_course)

@router.post("/{course_id}/outline", response_model=CourseOutlineResponse, dependencies=[Depends(require_role("lecturer"))])
def add_course_outline(course_id: int, outline: CourseOutlineCreate, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM courses WHERE id = ?", (course_id,))
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="Course not found")
        
    cursor.execute("SELECT id FROM course_outlines WHERE course_id = ?", (course_id,))
    if cursor.fetchone():
        cursor.execute('''
            UPDATE course_outlines 
            SET learning_objectives = ?, weekly_outline = ?, recommended_textbooks = ?
            WHERE course_id = ?
        ''', (outline.learning_objectives, outline.weekly_outline, outline.recommended_textbooks, course_id))
    else:
        cursor.execute('''
            INSERT INTO course_outlines (course_id, learning_objectives, weekly_outline, recommended_textbooks)
            VALUES (?, ?, ?, ?)
        ''', (course_id, outline.learning_objectives, outline.weekly_outline, outline.recommended_textbooks))
        
    db.commit()
    cursor.execute("SELECT * FROM course_outlines WHERE course_id = ?", (course_id,))
    return dict(cursor.fetchone())

@router.post("/{course_id}/resources", response_model=ResourceResponse, dependencies=[Depends(require_role("lecturer"))])
def add_course_resource(course_id: int, resource: ResourceCreate, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM courses WHERE id = ?", (course_id,))
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="Course not found")
        
    cursor.execute('''
        INSERT INTO resources (course_id, title, file_path, type)
        VALUES (?, ?, ?, ?)
    ''', (course_id, resource.title, resource.file_path, resource.type))
    db.commit()
    
    resource_id = cursor.lastrowid
    cursor.execute("SELECT * FROM resources WHERE id = ?", (resource_id,))
    return dict(cursor.fetchone())
