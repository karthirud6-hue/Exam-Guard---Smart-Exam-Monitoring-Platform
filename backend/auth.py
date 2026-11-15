from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext

from database import get_db_connection
from security import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Password hashing configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


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

    db_user = conn.execute(
        "SELECT * FROM users WHERE username = ?",
        (user.username,)
    ).fetchone()

    conn.close()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

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