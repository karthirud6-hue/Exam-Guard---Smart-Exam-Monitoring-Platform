from database import get_db_connection
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

users = [
    ("admin", "Admin@123", "admin"),
    ("examiner", "Examiner@123", "examiner"),
    ("student", "Student@123", "student")
]

conn = get_db_connection()

for username, password, role in users:

    hashed_password = pwd_context.hash(password)

    conn.execute(
        """
        INSERT OR IGNORE INTO users (username, password, role)
        VALUES (?, ?, ?)
        """,
        (username, hashed_password, role)
    )

conn.commit()
conn.close()

print("Test users created successfully!")