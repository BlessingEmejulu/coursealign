# CourseAlign 🎓

![CourseAlign Landing Page](assets/images/screenshot.png)
*(Please save a screenshot of your landing page as `assets/images/screenshot.png` to display it here!)*

CourseAlign is a modern, AI-powered Course Outline Management and Learning Support System designed specifically for the Department of Computer Science at Chukwuemeka Odumegwu Ojukwu University (COOU). It features an interactive Hand-Drawn "Doodle" Design System, a full RESTful backend, and deep integration with a local **Gemma 4** model via Ollama to serve as a 100% free and private 24/7 AI Tutor.

## 🌟 Key Features
- **Centralized Course Catalog**: Browse official outlines, credit units, and course objectives.
- **Admin Dashboard**: Manage user roles (Promote students to lecturers or admins) and delete deprecated courses globally.
- **Lecturer Portal**: Lecturers can securely upload their course outlines, syllabus, and verified resource links.
- **AI Tutor (Local Gemma 4)**: Stuck on a concept? Chat securely and privately with a local AI tutor directly from your course page.
- **Practice Quizzes**: Test your knowledge before exams with dynamic, AI-generated quizzes graded instantly.
- **Progressive Web App (PWA)**: Installable directly to your device for native-like access and offline capabilities.

## 🛠️ Technology Stack
- **Frontend**: Vanilla HTML/JS, Tailwind CSS (CDN), Custom CSS (Hand-Drawn Design System).
- **Backend**: Python 3.13+, FastAPI, raw SQLite, JWT Authentication.
- **AI Integration**: Local Ollama server running `gemma4:2b`.
- **Deployment Ready**: Included `Dockerfile` and `docker-compose.yml`.

---

## 🚀 Getting Started

Follow these steps to run the complete Full-Stack application locally.

### Prerequisites
- Python 3.10+ installed.
- [Ollama](https://ollama.com/) installed and running locally.

### 1. Setting up the Local AI Engine (Ollama)
CourseAlign relies on Gemma 4 running locally to power the AI Tutor and Quiz systems.
1. Install Ollama and start the background service.
2. Open a terminal and run the following to download the model (it may take a few minutes):
   ```bash
   ollama run gemma4:2b
   ```
3. Once you see the prompt `>>>`, you can close it. Ollama is now serving the API on `http://localhost:11434`.

### 2. Setting up the Backend API
1. Open your terminal or Command Prompt.
2. Navigate to the project root and start the virtual environment (if you have one) or install requirements:
   ```bash
   cd backend
   pip install fastapi uvicorn pydantic passlib bcrypt python-jose python-multipart requests
   ```
3. *(Optional)* Create an Admin user to access the Admin portal:
   ```bash
   python create_admin.py
   ```
4. Start the backend server:
   ```bash
   python -m uvicorn main:app --reload
   ```
   *You should see a message indicating the app is running on `http://127.0.0.1:8000`.*

### 3. Setting up the Frontend
The frontend consists of static files that need to be served over HTTP to prevent CORS errors and allow the Service Worker/PWA to function properly.

1. Open a **new** terminal window.
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
- **`start_frontend.bat`**: Double-click this to start the UI server and automatically open the application in your browser.

## Troubleshooting
- **"Error communicating with AI"**: Make sure your Ollama software is running in the background and you have pulled the `gemma4:2b` model.
- **"Failed to Fetch"**: This means your frontend cannot communicate with the backend. Ensure the backend terminal is open, running without errors, and hosted on port `8000`.
