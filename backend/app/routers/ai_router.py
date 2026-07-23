from fastapi import APIRouter, Depends, HTTPException
import sqlite3
from app.database.database import get_db
from app.schemas.schemas import ChatMessageCreate, ChatMessageResponse
from app.auth.auth import get_current_active_user
from app.services.ai_service import generate_ai_response, generate_quiz

router = APIRouter(prefix="/api/ai", tags=["ai"])

@router.post("/chat", response_model=ChatMessageResponse)
def chat_with_tutor(message: ChatMessageCreate, current_user: dict = Depends(get_current_active_user), conn: sqlite3.Connection = Depends(get_db)):
    cursor = conn.cursor()
    context = "General Computer Science topics."
    
    # If a specific course is targeted, load its context
    if message.course_id:
        cursor.execute("SELECT code, title, description FROM courses WHERE id = ?", (message.course_id,))
        course = cursor.fetchone()
        if course:
            context = f"Course: {course['code']} - {course['title']}. Description: {course['description']}"
            cursor.execute("SELECT learning_objectives, weekly_outline FROM course_outlines WHERE course_id = ?", (message.course_id,))
            outline = cursor.fetchone()
            if outline:
                context += f" Outline: {outline['learning_objectives']} {outline['weekly_outline']}"
                
    # Create or find active chat session
    if message.course_id:
        cursor.execute("SELECT id FROM chat_sessions WHERE user_id = ? AND course_id = ? ORDER BY id DESC LIMIT 1", (current_user['id'], message.course_id))
    else:
        cursor.execute("SELECT id FROM chat_sessions WHERE user_id = ? AND course_id IS NULL ORDER BY id DESC LIMIT 1", (current_user['id'],))
        
    session = cursor.fetchone()
    if not session:
        cursor.execute("INSERT INTO chat_sessions (user_id, course_id) VALUES (?, ?)", (current_user['id'], message.course_id))
        conn.commit()
        session_id = cursor.lastrowid
    else:
        session_id = session['id']
        
    # Save user message
    cursor.execute("INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)", (session_id, "user", message.content))
    conn.commit()
    
    # Generate AI response
    ai_text = generate_ai_response(message.content, context)
    
    # Save AI message
    cursor.execute("INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)", (session_id, "ai", ai_text))
    conn.commit()
    ai_msg_id = cursor.lastrowid
    
    from datetime import datetime, timezone
    return ChatMessageResponse(id=ai_msg_id, role="ai", content=ai_text, timestamp=datetime.now(timezone.utc))

@router.get("/quiz/{course_code}")
def get_practice_quiz(course_code: str, current_user: dict = Depends(get_current_active_user), conn: sqlite3.Connection = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("SELECT id, code, title, description FROM courses WHERE code = ?", (course_code.upper(),))
    course = cursor.fetchone()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    context = f"Course: {course['code']} - {course['title']}. Description: {course['description']}"
    
    cursor.execute("SELECT learning_objectives, weekly_outline FROM course_outlines WHERE course_id = ?", (course['id'],))
    outline = cursor.fetchone()
    if outline:
        context += f" Topics: {outline['learning_objectives']} {outline['weekly_outline']}"
        
    quiz_json = generate_quiz(context)
    return {"quiz": quiz_json}
