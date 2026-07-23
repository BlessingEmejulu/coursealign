from fastapi import APIRouter, Depends, HTTPException, status
import sqlite3
from typing import List

from app.database.database import get_db
from app.schemas.schemas import BookmarkResponse, BookmarkCreate
from app.auth.auth import get_current_active_user

router = APIRouter(prefix="/api/bookmarks", tags=["bookmarks"])

@router.get("/", response_model=List[BookmarkResponse])
def get_user_bookmarks(current_user: dict = Depends(get_current_active_user), db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM bookmarks WHERE user_id = ?", (current_user["id"],))
    bookmarks = cursor.fetchall()
    
    result = []
    for b in bookmarks:
        b_dict = dict(b)
        cursor.execute("SELECT * FROM courses WHERE id = ?", (b_dict["course_id"],))
        course = cursor.fetchone()
        b_dict["course"] = dict(course) if course else None
        result.append(b_dict)
        
    return result

@router.post("/", response_model=BookmarkResponse)
def create_bookmark(bookmark: BookmarkCreate, current_user: dict = Depends(get_current_active_user), db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM courses WHERE id = ?", (bookmark.course_id,))
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="Course not found")
        
    cursor.execute("SELECT * FROM bookmarks WHERE user_id = ? AND course_id = ?", 
                  (current_user["id"], bookmark.course_id))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Course already bookmarked")
        
    cursor.execute("INSERT INTO bookmarks (user_id, course_id) VALUES (?, ?)",
                  (current_user["id"], bookmark.course_id))
    db.commit()
    
    bookmark_id = cursor.lastrowid
    cursor.execute("SELECT * FROM bookmarks WHERE id = ?", (bookmark_id,))
    new_bookmark = dict(cursor.fetchone())
    
    cursor.execute("SELECT * FROM courses WHERE id = ?", (new_bookmark["course_id"],))
    new_bookmark["course"] = dict(cursor.fetchone())
    
    return new_bookmark

@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bookmark(course_id: int, current_user: dict = Depends(get_current_active_user), db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM bookmarks WHERE user_id = ? AND course_id = ?", 
                  (current_user["id"], course_id))
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="Bookmark not found")
        
    cursor.execute("DELETE FROM bookmarks WHERE user_id = ? AND course_id = ?", 
                  (current_user["id"], course_id))
    db.commit()
    return None
