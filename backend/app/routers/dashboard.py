"""CRM dashboard router: aggregated counts and recent items for the admin home page."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.project import Project
from app.models.blog import BlogPost
from app.models.service import Service
from app.models.contact import ContactSubmission
from app.models.creative import CreativeItem
from app.models.client import Client
from app.models.team import TeamMember

router = APIRouter(prefix="/dashboard", tags=["CRM Dashboard"])

@router.get("/summary", summary="Get CRM Dashboard Summary Statistics")
def get_dashboard_summary(db: Session = Depends(get_db)):
    """GET /dashboard/summary — single round-trip payload powering the admin
    dashboard: row counts for every managed table plus the most recent
    inquiries, projects and blog posts."""
    projects_count = db.query(Project).count()
    blogs_count = db.query(BlogPost).count()
    services_count = db.query(Service).count()
    inquiries_count = db.query(ContactSubmission).count()
    # subset count for the "new" triage state surfaced as a badge on the dashboard
    new_inquiries_count = db.query(ContactSubmission).filter(ContactSubmission.status == "new").count()
    creative_count = db.query(CreativeItem).count()
    clients_count = db.query(Client).count()
    team_count = db.query(TeamMember).count()

    # "recent" lists are trimmed to the handful of cards the dashboard renders
    recent_inquiries = db.query(ContactSubmission).order_by(ContactSubmission.created_at.desc()).limit(5).all()
    recent_projects = db.query(Project).order_by(Project.id.desc()).limit(4).all()
    recent_blogs = db.query(BlogPost).order_by(BlogPost.id.desc()).limit(4).all()

    return {
        "counts": {
            "projects": projects_count,
            "blogs": blogs_count,
            "services": services_count,
            "inquiries": inquiries_count,
            "new_inquiries": new_inquiries_count,
            "creative": creative_count,
            "clients": clients_count,
            "team": team_count,
        },
        "recent_inquiries": [
            {
                "id": i.id,
                "name": i.name,
                "email": i.email,
                "company": i.company,
                "service": i.service,
                "status": i.status,
                "created_at": i.created_at,
            }
            for i in recent_inquiries
        ],
        "recent_projects": [
            {
                "id": p.id,
                "slug": p.slug,
                "title": p.title,
                "category": p.category,
                "year": p.year,
                "image": p.image,
                "featured": p.featured,
            }
            for p in recent_projects
        ],
        "recent_blogs": [
            {
                "id": b.id,
                "slug": b.slug,
                "title": b.title,
                "category": b.category,
                "date": b.date,
                "image": b.image,
                "featured": b.featured,
            }
            for b in recent_blogs
        ],
    }
