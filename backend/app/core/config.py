"""Application Configuration Settings."""
import os
from typing import List, Union, Optional
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "NIVASA API"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    PORT: int = 8000

    # Production frontend URL (e.g. https://nivasa.vercel.app)
    FRONTEND_URL: Optional[str] = None

    # CORS settings - origins allowed to make API requests
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                import json
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    @property
    def cors_origins(self) -> List[str]:
        """Combine BACKEND_CORS_ORIGINS and FRONTEND_URL dynamically."""
        origins = list(self.BACKEND_CORS_ORIGINS)
        if self.FRONTEND_URL:
            url = self.FRONTEND_URL.strip().rstrip("/")
            if url and url not in origins:
                origins.append(url)
        return origins

    # Database connection (Supabase PostgreSQL connection string)
    DATABASE_URL: str = "postgresql+psycopg://postgres:placeholder@localhost:5432/nivasa"

    # Security placeholders
    SECRET_KEY: str = "placeholder-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    # Supabase Auth Configuration (Asymmetric ES256 / JWKS)
    SUPABASE_URL: str = "https://lfkzljzekwprczcotspr.supabase.co"
    SUPABASE_JWT_ISSUER: str = "https://lfkzljzekwprczcotspr.supabase.co/auth/v1"
    SUPABASE_JWT_AUDIENCE: str = "authenticated"
    SUPABASE_JWKS_URL: str = "https://lfkzljzekwprczcotspr.supabase.co/auth/v1/.well-known/jwks.json"
    SUPABASE_JWT_ALGORITHMS: List[str] = ["ES256"]

    # Public client key
    SUPABASE_ANON_KEY: str = "placeholder-anon-key"

    # Privileged server key (BACKEND ONLY - NEVER EXPOSE TO FRONTEND)
    SUPABASE_SERVICE_ROLE_KEY: str = "placeholder-service-role-key"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
