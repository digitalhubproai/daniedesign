"""Application settings loaded from environment variables / .env, with safe defaults."""

import os
from pathlib import Path
from pydantic_settings import BaseSettings
from typing import List

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    """Central configuration for the API; each field can be overridden via .env."""

    PROJECT_NAME: str = "Danie Design CRM API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    
    # Neon DB
    DATABASE_URL: str = "postgresql://neondb_owner:npg_nz0GrtUuSE3X@ep-broad-glade-axr1a4qt-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    BASE_URL: str = "http://localhost:8000"
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001"
    
    # Uploads
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = 25
    
    # Admin CRM
    ADMIN_EMAIL: str = "admin@daniedesign.com"
    ADMIN_PASSWORD: str = "admin123456"
    # Signing key for admin JWTs — override via .env in production
    JWT_SECRET: str = "danie-design-crm-super-secret-key-2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    @property
    def cors_origin_list(self) -> List[str]:
        """CORS_ORIGINS as a list, dropping any blank entries."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def upload_path(self) -> Path:
        """Absolute upload directory, created on first access."""
        path = BASE_DIR / self.UPLOAD_DIR
        path.mkdir(parents=True, exist_ok=True)
        return path

    @property
    def normalized_database_url(self) -> str:
        """Rewrite legacy postgres:// scheme to postgresql:// for SQLAlchemy."""
        url = self.DATABASE_URL.strip()
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        return url

    class Config:
        # Load overrides from the backend/.env file; unknown keys are ignored
        env_file = str(BASE_DIR / ".env")
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
