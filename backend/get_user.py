import sqlite3

conn = sqlite3.connect('coursealign.db')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()
cursor.execute("SELECT username FROM users LIMIT 1")
user = cursor.fetchone()
print("Found username:", user['username'])
