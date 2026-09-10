"""SQLAlchemy engine, session factory and declarative Base.

Builds the Neon Postgres engine first; if that fails (e.g. no network or bad
URL) it falls back to a local SQLite file so development can continue offline.
"""

import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.config import settings

logger = logging.getLogger(__name__)

db_url = settings.normalized_database_url

connect_args = {}
engine_kwargs = {
    "pool_pre_ping": True,  # recycle dead connections instead of erroring on them
}

if db_url.startswith("sqlite"):
    # SQLite sessions aren't thread-safe by default; FastAPI uses threads
    connect_args = {"check_same_thread": False}
    engine_kwargs["connect_args"] = connect_args
else:
    # Modest pool sized for Neon's connection limits; recycle before server-side idle timeouts
    engine_kwargs["pool_size"] = 10
    engine_kwargs["max_overflow"] = 20
    engine_kwargs["pool_recycle"] = 300

try:
    engine = create_engine(db_url, **engine_kwargs)
    logger.info(f"Database engine initialized for Neon DB")
except Exception as e:
    logger.error(f"Failed to initialize database engine: {e}")
    if settings.ENVIRONMENT != "development":
        # On serverless (Vercel) a local SQLite file is read-only anyway; fail
        # loudly instead of masking a misconfigured DATABASE_URL with a doomed fallback
        raise
    fallback_url = "sqlite:///./daniedesign.db"
    engine = create_engine(fallback_url, connect_args={"check_same_thread": False})
    logger.warning(f"Fallen back to local SQLite: {fallback_url}")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """FastAPI dependency yielding a request-scoped session, always closed afterwards."""
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
