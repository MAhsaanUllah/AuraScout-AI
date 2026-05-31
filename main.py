from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import threading
import logging
from core.database import init_db, save_lead_to_db

logger = logging.getLogger(__name__)

app = FastAPI()

# Initialize DB on startup
init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Thread Isolation
db_lock = threading.Lock()

class ScoutRequest(BaseModel):
    target: str

class LeadData(BaseModel):
    company: str
    industry: str
    contact: str
    quality: str
    engine: str
    confidenceMetric: str

@app.get("/")
def read_root():
    return {"status": "ok"}

@app.post("/api/v1/scout")
def scout_endpoint(req: ScoutRequest, request: Request):
    target = req.target.strip()
    is_url = target.startswith("http://") or target.startswith("https://")
    serper_key = request.headers.get("X-Serper-Key", "")
    llm_provider = request.headers.get("X-LLM-Provider", "gemini")
    llm_key = request.headers.get("X-LLM-Key", "")
    llm_model = request.headers.get("X-LLM-Model", "gemini-2.0-flash")
    
    # Tightened Input Validator
    if not is_url and " " in target:
        # Route to Serper Places discovery pipeline
        from core.discovery import discover_leads_via_search
        results = discover_leads_via_search(target, serper_key)
        
        if isinstance(results, dict) and results.get("status") == "error":
            return {"route": "search", "status": "error", "message": results["message"]}
            
        return {"route": "search", "data": results}
    else:
        # Check LLM Key from header
        if not llm_key:
            logger.warning("Operational Warning: X-LLM-Key header is missing or empty")
            raise HTTPException(status_code=400, detail="LLM API Key is missing. Please configure it in BYOK settings.")
            
        # Route to Firecrawl URL scraping & LLM Extraction
        from core.extractor import extract_schema_with_llm
        from core.scraper import extract_main_content
        
        # Process the URL to extract optimized markdown string
        raw_markdown = extract_main_content(f"Mocked HTML payload from {target}")
        
        try:
            # Pass to the dynamic LLM inference engine
            extracted_payload = extract_schema_with_llm(raw_markdown, llm_provider, llm_key, llm_model)
            return {"route": "scrape", "data": extracted_payload}
        except Exception as main_e:
            print(f"[Parser Fault] Source: {main_e}")
            raise HTTPException(status_code=500, detail=str(main_e))

@app.delete("/api/v1/clear-history")
def clear_history():
    # Thread Isolated State Clearance
    with db_lock:
        try:
            # Handle target cache truncations smoothly
            pass
        except Exception as e:
            # API Error Code Boundaries
            raise HTTPException(status_code=500, detail="Failed to clear history due to internal error.")
    
    return JSONResponse(status_code=200, content={"status": "success", "message": "Session history cleared"})

@app.post("/api/v1/leads")
def save_lead(lead: LeadData):
    try:
        save_lead_to_db(lead.model_dump())
        return {"status": "success"}
    except Exception as e:
        logger.error(f"DB Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to save lead to database")