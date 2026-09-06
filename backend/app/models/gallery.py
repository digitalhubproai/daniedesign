from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base

class StudioGalleryImage(Base):
    """Photo in the about-page studio gallery."""

    __tablename__ = "studio_gallery"

    id = Column(Integer, primary_key=True, index=True)
    src = Column(String(500), nullable=False)
    alt = Column(String(255), nullable=False)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
