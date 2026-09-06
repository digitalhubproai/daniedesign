"""Re-exports all Pydantic schemas from one import site."""
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from app.schemas.blog import BlogCreate, BlogUpdate, BlogResponse
from app.schemas.service import ServiceCreate, ServiceUpdate, ServiceResponse
from app.schemas.creative import (
    CreativeCreate, CreativeResponse,
    ClientCreate, ClientResponse,
    TeamCreate, TeamResponse,
    GalleryCreate, GalleryResponse,
)
from app.schemas.stat import (
    StatCreate, StatResponse,
    ImpactStoryCreate, ImpactStoryResponse,
    ContactCreate, ContactResponse,
    UploadResponse, MultipleUploadResponse,
)

__all__ = [
    "LoginRequest", "TokenResponse",
    "ProjectCreate", "ProjectUpdate", "ProjectResponse",
    "BlogCreate", "BlogUpdate", "BlogResponse",
    "ServiceCreate", "ServiceUpdate", "ServiceResponse",
    "CreativeCreate", "CreativeResponse",
    "ClientCreate", "ClientResponse",
    "TeamCreate", "TeamResponse",
    "GalleryCreate", "GalleryResponse",
    "StatCreate", "StatResponse",
    "ImpactStoryCreate", "ImpactStoryResponse",
    "ContactCreate", "ContactResponse",
    "UploadResponse", "MultipleUploadResponse",
]
