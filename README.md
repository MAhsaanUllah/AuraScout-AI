# 🌟 AuraScout AI

![Python](https://img.shields.io/badge/Python-3.9+-blue.svg?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg?logo=fastapi&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Powered%20By-Google%20Gemini-4285F4.svg?logo=google&logoColor=white)
![Security](https://img.shields.io/badge/Security-Strict%20Sanitization-success.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

**AuraScout AI** is an advanced, automated intelligence-gathering and lead-scouting platform. It leverages the power of modern search heuristics, web scraping, and generative AI to extract, parse, and organize high-value data into a sleek, real-time matrix dashboard.

---

## 🚀 What is AuraScout AI?

AuraScout AI acts as your automated research assistant. Instead of manually searching the web for businesses, contacts, or industry specific information, AuraScout automates the entire pipeline:
1. **Discover**: Uses Serper API (Places heuristic) to find relevant targets based on natural language queries.
2. **Scrape**: Integrates with the Firecrawl API to extract rich markdown data directly from targeted websites.
3. **Analyze**: Routes raw data through Google Gemini AI for intelligent schema parsing and sentiment/quality analysis.
4. **Present**: Displays the structured intelligence in a stunning, interactive Glassmorphism frontend interface.

## ✨ Key Features

- **🧠 Intelligent Discovery Engine**: Natural language processing to convert your queries into targeted search parameters.
- **🕸️ Automated Web Extraction**: Seamlessly scrape target domains for relevant context without manual copying.
- **🤖 LLM Schema Parsing**: Uses Gemini AI to force structured JSON extraction (Company, Industry, Contacts, Quality Score) from chaotic web data.
- **🛡️ DevSecOps & Security First**: 
  - Strict DOM sanitization to prevent XSS (Cross-Site Scripting) attacks.
  - Isolated environment mapping and untracked local runtime databases.
- **📊 Saved Intelligence Hub**: A responsive, dynamic data matrix that saves your successful scouts locally.
- **🎨 Glassmorphism UI**: A premium, modern, and highly responsive user interface with intuitive badges and layouts.

## 🏗️ Architecture Stack

### Backend (Python)
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) for hyper-fast, asynchronous API routing.
- **AI Integration**: `google-genai` for advanced reasoning and schema extraction.
- **Networking**: `httpx` for efficient, non-blocking asynchronous HTTP requests.
- **Data Validation**: `pydantic` for strict typing and payload validation.

### Frontend (Vanilla JS & CSS)
- **Design System**: Custom CSS with Glassmorphism effects, dynamic badges, and responsive tables.
- **Logic**: Pure Javascript (`app.js`) handling local storage routing (BYOK - Bring Your Own Key) and DOM rendering without heavy frontend frameworks.

## 📂 Project Structure

```text
aurascout-ai/
├── core/
│   ├── database.py       # SQLite connection mapping
│   ├── discovery.py      # Serper /places brain heuristic (Fault-tolerant)
│   ├── extractor.py      # Gemini response_schema parsing
│   └── scraper.py        # Firecrawl markdown logic
├── frontend/
│   ├── index.html        # Main static UI (Glassmorphism layout)
│   ├── app.js            # Frontend logic & secure DOM rendering
│   └── style.css         # Styling, terminal & badge rules
├── main.py               # FastAPI entry point & routers
├── requirements.txt      # Production dependencies
└── .gitignore            # Security Gatekeeper
```

## ⚙️ Getting Started

### 1. Clone & Setup
```bash
git clone https://github.com/yourusername/aurascout-ai.git
cd aurascout-ai
python -m venv venv
```

### 2. Activate Virtual Environment
- **Windows**: `venv\Scripts\activate`
- **Mac/Linux**: `source venv/bin/activate`

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the Server
```bash
uvicorn main:app --reload
```
Navigate to `http://127.0.0.1:8000` to start scouting!

---
*Built for precision. Engineered for security.*
