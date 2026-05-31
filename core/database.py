import sqlite3
import threading

# SQLite connection mapping
db_lock = threading.Lock()
DB_NAME = "leads.db"

def init_db():
    with db_lock:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS leads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company TEXT,
                industry TEXT,
                contact TEXT,
                quality TEXT,
                engine TEXT,
                confidence_metric TEXT
            )
        ''')
        conn.commit()
        conn.close()

def save_lead_to_db(lead_data: dict):
    with db_lock:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO leads (company, industry, contact, quality, engine, confidence_metric)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            lead_data.get("company", "Unknown"),
            lead_data.get("industry", "Unknown"),
            lead_data.get("contact", "N/A"),
            lead_data.get("quality", "Scraped"),
            lead_data.get("engine", "🤖 AI Engine"),
            lead_data.get("confidenceMetric", "")
        ))
        conn.commit()
        conn.close()
