"""Schemas for service offerings: create/update/response shapes."""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ServiceBase(BaseModel):
    """Shared fields for every service representation."""
    number: str  # display number shown on the site, e.g. "01"
    title: str
    description: str
    capabilities: List[str] = Field(default_factory=list)
    href: str  # frontend route this card links to
    image: str
    tagline: str
    video: Optional[str] = ""
    accent: str = "#ff4d1f"  # brand highlight color for this service
    order: Optional[int] = 0

class ServiceCreate(ServiceBase):
    """Full body for POST /services — all base fields required."""
    pass

class ServiceUpdate(BaseModel):
    """Partial update for PUT /services/{id}: every field optional and
    omitted fields are left unchanged (exclude_unset on dump)."""
    number: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    capabilities: Optional[List[str]] = None
    href: Optional[str] = None
    image: Optional[str] = None
    tagline: Optional[str] = None
    video: Optional[str] = None
    accent: Optional[str] = None
    order: Optional[int] = None

class ServiceResponse(ServiceBase):
    """Service returned to clients: base fields plus server-managed metadata."""
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # allow building from ORM rows directly
