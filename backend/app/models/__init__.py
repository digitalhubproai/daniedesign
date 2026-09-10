"""Aggregates all ORM models so a single import exposes every table class to Alembic/Base.metadata."""

from app.database import Base
from app.models.project import Project
from app.models.blog import BlogPost
from app.models.service import Service
from app.models.creative import CreativeItem
from app.models.client import Client
from app.models.team import TeamMember
from app.models.gallery import StudioGalleryImage
from app.models.stat import SiteStat, ImpactStory
from app.models.contact import ContactSubmission
from app.models.admin import AdminUser
from app.models.stored_file import StoredFile

__all__ = [
    "Base",
    "Project",
    "BlogPost",
    "Service",
    "CreativeItem",
    "Client",
    "TeamMember",
    "StudioGalleryImage",
    "SiteStat",
    "ImpactStory",
    "ContactSubmission",
    "AdminUser",
    "StoredFile",
]
