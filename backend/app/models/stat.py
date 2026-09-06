from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.database import Base

class SiteStat(Base):
    """Numeric stat rendered on the site (e.g. "1000+ Projects Supported")."""

    __tablename__ = "site_stats"

    id = Column(Integer, primary_key=True, index=True)
    value = Column(Integer, nullable=False)
    # Appended to the animated number (e.g. "+", "%")
    suffix = Column(String(20), nullable=False, default="+")
    label = Column(String(255), nullable=False)
    description = Column(Text, nullable=True, default="")
    # 0 = stats grid, 1 = homepage hero strip
    is_hero = Column(Integer, default=0)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class ImpactStory(Base):
    """Numbered narrative block ("01 Foundation", "02 Growth", ...) on the impact section."""

    __tablename__ = "impact_stories"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(String(20), nullable=False)
    title = Column(String(255), nullable=False)
    body = Column(Text, nullable=False)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
