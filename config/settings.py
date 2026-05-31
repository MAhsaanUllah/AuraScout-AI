import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    FIRECRAWL_API_KEY = os.getenv("FIRECRAWL_API_KEY", "")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL_NAME = os.getenv("GEMINI_MODEL_NAME", "gemini-2.5-flash")

settings = Settings()
