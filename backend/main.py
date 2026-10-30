"""NIVASA API - FastAPI Application Entrypoint."""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router

# Initialize FastAPI application
app = FastAPI(
    title="NIVASA API",
    version=settings.VERSION,
    description="Backend API for the NIVASA Rental Property Platform",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# CORS Configuration for frontend origins (Local Vite + Production Vercel domain)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=r"^https:\/\/.*\.vercel\.app$" if settings.ENVIRONMENT == "production" else None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["General"])
async def root():
    """Root landing endpoint providing API status and documentation links."""
    return {
        "message": "Welcome to NIVASA API",
        "app": "NIVASA API",
        "version": settings.VERSION,
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/health",
        "status": "online",
        "environment": settings.ENVIRONMENT,
    }


@app.get("/health", tags=["Health"])
async def health():
    """Health check endpoint to verify backend service availability on Render."""
    return {
        "status": "ok",
        "app": "NIVASA API",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
    }


# Include API v1 router
app.include_router(api_router, prefix=settings.API_V1_STR)


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", settings.PORT))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=settings.ENVIRONMENT != "production")
