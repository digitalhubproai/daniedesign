from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base

class CreativeItem(Base):
    """Tile in the site's creative-services showcase grid."""

    __tablename__ = "creative_items"

    id = Column(Integer, primary_key=True, index=True)
    label = Column(String(255), nullable=False)
    image = Column(String(500), nullable=False)
    category = Column(String(100), nullable=False)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
