"""Schemas for site stats, impact stories, contact inquiries and uploads."""
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class StatBase(BaseModel):
    """Shared fields for a numeric stat counter."""
    value: int
    suffix: str = "+"  # appended to the value when rendered, e.g. "120+"
    label: str
    description: Optional[str] = ""
    is_hero: Optional[int] = 0  # 1 = shown in the hero band, 0 = regular section
    order: Optional[int] = 0

class StatCreate(StatBase):
    """Full body for POST /stats."""
    pass

class StatResponse(StatBase):
    """Stat returned to clients, with server-managed metadata."""
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # allow building from ORM rows directly

class ImpactStoryBase(BaseModel):
    """Shared fields for an impact-story entry."""
    number: str  # display number, e.g. "01"
    title: str
    body: str
    order: Optional[int] = 0

class ImpactStoryCreate(ImpactStoryBase):
    """Full body for POST /stats/impact-story."""
    pass

class ImpactStoryResponse(ImpactStoryBase):
    """Impact story returned to clients, with server-managed metadata."""
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # allow building from ORM rows directly

class ContactCreate(BaseModel):
    """Public contact-form submission; email format is validated by Pydantic."""
    name: str
    email: EmailStr
    company: Optional[str] = ""
    service: str  # service the visitor is inquiring about
    message: str

class ContactResponse(BaseModel):
    """Stored inquiry returned to the admin, including triage status."""
    id: int
    name: str
    email: str
    company: Optional[str] = ""
    service: str
    message: str
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # allow building from ORM rows directly

class UploadResponse(BaseModel):
    """Result of a single successful file upload."""
    filename: str  # generated UUID storage name, not the original filename
    url: str
    content_type: str
    size: int  # bytes

class MultipleUploadResponse(BaseModel):
    """Batch upload result: only the files that were stored successfully."""
    uploaded: List[UploadResponse]
