"""Blog post router: public read endpoints plus CRUD used by the admin CMS."""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.blog import BlogPost
from app.schemas.blog import BlogCreate, BlogUpdate, BlogResponse

router = APIRouter(prefix="/blogs", tags=["Blogs"])

@router.get("", response_model=List[BlogResponse], summary="Get all blogs")
def get_blogs(
    category: Optional[str] = Query(None, description="Filter by category"),
    featured: Optional[bool] = Query(None, description="Filter featured"),
    search: Optional[str] = Query(None, description="Search in title or excerpt"),
    db: Session = Depends(get_db)
):
    """GET /blogs — public list endpoint with optional category, featured
    and text-search filters. Results are ordered by the manual `order`
    field first, then newest id as the tie-breaker."""
    query = db.query(BlogPost)
    # the frontend sends "All" as a sentinel meaning "no filter"
    if category and category != "All":
        query = query.filter(BlogPost.category.ilike(f"%{category}%"))
    if featured is not None:
        query = query.filter(BlogPost.featured == featured)
    # ilike = case-insensitive partial match across the searchable columns
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (BlogPost.title.ilike(search_fmt)) | 
            (BlogPost.excerpt.ilike(search_fmt)) |
            (BlogPost.category.ilike(search_fmt))
        )
    return query.order_by(BlogPost.order.asc(), BlogPost.id.desc()).all()

@router.get("/{slug}", response_model=BlogResponse, summary="Get blog by slug")
def get_blog_by_slug(slug: str, db: Session = Depends(get_db)):
    """GET /blogs/{slug} — public detail lookup by slug; 404 if missing."""
    post = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Blog '{slug}' not found")
    return post

@router.post("", response_model=BlogResponse, status_code=status.HTTP_201_CREATED, summary="Create new blog")
def create_blog(blog_in: BlogCreate, db: Session = Depends(get_db)):
    """POST /blogs — creates a blog post (admin CMS use; no auth guard here).
    Slugs must be unique, so an existing slug is rejected with 400."""
    existing = db.query(BlogPost).filter(BlogPost.slug == blog_in.slug).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Blog with slug '{blog_in.slug}' already exists")
    
    post = BlogPost(**blog_in.model_dump())
    db.add(post)
    db.commit()
    db.refresh(post)
    return post

@router.put("/{slug}", response_model=BlogResponse, summary="Update blog")
def update_blog(slug: str, blog_in: BlogUpdate, db: Session = Depends(get_db)):
    """PUT /blogs/{slug} — partial update (admin CMS use); 404 if the slug
    does not exist. Only the fields present in the payload are applied."""
    post = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog not found")

    # exclude_unset keeps fields omitted from the request untouched (PATCH-like semantics)
    update_data = blog_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(post, field, val)
        
    db.commit()
    db.refresh(post)
    return post

@router.delete("/{slug}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete blog")
def delete_blog(slug: str, db: Session = Depends(get_db)):
    """DELETE /blogs/{slug} — permanently removes the post (admin CMS use);
    404 if not found, 204 with empty body on success."""
    post = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog not found")
    db.delete(post)
    db.commit()
    # explicit None keeps FastAPI from serializing a body for the 204 response
    return None
