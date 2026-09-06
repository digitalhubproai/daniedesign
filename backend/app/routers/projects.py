"""Portfolio project router: public browsing endpoints plus CRUD for the admin CMS."""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("", response_model=List[ProjectResponse], summary="Get all projects")
def get_projects(
    category: Optional[str] = Query(None, description="Filter by category"),
    featured: Optional[bool] = Query(None, description="Filter featured"),
    search: Optional[str] = Query(None, description="Search in title or description"),
    db: Session = Depends(get_db)
):
    """GET /projects — public list endpoint with optional category, featured
    and text-search filters. Results are ordered by the manual `order` field
    first, then newest id as the tie-breaker."""
    query = db.query(Project)
    # the frontend sends "All" as a sentinel meaning "no filter"
    if category and category != "All":
        query = query.filter(Project.category.ilike(f"%{category}%"))
    if featured is not None:
        query = query.filter(Project.featured == featured)
    # ilike = case-insensitive partial match across the searchable columns
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (Project.title.ilike(search_fmt)) | (Project.description.ilike(search_fmt))
        )
    return query.order_by(Project.order.asc(), Project.id.desc()).all()

@router.get("/{slug}", response_model=ProjectResponse, summary="Get project by slug")
def get_project_by_slug(slug: str, db: Session = Depends(get_db)):
    """GET /projects/{slug} — public detail lookup by slug; 404 if missing."""
    project = db.query(Project).filter(Project.slug == slug).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Project '{slug}' not found")
    return project

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED, summary="Create new project")
def create_project(project_in: ProjectCreate, db: Session = Depends(get_db)):
    """POST /projects — creates a project (admin CMS use; no auth guard here).
    Slugs must be unique, so an existing slug is rejected with 400."""
    existing = db.query(Project).filter(Project.slug == project_in.slug).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Project with slug '{project_in.slug}' already exists")
    
    project = Project(**project_in.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.put("/{slug}", response_model=ProjectResponse, summary="Update project")
def update_project(slug: str, project_in: ProjectUpdate, db: Session = Depends(get_db)):
    """PUT /projects/{slug} — partial update (admin CMS use); 404 if the slug
    does not exist. Only the fields present in the payload are applied."""
    project = db.query(Project).filter(Project.slug == slug).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    # exclude_unset keeps fields omitted from the request untouched (PATCH-like semantics)
    update_data = project_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(project, field, val)
        
    db.commit()
    db.refresh(project)
    return project

@router.delete("/{slug}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete project")
def delete_project(slug: str, db: Session = Depends(get_db)):
    """DELETE /projects/{slug} — permanently removes the project (admin CMS
    use); 404 if not found, 204 with empty body on success."""
    project = db.query(Project).filter(Project.slug == slug).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    db.delete(project)
    db.commit()
    return None
