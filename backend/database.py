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


# Initialize database
create_users_table()