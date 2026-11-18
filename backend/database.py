
import sqlite3

# Connect to SQLite database
def get_db_connection():
    conn = sqlite3.connect("examguard.db")
    conn.row_factory = sqlite3.Row
    return conn


# Create users table
def create_users_table():
    conn = get_db_connection()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


# Create login attempts table
def create_login_attempts_table():
    conn = get_db_connection()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS login_attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            identifier TEXT UNIQUE NOT NULL,
            failed_attempts INTEGER DEFAULT 0,
            locked_until TEXT,
            last_attempt TEXT
        )
    """)

    conn.commit()
    conn.close()


# Initialize database
create_users_table()
create_login_attempts_table()
def create_exams_table():
    conn = get_db_connection()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS examinations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            exam_name TEXT NOT NULL,
            subject TEXT NOT NULL,
            exam_date TEXT NOT NULL,
            start_time TEXT NOT NULL,
            duration INTEGER NOT NULL,
            total_marks INTEGER NOT NULL,
            total_questions INTEGER NOT NULL,
            created_by TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()


create_exams_table()