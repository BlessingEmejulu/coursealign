from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# --- User Schemas ---
class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: str = "student"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Auth Schemas ---
class PasswordResetRequest(BaseModel):
    username: str
    email: EmailStr
    new_password: str
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

# --- Course Schemas ---
class CourseBase(BaseModel):
    code: str
    title: str
    description: Optional[str] = None
    credit_unit: int
    level: str
    semester: str
    lecturer_name: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class CourseResponse(CourseBase):
    id: int

    class Config:
        from_attributes = True

class CourseOutlineCreate(BaseModel):
    learning_objectives: Optional[str] = None
    weekly_outline: Optional[str] = None
    recommended_textbooks: Optional[str] = None

class CourseOutlineResponse(CourseOutlineCreate):
    id: int
    course_id: int

class ResourceCreate(BaseModel):
    title: str
    file_path: str
    type: Optional[str] = "link"

class ResourceResponse(ResourceCreate):
    id: int
    course_id: int

# --- Bookmark Schemas ---
class BookmarkCreate(BaseModel):
    course_id: int

class BookmarkResponse(BaseModel):
    id: int
    user_id: int
    course_id: int
    course: CourseResponse
    created_at: datetime

    class Config:
        from_attributes = True

# --- AI Chat Schemas ---
class ChatMessageCreate(BaseModel):
    content: str
    course_id: Optional[int] = None

class ChatMessageResponse(BaseModel):
    id: int
    role: str
    content: str
    timestamp: datetime

    class Config:
        from_attributes = True
