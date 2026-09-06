"""Schemas for blog posts: list/create/update/response shapes."""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class BlogContentBlock(BaseModel):
    """One section of a post body: a heading followed by its paragraphs."""
    heading: str
    paragraphs: List[str]

class BlogBase(BaseModel):
    """Shared fields for every blog representation."""
    slug: str
    title: str
    category: str
    # display strings (not real timestamps), rendered as-is on the site
    date: str = "May 2025"
    read_time: str = "4 min read"
    excerpt: str
    image: str
    featured: bool = False
    content: List[BlogContentBlock] = Field(default_factory=list)
    order: Optional[int] = 0

class BlogCreate(BlogBase):
    """Full body for POST /blogs — all base fields required."""
    pass

class BlogUpdate(BaseModel):
    """Partial update for PUT /blogs/{slug}: every field optional and
    omitted fields are left unchanged (exclude_unset on dump)."""
    title: Optional[str] = None
    category: Optional[str] = None
    date: Optional[str] = None
    read_time: Optional[str] = None
    excerpt: Optional[str] = None
    image: Optional[str] = None
    featured: Optional[bool] = None
    content: Optional[List[BlogContentBlock]] = None
    order: Optional[int] = None

class BlogResponse(BlogBase):
    """Blog returned to clients: base fields plus server-managed metadata."""
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # allow building from ORM rows directly
