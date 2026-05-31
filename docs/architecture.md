# AuraScout-AI Architecture & Workspace Blueprint

This document maps out the physical layout of the repository to provide clear context for contributors and maintainers. The architecture enforces a strict separation of concerns between backend APIs, data extraction, AI processing, and frontend rendering.

```text
aurascout-ai/
├── config/
│   ├── __init__.py
│   └── settings.py          # Environment variables & runtime configurations
│
├── core/
│   ├── __init__.py
│   ├── database.py          # SQLite connection and session mapping
│   ├── discovery.py         # Serper search heuristic engine (fault-tolerant)
│   ├── extractor.py         # Gemini AI strict response_schema parsing
│   ├── models.py            # Core business logic models
│   └── scraper.py           # Firecrawl markdown extraction integration
│
├── frontend/
│   ├── index.html           # Main static UI (Glassmorphism layout)
│   ├── app.js               # Dynamic routing, API fallbacks & secure DOM logic
│   └── style.css            # Styling, terminal matrix effects & badge rules
│
├── schemas/
│   └── lead.py              # Strict Pydantic models for data validation
│
├── .github/
│   └── workflows/
│       └── deploy.yml       # Automated CI/CD pipeline for GitHub Pages
│
├── .gitignore               # Strict security & cache gatekeeper
├── main.py                  # FastAPI gateway wrapper & application entry point
├── requirements.txt         # Pinned production dependencies
└── README.md                # High-level engineering documentation
```

### Module Responsibilities

1. **`core/`**: The brain of the operation. Handles external scraping logic, database interactions, and the critical Gemini AI parsing pipelines.
2. **`frontend/`**: 100% Static web client built with Vanilla JS/CSS. Designed to securely interface with the backend or fall back to local test servers dynamically.
3. **`schemas/`**: Enforces strict data types. Anything coming in or out of the API is validated here first.
4. **`.github/`**: Houses the GitHub Actions runner which automatically deploys the `frontend/` layer to `gh-pages` on every main branch commit.
