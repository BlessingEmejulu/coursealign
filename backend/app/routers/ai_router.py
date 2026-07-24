from fastapi import APIRouter, Depends, HTTPException
import sqlite3
from app.database.database import get_db
from app.schemas.schemas import ChatMessageCreate, ChatMessageResponse, QuizGenerateRequest, QuizFeedbackRequest, QuizFeedbackResponse
from app.auth.auth import get_current_active_user
from app.services.ai_service import generate_ai_response, generate_quiz, generate_quiz_feedback

router = APIRouter(prefix="/api/ai", tags=["ai"])

@router.post("/chat", response_model=ChatMessageResponse)
def chat_with_tutor(message: ChatMessageCreate, current_user: dict = Depends(get_current_active_user), conn: sqlite3.Connection = Depends(get_db)):
    print(f"DEBUG: Received chat request from user {current_user['id']} with message: {message.content}")
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

@router.post("/quiz/generate")
def generate_practice_quiz(request: QuizGenerateRequest, current_user: dict = Depends(get_current_active_user), conn: sqlite3.Connection = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("SELECT id, code, title, description FROM courses WHERE code = ?", (request.course_code.upper(),))
    course = cursor.fetchone()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    context = f"Course: {course['code']} - {course['title']}. Description: {course['description']}"
    
    cursor.execute("SELECT learning_objectives, weekly_outline FROM course_outlines WHERE course_id = ?", (course['id'],))
    outline = cursor.fetchone()
    if outline:
        context += f" Topics: {outline['learning_objectives']} {outline['weekly_outline']}"
        
    try:
        quiz_json = generate_quiz(context, request.difficulty, request.num_questions, request.question_types)
        return {"quiz": quiz_json}
    except Exception as e:
        print(f"Error generating quiz: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/quiz/feedback")
def get_quiz_feedback(request: QuizFeedbackRequest, current_user: dict = Depends(get_current_active_user)):
    try:
        feedback_json = generate_quiz_feedback(request.course_code, request.score, request.total, request.incorrect_topics)
        import json
        feedback_data = json.loads(feedback_json)
        return feedback_data
    except Exception as e:
        print(f"Error generating quiz feedback: {e}")
        # Return a fallback if AI fails, so the UI doesn't crash, or raise 500.
        # Returning a fallback is better for UX here.
        return {"feedback": "Good effort! Keep studying the material.", "suggested_topics": []}
