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
