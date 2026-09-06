"""Schemas for the smaller content collections: creative wall, clients,
team members and studio gallery."""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CreativeBase(BaseModel):
    """Shared fields for creative-wall items."""
    label: str
    image: str
    category: str
    order: Optional[int] = 0

class CreativeCreate(CreativeBase):
    """Full body for POST /creative."""
    pass

class CreativeResponse(CreativeBase):
    """Creative item returned to clients, with server-managed metadata."""
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # allow building from ORM rows directly

class ClientBase(BaseModel):
    """Shared fields for client logos/testimonials."""
    name: str
    quote: Optional[str] = None
    logo: Optional[str] = None
    featured: bool = False
    order: Optional[int] = 0

class ClientCreate(ClientBase):
    """Full body for POST /clients."""
    pass

class ClientResponse(ClientBase):
    """Client returned to clients, with server-managed metadata."""
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # allow building from ORM rows directly

class TeamBase(BaseModel):
    """Shared fields for team members."""
    name: str
    role: str
    image: str
    order: Optional[int] = 0

class TeamCreate(TeamBase):
    """Full body for POST /team."""
    pass

class TeamResponse(TeamBase):
    """Team member returned to clients, with server-managed metadata."""
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # allow building from ORM rows directly

class GalleryBase(BaseModel):
    """Shared fields for studio gallery images."""
    src: str
    alt: str  # accessibility text for the image
    order: Optional[int] = 0

class GalleryCreate(GalleryBase):
    """Full body for POST /gallery."""
    pass

class GalleryResponse(GalleryBase):
    """Gallery image returned to clients, with server-managed metadata."""
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # allow building from ORM rows directly
