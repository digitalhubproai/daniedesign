"""Schemas for portfolio projects: create/update/response shapes."""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ProjectBase(BaseModel):
    """Shared fields for every project representation."""
    slug: str
    title: str
    category: str
    year: str = "2025"  # display string, not a date
    description: str
    image: str
    video: Optional[str] = ""
    services: List[str] = Field(default_factory=list)
    featured: bool = False
    # case-study narrative sections shown on the project detail page
    challenge: Optional[str] = ""
    approach: Optional[str] = ""
    design: Optional[str] = ""
    development: Optional[str] = ""
    outcome: Optional[str] = ""
    gallery: List[str] = Field(default_factory=list)
    features: List[str] = Field(default_factory=list)
    technologies: List[str] = Field(default_factory=list)
    order: Optional[int] = 0  # manual sort position used by list endpoints

class ProjectCreate(ProjectBase):
    """Full body for POST /projects — all base fields required."""
    pass

class ProjectUpdate(BaseModel):
    """Partial update for PUT /projects/{slug}: every field optional and
    omitted fields are left unchanged (exclude_unset on dump)."""
    title: Optional[str] = None
    category: Optional[str] = None
    year: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    video: Optional[str] = None
    services: Optional[List[str]] = None
    featured: Optional[bool] = None
    challenge: Optional[str] = None
    approach: Optional[str] = None
    design: Optional[str] = None
    development: Optional[str] = None
    outcome: Optional[str] = None
    gallery: Optional[List[str]] = None
    features: Optional[List[str]] = None
    technologies: Optional[List[str]] = None
    order: Optional[int] = None

class ProjectResponse(ProjectBase):
    """Project returned to clients: base fields plus server-managed metadata."""
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # allow building from ORM rows directly
