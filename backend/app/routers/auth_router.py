from datetime import timedelta
import sqlite3
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.database.database import get_db
from app.schemas.schemas import UserCreate, UserResponse, Token, PasswordResetRequest, UserUpdate
from app.auth.auth import get_password_hash, verify_password, create_access_token, get_current_active_user
from app.core.config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute(
        "SELECT * FROM users WHERE username = ? OR email = ?", 
        (user.username, user.email)
    )
    db_user = cursor.fetchone()
    
    if db_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
        
    hashed_password = get_password_hash(user.password)
    
    cursor.execute(
        "INSERT INTO users (username, email, hashed_password, role) VALUES (?, ?, ?, ?)",
        (user.username, user.email, hashed_password, user.role)
    )
    db.commit()
    
    user_id = cursor.lastrowid
    
    # Fetch the newly created user
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    new_user = cursor.fetchone()
    
    return dict(new_user)

@router.post("/login", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (form_data.username,))
    user = cursor.fetchone()
    
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"], "role": user["role"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/reset-password")
def reset_password(req: PasswordResetRequest, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ? AND email = ?", (req.username, req.email))
    user = cursor.fetchone()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found or email does not match",
        )
        
    hashed_password = get_password_hash(req.new_password)
    cursor.execute("UPDATE users SET hashed_password = ? WHERE username = ?", (hashed_password, req.username))
    db.commit()
    
    return {"message": "Password successfully reset"}

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: dict = Depends(get_current_active_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
def update_user_me(user_update: UserUpdate, current_user: dict = Depends(get_current_active_user), db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    
    # Update fields that are provided
    update_data = user_update.dict(exclude_unset=True)
    if not update_data:
        return current_user
        
    set_clauses = []
    values = []
    
    for key, value in update_data.items():
        set_clauses.append(f"{key} = ?")
        values.append(value)
        
    values.append(current_user['id'])
    
    query = f"UPDATE users SET {', '.join(set_clauses)} WHERE id = ?"
    try:
        cursor.execute(query, tuple(values))
        db.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Username or email already exists")
        
    cursor.execute("SELECT * FROM users WHERE id = ?", (current_user['id'],))
    updated_user = cursor.fetchone()
    
    return dict(updated_user)

@router.get("/me/dashboard")
def get_user_dashboard(current_user: dict = Depends(get_current_active_user), db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    user_id = current_user['id']
    
    # 1. Courses Studied (Distinct courses bookmarked or attempted in quizzes)
    cursor.execute('''
        SELECT COUNT(DISTINCT course_id) FROM (
            SELECT course_id FROM bookmarks WHERE user_id = ?
            UNION
            SELECT course_id FROM quiz_attempts WHERE user_id = ?
            UNION
            SELECT course_id FROM chat_sessions WHERE user_id = ?
        )
    ''', (user_id, user_id, user_id))
    courses_studied = cursor.fetchone()[0] or 0
    
    # 2. Quiz Average
    cursor.execute('''
        SELECT SUM(score) as total_score, SUM(total_questions) as total_q 
        FROM quiz_attempts WHERE user_id = ?
    ''', (user_id,))
    quiz_data = cursor.fetchone()
    quiz_average = 0
    if quiz_data and quiz_data['total_q']:
        quiz_average = int(round((quiz_data['total_score'] / quiz_data['total_q']) * 100))
        
    # 3. AI Chats
    cursor.execute('SELECT COUNT(id) FROM chat_sessions WHERE user_id = ?', (user_id,))
    ai_chats = cursor.fetchone()[0] or 0
    
    # 4. Recent Courses
    # Get courses the user bookmarked recently. If none, get global latest courses.
    cursor.execute('''
        SELECT c.id, c.code, c.title, c.level 
        FROM courses c
        JOIN bookmarks b ON c.id = b.course_id
        WHERE b.user_id = ?
        ORDER BY b.created_at DESC
        LIMIT 2
    ''', (user_id,))
    recent_courses = [dict(row) for row in cursor.fetchall()]
    
    if not recent_courses:
        cursor.execute('''
            SELECT id, code, title, level 
            FROM courses 
            ORDER BY id DESC 
            LIMIT 2
        ''')
        recent_courses = [dict(row) for row in cursor.fetchall()]

    return {
        "stats": {
            "courses_studied": courses_studied,
            "quiz_average": quiz_average,
            "ai_chats": ai_chats
        },
        "recent_courses": recent_courses
    }
