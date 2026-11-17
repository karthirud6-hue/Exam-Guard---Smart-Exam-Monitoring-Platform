from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone

from database import get_db_connection
from security import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Password hashing configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Login security settings
MAX_FAILED_ATTEMPTS = 3
LOCKOUT_DURATION = timedelta(hours=1)


# Login request format
class LoginRequest(BaseModel):
    username: str
    password: str


# Verify password
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


# Login API
@router.post("/login")
def login(user: LoginRequest):

    conn = get_db_connection()

    try:
        now = datetime.now(timezone.utc)

        # Find user
        db_user = conn.execute(
            "SELECT * FROM users WHERE username = ?",
            (user.username,)
        ).fetchone()

        if not db_user:
            raise HTTPException(
                status_code=401,
                detail="Invalid username or password"
            )

        # Check previous login attempts
        attempts = conn.execute(
            "SELECT * FROM login_attempts WHERE identifier = ?",
            (user.username,)
        ).fetchone()

        if attempts and attempts["locked_until"]:

            locked_until = datetime.fromisoformat(
                attempts["locked_until"]
            )

            if locked_until > now:
                remaining = locked_until - now
                minutes = max(1, int(remaining.total_seconds() / 60))

                raise HTTPException(
                    status_code=403,
                    detail=f"Account locked. Try again after approximately {minutes} minutes."
                )

        # Verify password
        if not verify_password(user.password, db_user["password"]):

            failed_attempts = (
                attempts["failed_attempts"] if attempts else 0
            ) + 1

            locked_until = None

            if failed_attempts >= MAX_FAILED_ATTEMPTS:
                locked_until = (
                    now + LOCKOUT_DURATION
                ).isoformat()

            conn.execute(
                """
                INSERT INTO login_attempts
                    (identifier, failed_attempts, locked_until, last_attempt)
                VALUES (?, ?, ?, ?)

                ON CONFLICT(identifier)
                DO UPDATE SET
                    failed_attempts = excluded.failed_attempts,
                    locked_until = excluded.locked_until,
                    last_attempt = excluded.last_attempt
                """,
                (
                    user.username,
                    failed_attempts,
                    locked_until,
                    now.isoformat()
                )
            )

            conn.commit()

            if failed_attempts >= MAX_FAILED_ATTEMPTS:
                raise HTTPException(
                    status_code=403,
                    detail="Too many failed attempts. Your account is locked for 1 hour."
                )

            remaining_attempts = MAX_FAILED_ATTEMPTS - failed_attempts

            raise HTTPException(
                status_code=401,
                detail=f"Invalid username or password. {remaining_attempts} attempts remaining."
            )

        # Successful login: reset failed attempts
        conn.execute(
            """
            UPDATE login_attempts
            SET failed_attempts = 0,
                locked_until = NULL,
                last_attempt = ?
            WHERE identifier = ?
            """,
            (now.isoformat(), user.username)
        )

        conn.commit()

        # Generate JWT token
        access_token = create_access_token({
            "sub": str(db_user["id"]),
            "username": db_user["username"],
            "role": db_user["role"]
        })

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "role": db_user["role"]
        }

    finally:
        conn.close()