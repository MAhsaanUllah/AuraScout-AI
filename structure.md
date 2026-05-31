aurascout-ai/
│
├── config/
│   ├── __init__.py
│   └── settings.py          # Environment keys & AntiGravity model endpoints
│
├── core/
│   ├── __init__.py
│   ├── scraper.py           # Firecrawl API integration engine
│   └── extractor.py         # Claude Sonnet 4.6 Pydantic JSON logic
│
├── schemas/
│   ├── __init__.py
│   └── lead.py              # Strict Pydantic V2 models/contracts
│
├── utils/
│   ├── __init__.py
│   └── token_guard.py       # Tiktoken context trimming optimizer
│
├── .env.example             # Clean template for API keys
├── requirements.txt         # Production dependencies
└── main.py                  # FastAPI gateway wrapper / app entry point