from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, LargeBinary
from app.database import Base

class StoredFile(Base):
    """An uploaded media file stored as a bytea blob in the database.

    Uploads live in the DB (not on disk) because Vercel serverless functions
    have an ephemeral, read-only filesystem; the Neon Postgres we already use
    doubles as the media store and is shared between local dev and production.
    """

    __tablename__ = "stored_files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), unique=True, index=True, nullable=False)  # uuid-hex + extension
    content_type = Column(String(100), nullable=False, default="application/octet-stream")
    size = Column(Integer, nullable=False, default=0)  # bytes
    modified_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    data = Column(LargeBinary, nullable=False)  # bytea on Postgres, BLOB on the SQLite dev fallback
