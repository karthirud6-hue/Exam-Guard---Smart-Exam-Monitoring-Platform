from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel, Field

from auth import router as auth_router
from dependencies import require_role
from database import get_db_connection
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends

from auth import router as auth_router
from dependencies import require_role

app = FastAPI(
    title="ExamGuard Authentication API",
    description="JWT Authentication and Role-Based Authorization",
    version="1.0"
)

class ExamCreate(BaseModel):
    examName: str
    subject: str
    examDate: str
    startTime: str
    duration: int = Field(gt=0)
    totalMarks: int = Field(gt=0)
    totalQuestions: int = Field(gt=0)
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
@app.post("/exams")
def create_exam(
    exam: ExamCreate,
    user=Depends(require_role("admin", "examiner"))
):
    conn = get_db_connection()

    try:
        cursor = conn.execute("""
            INSERT INTO examinations (
                exam_name,
                subject,
                exam_date,
                start_time,
                duration,
                total_marks,
                total_questions,
                created_by
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            exam.examName,
            exam.subject,
            exam.examDate,
            exam.startTime,
            exam.duration,
            exam.totalMarks,
            exam.totalQuestions,
            user["username"]
        ))

        conn.commit()

        return {
            "message": "Examination created successfully!",
            "exam_id": cursor.lastrowid,
            "created_by": user["username"]
        }

    finally:
        conn.close()

# Get examinations
@app.get("/exams")
def get_exams(user=Depends(require_role("admin", "examiner"))):

    conn = get_db_connection()

    try:
        if user["role"] == "admin":
            rows = conn.execute("""
                SELECT * FROM examinations
                ORDER BY id DESC
            """).fetchall()

        else:
            rows = conn.execute("""
                SELECT * FROM examinations
                WHERE created_by = ?
                ORDER BY id DESC
            """, (user["username"],)).fetchall()

        return [dict(row) for row in rows]

    finally:
        conn.close()


# Delete an examination
@app.delete("/exams/{exam_id}")
def delete_exam(
    exam_id: int,
    user=Depends(require_role("admin", "examiner"))
):

    conn = get_db_connection()

    try:
        if user["role"] == "admin":
            cursor = conn.execute("""
                DELETE FROM examinations
                WHERE id = ?
            """, (exam_id,))

        else:
            cursor = conn.execute("""
                DELETE FROM examinations
                WHERE id = ? AND created_by = ?
            """, (exam_id, user["username"]))

        conn.commit()

        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Examination not found or you are not authorized to delete it."
            )

        return {
            "message": "Examination deleted successfully!"
        }

    finally:
        conn.close()