from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from app.database import Base

class Service(Base):
    """Service offering shown on the services page, including its hero video and accent color."""

    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    # Display number ("01"–"04") shown next to the service title
    number = Column(String(10), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    # Capability tags rendered under the service description
    capabilities = Column(JSON, default=list)
    # Frontend route this service links to (e.g. /services/branding)
    href = Column(String(255), nullable=False)
    image = Column(String(500), nullable=False)
    tagline = Column(String(255), nullable=False)
    video = Column(String(500), nullable=True)
    # Accent color used for the service's themed UI highlights
    accent = Column(String(50), nullable=False, default="#ff4d1f")
    
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
