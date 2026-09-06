"""Site statistics router: hero/section counters and impact stories."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any
from app.database import get_db
from app.models.stat import SiteStat, ImpactStory
from app.schemas.stat import (
    StatCreate,
    StatResponse,
    ImpactStoryCreate,
    ImpactStoryResponse,
)

router = APIRouter(prefix="/stats", tags=["Stats"])

@router.get("", response_model=Dict[str, Any], summary="Get all stats")
def get_all_stats(db: Session = Depends(get_db)):
    """GET /stats — public endpoint returning all stat groups in one object,
    each ordered by the manual `order` field."""
    # stats are split by placement: the `is_hero` flag (stored as int 0/1)
    # selects rows for the hero band vs the regular stats section
    main_stats = db.query(SiteStat).filter(SiteStat.is_hero == 0).order_by(SiteStat.order.asc()).all()
    hero_stats = db.query(SiteStat).filter(SiteStat.is_hero == 1).order_by(SiteStat.order.asc()).all()
    impact_stories = db.query(ImpactStory).order_by(ImpactStory.order.asc()).all()
    
    return {
        # ORM rows are converted explicitly since the response type is a
        # plain dict rather than a single response_model
        "stats": [StatResponse.model_validate(s) for s in main_stats],
        "hero_stats": [StatResponse.model_validate(s) for s in hero_stats],
        "impact_story": [ImpactStoryResponse.model_validate(s) for s in impact_stories],
    }

@router.post("", response_model=StatResponse, status_code=status.HTTP_201_CREATED, summary="Add stat")
def create_stat(stat_in: StatCreate, db: Session = Depends(get_db)):
    """POST /stats — adds a stat counter (admin CMS use); returns 201 with
    the stored row."""
    stat = SiteStat(**stat_in.model_dump())
    db.add(stat)
    db.commit()
    db.refresh(stat)
    return stat

@router.post("/impact-story", response_model=ImpactStoryResponse, status_code=status.HTTP_201_CREATED, summary="Add impact story")
def create_impact_story(story_in: ImpactStoryCreate, db: Session = Depends(get_db)):
    """POST /stats/impact-story — adds an impact story entry (admin CMS use);
    returns 201 with the stored row."""
    story = ImpactStory(**story_in.model_dump())
    db.add(story)
    db.commit()
    db.refresh(story)
    return story
