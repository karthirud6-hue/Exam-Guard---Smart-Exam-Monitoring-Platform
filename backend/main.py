from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends

from auth import router as auth_router
from dependencies import require_role

app = FastAPI(
    title="ExamGuard Authentication API",
    description="JWT Authentication and Role-Based Authorization",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect authentication routes
app.include_router(auth_router)


# Admin protected route
@app.get("/admin/dashboard")
def admin_dashboard(
    user=Depends(require_role("admin"))
):
    return {
        "message": "Welcome to Admin Dashboard",
        "user": user["username"],
        "role": user["role"]
    }


# Examiner protected route
@app.get("/examiner/dashboard")
def examiner_dashboard(
    user=Depends(require_role("examiner"))
):
    return {
        "message": "Welcome to Examiner Dashboard",
        "user": user["username"],
        "role": user["role"]
    }


# Student protected route
@app.get("/student/dashboard")
def student_dashboard(
    user=Depends(require_role("student"))
):
    return {
        "message": "Welcome to Student Dashboard",
        "user": user["username"],
        "role": user["role"]
    }


@app.get("/")
def home():
    return {
        "message": "ExamGuard Authentication Backend is Running!"
    }
