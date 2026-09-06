from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base

class TeamMember(Base):
    """Team member profile shown in the site's team section."""

    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    role = Column(String(255), nullable=False)
    image = Column(String(500), nullable=False)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
