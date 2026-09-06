from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON
from app.database import Base

class Project(Base):
    """Portfolio case study; free-form JSON columns keep the flexible sections schema-less."""

    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False, index=True)
    year = Column(String(20), nullable=False, default="2025")
    description = Column(Text, nullable=False)
    image = Column(String(500), nullable=False)
    video = Column(String(500), nullable=True, default="")
    # List of service names displayed as tags on the project card
    services = Column(JSON, default=list)
    featured = Column(Boolean, default=False, index=True)

    # Long-form case-study sections shown on the project detail page
    challenge = Column(Text, nullable=True, default="")
    approach = Column(Text, nullable=True, default="")
    design = Column(Text, nullable=True, default="")
    development = Column(Text, nullable=True, default="")
    outcome = Column(Text, nullable=True, default="")
    gallery = Column(JSON, default=list)
    features = Column(JSON, default=list)
    technologies = Column(JSON, default=list)

    # Manual display ordering across the portfolio listing
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
