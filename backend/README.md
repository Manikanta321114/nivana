# NIVASA API — FastAPI Backend

Backend service for the **NIVASA** rental housing platform. Built with **FastAPI**, **Uvicorn**, **SQLAlchemy**, and **Pydantic**.

---

## 📁 Architecture & Folder Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── core/                  # Core configurations & database setup
│   │   ├── __init__.py
│   │   ├── config.py          # Settings management (pydantic-settings, CORS)
│   │   └── database.py        # SQLAlchemy Base & session dependency placeholder
│   ├── models/                # SQLAlchemy database models
│   │   ├── __init__.py
│   │   ├── base.py            # Declarative base
│   │   ├── property.py        # Property model definition
│   │   └── request.py         # Booking & callback request model
│   ├── schemas/               # Pydantic schemas (Request/Response validation)
│   │   ├── __init__.py
│   │   ├── property.py        # Property input/output schemas
│   │   ├── request.py         # Request schemas
│   │   └── auth.py            # Authentication & token schemas
│   ├── services/              # Business logic layer
│   │   ├── __init__.py
│   │   └── property_service.py# Property query operations
│   └── api/                   # REST API routes
│       ├── __init__.py
│       └── v1/
│           ├── __init__.py
│           ├── api.py         # Router aggregation
│           └── endpoints/
│               ├── __init__.py
│               ├── properties.py # /api/v1/properties
│               └── requests.py   # /api/v1/requests
├── main.py                    # FastAPI application entrypoint
├── .env.example               # Template environment variables (placeholders only)
├── .gitignore                 # Backend-specific ignore rules
├── README.md                  # This documentation
└── venv/                      # Existing Python virtual environment
```

---

## 🚀 Quickstart Guide

### 1. Environment Configuration

Copy `.env.example` to create your local `.env`:

```powershell
cd C:\Users\HP\.gemini\antigravity\scratch\nivasa\backend
Copy-Item .env.example .env
```

*(Placeholder values are included by default; real database credentials should not be committed).*

---

### 2. Activate the Existing Virtual Environment

The virtual environment is already created inside `backend/venv`.

#### On Windows (PowerShell):
```powershell
cd C:\Users\HP\.gemini\antigravity\scratch\nivasa\backend
.\venv\Scripts\Activate.ps1
```
> *If you encounter an execution policy restriction in PowerShell, run:*
> `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`

#### On Windows (Command Prompt `cmd.exe`):
```cmd
cd C:\Users\HP\.gemini\antigravity\scratch\nivasa\backend
venv\Scripts\activate.bat
```

#### On macOS / Linux (if cloned elsewhere):
```bash
source venv/bin/activate
```

---

### 3. Run the Backend Server

With the virtual environment activated, run the development server with live reload:

```powershell
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Alternatively, you can run directly using python:
```powershell
python main.py
```

---

## 🌐 Endpoints & API Documentation

Once the server is running on `http://127.0.0.1:8000`:

| Endpoint | Method | Description |
|---|---|---|
| `http://127.0.0.1:8000/` | GET | Root API landing message and status |
| `http://127.0.0.1:8000/health` | GET | Service health check |
| `http://127.0.0.1:8000/docs` | GET | Interactive Swagger UI documentation |
| `http://127.0.0.1:8000/redoc` | GET | ReDoc API documentation |
| `http://127.0.0.1:8000/openapi.json` | GET | OpenAPI schema specification |
| `http://127.0.0.1:8000/api/v1/properties` | GET | Public properties route (ready for DB) |
| `http://127.0.0.1:8000/api/v1/requests` | POST | Tenant callback/visit request route |

---

## 🔒 Security & Database Notes

- **CORS**: Configured to accept requests from the frontend at `http://localhost:5173` and `http://127.0.0.1:5173`.
- **Database**: Supabase integration is intentionally deferred. No live database connection is made on startup.
- **Authentication**: Zero hardcoded credentials or demo keys exist in this codebase.
