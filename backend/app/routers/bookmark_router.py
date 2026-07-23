from fastapi import APIRouter, Depends, HTTPException, status
import sqlite3
from typing import List

from app.database.database import get_db
from app.database import crud
from app.schemas.schemas import BookmarkResponse, BookmarkCreate
from app.auth.auth import get_current_active_user

router = APIRouter(prefix="/api/bookmarks", tags=["bookmarks"])

@router.get("/", response_model=List[BookmarkResponse])
def get_user_bookmarks(current_user: dict = Depends(get_current_active_user), db: sqlite3.Connection = Depends(get_db)):
    return crud.get_user_bookmarks(db, current_user["id"])

@router.post("/", response_model=BookmarkResponse)
def create_bookmark(bookmark: BookmarkCreate, current_user: dict = Depends(get_current_active_user), db: sqlite3.Connection = Depends(get_db)):
    if not crud.get_course_by_id(db, bookmark.course_id):
        raise HTTPException(status_code=404, detail="Course not found")
        
    if crud.get_bookmark(db, current_user["id"], bookmark.course_id):
        raise HTTPException(status_code=400, detail="Course already bookmarked")
        
    bookmark_id = crud.create_bookmark(db, current_user["id"], bookmark.course_id)
    new_bookmark = crud.get_bookmark_by_id(db, bookmark_id)
    new_bookmark["course"] = crud.get_course_by_id(db, new_bookmark["course_id"])
    
    return new_bookmark

@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bookmark(course_id: int, current_user: dict = Depends(get_current_active_user), db: sqlite3.Connection = Depends(get_db)):
    if not crud.get_bookmark(db, current_user["id"], course_id):
        raise HTTPException(status_code=404, detail="Bookmark not found")
        
    crud.delete_bookmark(db, current_user["id"], course_id)
    return None
