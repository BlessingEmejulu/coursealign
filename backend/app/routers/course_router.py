from fastapi import APIRouter, Depends, HTTPException, status
import sqlite3
from typing import List

from app.database.database import get_db
from app.schemas.schemas import CourseResponse, CourseCreate, CourseOutlineCreate, CourseOutlineResponse, ResourceCreate, ResourceResponse, CourseAssignUpdate
from app.auth.auth import get_current_active_user, require_role

router = APIRouter(prefix="/api/courses", tags=["courses"])

@router.get("/", response_model=List[CourseResponse])
def get_courses(skip: int = 0, limit: int = 100, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM courses LIMIT ? OFFSET ?", (limit, skip))
    rows = cursor.fetchall()
    return [dict(row) for row in rows]



@router.put("/{course_code}/assign", response_model=CourseResponse, dependencies=[Depends(require_role("lecturer"))])
def assign_course(course_code: str, update_data: CourseAssignUpdate, db: sqlite3.Connection = Depends(get_db), current_user: dict = Depends(get_current_active_user)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM courses WHERE code = ?", (course_code,))
    course = cursor.fetchone()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    credit_unit = update_data.credit_unit if update_data.credit_unit is not None else course['credit_unit']
    level = update_data.level if update_data.level is not None else course['level']
    semester = update_data.semester if update_data.semester is not None else course['semester']
    description = update_data.description if update_data.description is not None else course['description']

    cursor.execute(
        "UPDATE courses SET lecturer_name = ?, credit_unit = ?, level = ?, semester = ?, description = ? WHERE code = ?", 
        (current_user['username'], credit_unit, level, semester, description, course_code)
    )
    db.commit()
    
    cursor.execute("SELECT * FROM courses WHERE code = ?", (course_code,))
    updated_course = cursor.fetchone()
    return dict(updated_course)

@router.get("/{course_id}/outline", response_model=CourseOutlineResponse)
def get_course_outline(course_id: int, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM courses WHERE id = ?", (course_id,))
    course = cursor.fetchone()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    cursor.execute("SELECT * FROM course_outlines WHERE course_id = ?", (course_id,))
    outline = cursor.fetchone()
    if not outline:
        raise HTTPException(status_code=404, detail="Course outline not found")
        
    outline_data = dict(outline)
    outline_data['description'] = course['description']
    return outline_data

@router.post("/{course_id}/outline", response_model=CourseOutlineResponse, dependencies=[Depends(require_role("lecturer"))])
def add_course_outline(course_id: int, outline: CourseOutlineCreate, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM courses WHERE id = ?", (course_id,))
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="Course not found")
        
    if outline.description is not None:
        cursor.execute("UPDATE courses SET description = ? WHERE id = ?", (outline.description, course_id))

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
    outline_data = dict(cursor.fetchone())
    outline_data['description'] = outline.description
    return outline_data

@router.get("/{course_id}/resources", response_model=List[ResourceResponse])
def get_course_resources(course_id: int, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM courses WHERE id = ?", (course_id,))
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="Course not found")
        
    cursor.execute("SELECT * FROM resources WHERE course_id = ?", (course_id,))
    resources = cursor.fetchall()
    return [dict(r) for r in resources]

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

@router.get("/{course_code}", response_model=CourseResponse)
def get_course_by_code(course_code: str, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM courses WHERE code = ?", (course_code,))
    course = cursor.fetchone()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return dict(course)
