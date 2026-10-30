"""Database setup and session management (Placeholder).

Note:
Supabase database connection is deferred per requirements.
No connection is initiated during application startup.
"""
from typing import Generator
from sqlalchemy.orm import declarative_base

# Declarative Base for SQLAlchemy models
Base = declarative_base()


def get_db() -> Generator:
    """Dependency placeholder for obtaining a database session.

    This will be configured when the live Supabase / PostgreSQL database
    connection is authorized and enabled.
    """
    try:
        # yield session placeholder
        yield None
    finally:
        pass
