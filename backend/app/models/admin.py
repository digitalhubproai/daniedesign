from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base

class AdminUser(Base):
    """Admin CRM account used for JWT login; no relationship to public site content."""

    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), default="Super Admin")
    # bcrypt hash only — plaintext passwords are never stored
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="admin")
    created_at = Column(DateTime, default=datetime.utcnow)
