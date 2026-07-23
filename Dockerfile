# Use official Python runtime as a parent image
FROM python:3.13-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Copy requirements or install directly (simulated for now)
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt
RUN pip install fastapi uvicorn sqlalchemy pydantic pyjwt passlib bcrypt google-generativeai python-multipart

# Copy the backend source code
COPY ./backend /app/backend

# Expose port
EXPOSE 8000

# Run FastAPI using uvicorn
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
