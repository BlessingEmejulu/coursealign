import sqlite3

try:
    conn = sqlite3.connect('coursealign.db')
    cursor = conn.cursor()
    cursor.execute("ALTER TABLE users ADD COLUMN level TEXT DEFAULT '100L'")
    conn.commit()
    print("Successfully added 'level' column to users table.")
except sqlite3.OperationalError as e:
    print(f"Error (might already exist): {e}")
finally:
    conn.close()
