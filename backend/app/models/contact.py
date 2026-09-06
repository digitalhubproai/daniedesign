from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.database import Base

class ContactSubmission(Base):
    """Lead captured from the public contact form; reviewed/managed in the admin CRM."""

    __tablename__ = "contact_submissions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    company = Column(String(255), nullable=True, default="")
    service = Column(String(100), nullable=False)
    message = Column(Text, nullable=False)
    # CRM workflow status, e.g. "new" -> "contacted" -> "closed"
    status = Column(String(50), default="new")
    created_at = Column(DateTime, default=datetime.utcnow)
