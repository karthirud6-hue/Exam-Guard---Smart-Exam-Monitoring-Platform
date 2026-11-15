# ExamGuard – Authentication Backend

## Project Overview
ExamGuard is an authentication backend for a Smart Examination Monitoring Platform. It provides secure user login using JWT (JSON Web Tokens) and Role-Based Access Control (RBAC).

## Technologies Used
- Python
- FastAPI
- SQLite
- JWT Authentication
- Passlib (Password Hashing)
- Python-dotenv

## Key Features
- User login authentication
- JWT access token generation and verification
- Password hashing
- Role-Based Authorization
- Separate protected routes for Admin, Examiner, and Student
- SQLite database integration
- CORS configuration

## User Roles
- Admin
- Examiner
- Student

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /auth/login | User login |
| GET | /admin/dashboard | Admin-only access |
| GET | /examiner/dashboard | Examiner-only access |
| GET | /student/dashboard | Student-only access |

## How to Run

1. Create and activate a Python virtual environment.
2. Install dependencies:

   `pip install -r requirements.txt`

3. Configure the SECRET_KEY in the `.env` file.
4. Create the test users:

   `python create_test_users.py`

5. Start the FastAPI server:

   `uvicorn main:app --reload`

6. Open Swagger documentation:

   `http://127.0.0.1:8000/docs`

## Security
- Passwords are stored as hashes.
- JWT tokens are used for authentication.
- Role-based access prevents unauthorized access.
- Secret keys are stored in environment variables.
- Sensitive files are excluded using `.gitignore`.

## Note
This is a development-stage authentication backend. Test accounts are intended for development and testing only.