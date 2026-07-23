@echo off
echo Starting CourseAlign Backend Server...
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
pause
