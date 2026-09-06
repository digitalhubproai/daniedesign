from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON
from app.database import Base

class BlogPost(Base):
    """Blog article for the public site; the body lives in a JSON column, not related tables."""

    __tablename__ = "blogs"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False, index=True)
    # Display date as free text (e.g. "May 2025") rather than a real DATE column
    date = Column(String(100), nullable=False, default="May 2025")
    read_time = Column(String(50), nullable=False, default="4 min read")
    excerpt = Column(Text, nullable=False)
    image = Column(String(500), nullable=False)
    featured = Column(Boolean, default=False, index=True)

    # List of {heading, paragraphs} sections rendered in order on the article page
    content = Column(JSON, default=list)

    # Manual display ordering across the blog listing
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
