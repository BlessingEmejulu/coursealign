from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import init_db
from app.routers import auth_router, course_router, bookmark_router, ai_router, admin_router
from app.core.config import settings

# Initialize database tables using sqlite3
init_db()

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router.router)
app.include_router(course_router.router)
app.include_router(bookmark_router.router)
app.include_router(ai_router.router)
app.include_router(admin_router.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the CourseAlign API"}
