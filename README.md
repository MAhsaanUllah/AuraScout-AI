# AuraScout-AI

![Python](https://img.shields.io/badge/Python-3.9+-blue.svg?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg?logo=fastapi&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Powered%20By-Google%20Gemini-4285F4.svg?logo=google&logoColor=white)
![Security](https://img.shields.io/badge/Security-Strict%20Sanitization-success.svg)

## 📖 Overview

AuraScout-AI is a high-performance, automated intelligence-gathering and lead-scouting platform. Engineered to eliminate manual research overhead, the system integrates advanced search heuristics, distributed web extraction, and generative AI schema parsing to organize unstructured web data into a deterministic, real-time matrix dashboard.

## 🚀 Architecture and Core Modules

The architecture is strictly modularized to enforce separation of concerns between data extraction, AI parsing, and user interface rendering.

### Workspace Blueprint

```text
aurascout-ai/
├── config/
│   ├── __init__.py
│   └── settings.py          # Environment keys & configuration management
├── core/
│   ├── __init__.py
│   ├── database.py          # SQLite connection and session management
│   ├── discovery.py         # Serper heuristic engine (Fault-tolerant batching)
│   ├── extractor.py         # Gemini AI strict response_schema parsing
│   ├── models.py            # Data modeling layer
│   └── scraper.py           # Firecrawl markdown integration
├── frontend/
│   ├── index.html           # Main static UI (Glassmorphism layout)
│   ├── app.js               # Frontend logic & secure DOM rendering (BYOK routing)
│   └── style.css            # Responsive matrix styling & badge rules
├── schemas/
│   └── lead.py              # Pydantic schemas for data validation
├── .gitignore               # Strict security & caching gatekeeper
├── main.py                  # FastAPI entry point & API routers
└── requirements.txt         # Pinned production dependencies
```

## 🔐 DevSecOps & Security Implementations

- **Strict DOM Sanitization**: Direct mapping of external payloads using text node assignments (`.textContent`) to neutralize Cross-Site Scripting (XSS) vectors.
- **Isolated Runtimes**: Local SQLite binaries, `__pycache__`, environment keys (`.env`), and python virtual environments are completely disconnected from source tracking.
- **Graceful Fault Tolerance**: High-coverage try-except mapping boundaries ensure malformed upstream payloads safely degrade without compromising batch concurrent loop execution.

## ⚙️ Installation & Deployment

### 1. Repository Clone
```bash
git clone https://github.com/MAhsaanUllah/AuraScout-AI.git
cd AuraScout-AI
```

### 2. Environment Configuration
Initialize a secure Python virtual environment and pull production dependencies:
```bash
python -m venv venv
# Windows: venv\Scripts\activate
# Unix: source venv/bin/activate
pip install -r requirements.txt
```

### 3. Initialize Engine
Execute the FastAPI router:
```bash
uvicorn main:app --reload
```
Navigate to `http://127.0.0.1:8000` to interact with the frontend client.

---
*Engineered for precision. Built for scale.*
