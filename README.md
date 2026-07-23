# CourseAlign 🎓

CourseAlign is a modern, AI-powered Course Outline Management and Learning Support System designed specifically for the Department of Computer Science at Chukwuemeka Odumegwu Ojukwu University (COOU). It features an interactive Hand-Drawn "Doodle" Design System, a full RESTful backend, and deep integration with the Google Gemini API to serve as a 24/7 AI Tutor.

## 🌟 Key Features
- **Centralized Course Catalog**: Browse official outlines, credit units, and course objectives.
- **AI Tutor (Gemini API)**: Stuck on a concept? Chat with an AI tutor directly from your course page.
- **Practice Quizzes**: Test your knowledge before exams with AI-generated quizzes.
- **Student Dashboard**: Track your bookmarked courses, recent chats, and quiz scores.

## 🛠️ Technology Stack
- **Frontend**: Vanilla HTML/JS, Tailwind CSS (CDN), Custom CSS (Hand Drawn Design System).
- **Backend**: Python 3.13+, FastAPI, SQLAlchemy (SQLite), JWT Authentication.
- **AI Integration**: Google Generative AI (Gemini 1.5 Flash).
- **Deployment Ready**: Included `Dockerfile` and `docker-compose.yml`.

---

## 🚀 Getting Started

Follow these steps to run the complete Full-Stack application locally.

### Prerequisites
- Python 3.10 or newer installed.
- (Optional) Docker if you prefer containerized deployment.

### 1. Setting up the Backend
The backend serves the API endpoints and connects to the database.

1. Open your terminal or Command Prompt.
2. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
3. Create a virtual environment (recommended):
   ```bash
   python -m venv env
   ```
4. Activate the virtual environment:
   - **Windows:** `env\Scripts\activate`
   - **Mac/Linux:** `source env/bin/activate`
5. Install the required dependencies:
   ```bash
   pip install fastapi uvicorn sqlalchemy pydantic passlib bcrypt python-jose python-multipart google-generativeai
   ```
6. Set your Gemini API Key (Required for AI Features):
   - **Windows (Command Prompt):** `set GEMINI_API_KEY=your_actual_key_here`
   - **Windows (PowerShell):** `$env:GEMINI_API_KEY="your_actual_key_here"`
   - **Mac/Linux:** `export GEMINI_API_KEY=your_actual_key_here`
7. Start the server:
   ```bash
   python -m uvicorn main:app --reload
   ```
   *You should see a message indicating the application startup is complete and running on `http://127.0.0.1:8000`.*

### 2. Setting up the Frontend
The frontend consists of static files that need to be served over HTTP to prevent CORS errors and allow the Service Worker to function properly.

1. Open a **new** terminal window (keep the backend running in the first one).
2. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
3. Start a simple Python HTTP server:
   ```bash
   python -m http.server 8080
   ```
4. Open your browser and go to:
   [http://localhost:8080/pages/index.html](http://localhost:8080/pages/index.html)

---

## 💡 Quick Start Scripts (Windows Only)
For convenience, two batch scripts have been provided in the root directory:
- **`start_backend.bat`**: Double-click this to automatically start the FastAPI server.
- **`start_frontend.bat`**: Double-click this to start the UI server and automatically open the application in your default browser.

*(Note: Ensure your dependencies are installed via pip before using the quick start scripts).*

## Troubleshooting
- **"Failed to Fetch" Error**: This means your frontend cannot communicate with the backend. Ensure the backend terminal is open, running without errors, and hosted on port `8000`.
- **Hanging Server / No "Startup Complete" Message**: If you run `uvicorn main:app --reload` and it gets stuck at "Started reloader process", run it without `--reload` (`python -m uvicorn main:app`) to reveal the underlying Python error (e.g., a missing dependency).
